import sys
from typing import ClassVar, TypeVar

from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

T = TypeVar("T", bound=BaseSettings)


class EnvConfig(BaseSettings):
    APP_ENV: str

    DB_CONNECTION_STRING: str
    REDIS_URL: str

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
    FRONTEND_URL: str = "https://myapp.localhost"
    BACK_PATH: str = ""
    DOMAIN: str = "myapp.localhost"
    CURRENT_URL: str = "https://myapp.localhost/api"
    LOGIN_BASE_URL: str = "http://localhost:5173"
    LOGIN_API_URL: str = "https://host.docker.internal:44363"
    NETWORK_ID: str = "019e21b8-1b5b-7a58-9a0b-b98b4ded1bd9"

    LOGIN_EXPIRATION_SECONDS: int = 60 * 5


class Config:
    env: EnvConfig
    auth: AuthConfig

    def __init__(self, env_config: EnvConfig) -> None:
        self.env = env_config
        self.auth = AuthConfig()


_env_config: EnvConfig = get_env_config(EnvConfig)
config = Config(_env_config)
