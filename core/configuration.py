from core.env import CoreEnvConfig, env_config


class AuthConfig:
    CLIENT_ID: str = "my_very_cool_client_id"
    FRONTEND_URL: str = "http://localhost:8080"
    BACK_PATH: str = ""
    CURRENT_URL: str = "http://localhost:8000"
    LOGIN_BASE_URL: str = "http://localhost:5173"
    LOGIN_API_URL: str = "https://localhost:44363"
    NETWORK_ID: str = "019e21b8-1b5b-7a58-9a0b-b98b4ded1bd9"

    LOGIN_EXPIRATION_SECONDS: int = 60 * 5


class Config:
    env: CoreEnvConfig
    auth: AuthConfig

    def __init__(self) -> None:
        self.env = env_config
        self.auth = AuthConfig()


config = Config()
