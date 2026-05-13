import base64
import hashlib
import json
import os
import time
from typing import Any
from urllib.parse import urlencode

import httpx

CLIENT_ID = "your_client_id"
CURRENT_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
NETWORK_ID = "your_network_id"


class AuthService:
    def __init__(self, api_client: httpx.AsyncClient):
        # api_client would be your httpx.AsyncClient or similar
        self.api: httpx.AsyncClient = api_client

        # In Python, we abstract storage. This could be a DB, Redis, or local file.
        self.local_storage: dict[str, str] = {}
        self.session_storage: dict[str, str] = {}

        self.access_token_key: str = "accessToken"
        self.refresh_token_key: str = "refreshToken"

        self.user_proxy: dict[str, Any] | None = None
        self.network_claims: dict[str, Any] = {}

    @property
    def access_token(self) -> str | None:
        return self.local_storage.get(self.access_token_key)

    @property
    def refresh_token(self) -> str | None:
        return self.local_storage.get(self.refresh_token_key)

    @property
    def is_authenticated(self) -> bool:
        return self.access_token is not None

    @property
    def user_id(self) -> str | None:
        if not self.access_token:
            return None
        try:
            data = self._decode_jwt(self.access_token)
            return data.get("uid")
        except Exception:
            return None

    @property
    def user_name(self) -> str | None:
        if not self.access_token:
            return None
        try:
            data = self._decode_jwt(self.access_token)
            return data.get("name")
        except Exception:
            return None

    def initialize(self):
        self._set_network_claims()

    async def token_check(self):
        if (
            self.access_token
            and self._is_token_expired(self.access_token)
            and self.refresh_token
        ):
            await self.refresh_tokens()

    async def apply_headers(self, headers: dict[str, str]) -> dict[str, str]:
        """Equivalent to your Axios interceptor logic"""
        await self.token_check()

        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"

        return headers

    async def refresh_tokens(self):
        if not self.refresh_token:
            raise ValueError("No refresh token available")

        try:
            # Assuming self.api.post returns an object with a .json() method
            response = await self.api.post(
                "/auth/refresh", json={"refreshToken": self.refresh_token}
            )
            _ = response.raise_for_status()
            data: dict[str, str] = response.json()

            self._save_tokens(data["accessToken"], data["refreshToken"])
        except Exception as err:
            print(f"Failed to refresh tokens: {err}")
            self.clear_tokens()

    def login(self, redirect_url: str | None = None) -> str:
        """
        Instead of window.location.href, this returns the auth URL
        so your Python framework (FastAPI, Flask, etc.) can redirect the user.
        """
        code_verifier = self._generate_code_verifier()
        code_challenge = self._generate_code_challenge(code_verifier)

        self.session_storage["pkce_code_verifier"] = code_verifier

        state_raw = redirect_url or CURRENT_URL
        state = base64.urlsafe_b64encode(state_raw.encode()).decode().rstrip("=")
        back = base64.urlsafe_b64encode(f"{CURRENT_URL}/".encode()).decode().rstrip("=")

        self.session_storage["oauth_state"] = state

        params = {
            "clientId": CLIENT_ID,
            "codeChallenge": code_challenge,
            "state": state,
            "back": back,
        }

        auth_url = f"{FRONTEND_URL}/networks/{NETWORK_ID}/login?{urlencode(params)}"
        return auth_url

    async def callback(self, code: str, state: str) -> str:
        """
        Returns the decoded redirect URL on success so your framework can route the user.
        """
        stored_state = self.session_storage.get("oauth_state")

        if not code or state != stored_state:
            raise ValueError("Invalid state or missing code")

        code_verifier = self.session_storage.get("pkce_code_verifier")
        if not code_verifier:
            raise ValueError("Missing code verifier")

        payload = {
            "grantType": "authorization_code",
            "code": code,
            "clientId": CLIENT_ID,
            "redirectUri": f"{CURRENT_URL}/callback",
            "codeVerifier": code_verifier,
        }

        response = await self.api.post("/auth/token", json=payload)

        if response.status_code != 200:
            raise RuntimeError("Failed to exchange code for tokens.")

        data: dict[str, str] = response.json()
        self._save_tokens(data["accessToken"], data["refreshToken"])

        # Decode the state to find out where to redirect the user next
        redirect_to = base64.urlsafe_b64decode(stored_state + "==").decode()
        return redirect_to

    async def get_current_user(self) -> dict[str, Any]:
        if self.user_proxy:
            return self.user_proxy

        headers = await self.apply_headers({})
        response = await self.api.get("/me", headers=headers)
        _ = response.raise_for_status()

        self.user_proxy = response.json()
        return self.user_proxy

    def logout(self):
        self.clear_tokens()
        # In Python, you'd usually return a route to redirect to, e.g., return "/"
        return "/"

    def is_admin(self) -> bool:
        if not self.is_authenticated:
            return False
        # Simulating your ClaimChecker logic
        return self.network_claims.get(NETWORK_ID, {}).get("role") == "admin"

    # --- Internal Helpers ---

    def _save_tokens(self, a_token: str, r_token: str):
        self.local_storage[self.access_token_key] = a_token
        self.local_storage[self.refresh_token_key] = r_token
        self._set_network_claims()

    def clear_tokens(self):
        _ = self.local_storage.pop(self.access_token_key, None)
        _ = self.local_storage.pop(self.refresh_token_key, None)
        self.network_claims = {}
        self.user_proxy = None

    def _set_network_claims(self):
        if not self.access_token:
            self.clear_tokens()
            return

        try:
            decoded_payload = self._decode_jwt(self.access_token)
            networks = decoded_payload.get("networks")

            if not networks:
                print("Token missing 'networks' claim. Clearing tokens.")
                self.clear_tokens()
                return

            self.network_claims = networks
        except Exception as e:
            print(f"Failed to decode token or parse network claims: {e}")
            self.clear_tokens()

    # --- Utility Functions (Replacing imported TS libs) ---

    @staticmethod
    def _decode_jwt(token: str) -> dict[str, Any]:
        """Basic JWT payload decoder without signature verification (like the JS frontend)"""
        try:
            payload_b64 = token.split(".")[1]
            # Add padding if necessary
            payload_b64 += "=" * (-len(payload_b64) % 4)
            payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
            return json.loads(payload_json)
        except Exception:
            raise ValueError("Invalid JWT token")

    @staticmethod
    def _is_token_expired(token: str) -> bool:
        try:
            payload = AuthService._decode_jwt(token)
            exp = payload.get("exp")
            if not exp:
                return False
            # Check if current time is past expiration (with 5 seconds leeway)
            return time.time() > (exp - 5)
        except Exception:
            return True

    @staticmethod
    def _generate_code_verifier() -> str:
        """Generates a PKCE code verifier"""
        token = os.urandom(32)
        return base64.urlsafe_b64encode(token).decode("utf-8").rstrip("=")

    @staticmethod
    def _generate_code_challenge(verifier: str) -> str:
        """Generates a PKCE code challenge from the verifier"""
        digest = hashlib.sha256(verifier.encode("utf-8")).digest()
        return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")
