from typing import TYPE_CHECKING
from sqlalchemy.orm import mapped_column, relationship, Mapped

from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.workout import Workout


class User(Base):
    __tablename__: str = "user"

    username: Mapped[str] = mapped_column()

    workouts: Mapped[list[Workout]] = relationship(back_populates="user")
