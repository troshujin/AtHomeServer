import sys
from typing import ClassVar, TypeVar

from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

T = TypeVar("T", bound=BaseSettings)


class EnvConfig(BaseSettings):
    APP_ENV: str

    DB_CONNECTION_STRING: str
    REDIS_URL: str
    CURRENT_DOMAIN: str
    LOGIN_BASE_URL: str
    LOGIN_API_URL: str
    NETWORK_ID: str

    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


def get_env_config(env_class: type[T]) -> T:
    try:
        cfg = env_class()
        return cfg

    except ValidationError as e:
        print("\nEnvironment Configuration Error")
        print("The application failed to start because of the following .env issues:\n")

        for error in e.errors():
            field = str(error["loc"][0]).upper()
            message = error["msg"]

            print(f"   -> {field}: {message}")

        print("\nPlease check your .env file and try again.\n")
        sys.exit(1)


class AuthConfig:
    CLIENT_ID: str = "athomeserver"
    FRONTEND_URL: str = "https://{domain}"
    BACK_PATH: str = ""
    DOMAIN: str = "{domain}"
    CURRENT_URL: str = "https://{domain}/api"
    NETWORK_ID: str = "none"
    # Filled from EnvConfig in init_auth - kept on auth so call sites
    # (login.py, trojonetworks api_client.py) keep reading config.auth.*.
    LOGIN_BASE_URL: str = ""
    LOGIN_API_URL: str = ""

    LOGIN_EXPIRATION_SECONDS: int = 60 * 5


class Config:
    env: EnvConfig
    auth: AuthConfig

    def __init__(self, env_config: EnvConfig) -> None:
        self.env = env_config
        self.auth = AuthConfig()
        self.init_auth()

    def init_auth(self):
        self.auth.FRONTEND_URL = self.auth.FRONTEND_URL.format(domain=self.env.CURRENT_DOMAIN)
        self.auth.DOMAIN = self.auth.DOMAIN.format(domain=self.env.CURRENT_DOMAIN)
        self.auth.CURRENT_URL = self.auth.CURRENT_URL.format(domain=self.env.CURRENT_DOMAIN)
        self.auth.NETWORK_ID = self.env.NETWORK_ID
        self.auth.LOGIN_BASE_URL = self.env.LOGIN_BASE_URL
        self.auth.LOGIN_API_URL = self.env.LOGIN_API_URL


_env_config: EnvConfig = get_env_config(EnvConfig)
config = Config(_env_config)
