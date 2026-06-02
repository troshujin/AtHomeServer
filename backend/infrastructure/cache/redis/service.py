from typing import cast

from core.configuration import config
from redis.asyncio import Redis


class RedisSessionService:
    def __init__(self):
        redis_url = config.env.REDIS_URL
        self.redis: Redis = Redis.from_url(  # pyright: ignore[reportUnknownMemberType]
            redis_url,
            decode_responses=True,
        )

    async def get(self, key: str) -> str | None:
        return cast(str | None, await self.redis.get(key))

    async def set(
        self,
        key: str,
        json_data: str,
        expires_in_seconds: int,
    ):
        await self.redis.set(key, json_data, ex=expires_in_seconds)

    async def delete(self, key: str):
        await self.redis.delete(key)
