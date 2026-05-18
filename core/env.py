import sys
from typing import ClassVar, TypeVar

from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

T = TypeVar("T", bound=BaseSettings)


class CoreEnvConfig(BaseSettings):
    APP_ENV: str

    DB_CONNECTION_STRING: str
    REDIS_URL: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

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


env_config: CoreEnvConfig = get_env_config(CoreEnvConfig)
