import uuid
from pydantic import ValidationError
from redis.asyncio import Redis

from application.redis.dto import RedisLoginSessionDto, RedisSessionDto
from core.configuration import config


class RedisSessionService:
    def __init__(self):
        redis_url = config.env.REDIS_URL
        self.redis: Redis = Redis.from_url(redis_url, decode_responses=True)

    @staticmethod
    def get_session_key(session_id: str) -> str:
        return f"session_{session_id}"

    async def get_session(self, session_id: str) -> RedisSessionDto | None:
        key = self.get_session_key(session_id)
        raw_data: str | None = await self.redis.get(key)

        print(raw_data)

        if not raw_data:
            return None

        try:
            return RedisSessionDto.model_validate_json(raw_data)
        except ValidationError as e:
            print(f"Failed to parse Redis data for {key}: {e}")
            return None

    async def save_session(
        self,
        session_id: str,
        session_data: RedisSessionDto,
        expires_in_seconds: int,
    ):
        key = self.get_session_key(session_id)

        json_data = session_data.model_dump_json(by_alias=True)
        await self.redis.set(key, json_data, ex=expires_in_seconds)

    async def delete_session(self, session_id: str):
        key = self.get_session_key(session_id)
        await self.redis.delete(key)

    @staticmethod
    def get_login_session_key(session_id: str) -> str:
        return f"login_session_{session_id}"

    @staticmethod
    def new_session_id() -> str:
        return str(uuid.uuid4())

    async def get_login_session(self, session_id: str) -> RedisLoginSessionDto | None:
        key = self.get_session_key(session_id)
        raw_data: str | None = await self.redis.get(key)

        print(raw_data)

        if not raw_data:
            return None

        try:
            return RedisLoginSessionDto.model_validate_json(raw_data)
        except ValidationError as e:
            print(f"Failed to parse Redis data for {key}: {e}")
            return None

    async def save_login_session(
        self,
        session_id: str,
        session_data: RedisLoginSessionDto,
        expires_in_seconds: int,
    ):
        key = self.get_login_session_key(session_id)

        json_data = session_data.model_dump_json(by_alias=True)
        await self.redis.set(key, json_data, ex=expires_in_seconds)

    async def delete_login_session(self, session_id: str):
        key = self.get_login_session_key(session_id)
        await self.redis.delete(key)


redis_service = RedisSessionService()
