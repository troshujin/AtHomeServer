from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.database.models import User
from infrastructure.database.repositories._base import BaseRepository


from typing import Annotated
from fastapi import Depends
from infrastructure.database.session import get_db_session

class UserRepository(BaseRepository[User]):
    def __init__(self, session: Annotated[AsyncSession, Depends(get_db_session)]) -> None:
        super().__init__(User, session)
