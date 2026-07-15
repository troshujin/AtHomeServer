from typing import TYPE_CHECKING
from sqlalchemy.orm import mapped_column, relationship, Mapped

from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.workout import Workout
    from infrastructure.database.models.user_relation import UserRelation
    from infrastructure.database.models.blocked_user import BlockedUser
    from infrastructure.database.models.profile_card_stat import ProfileCardStat


class User(Base):
    __tablename__: str = "user"

    username: Mapped[str] = mapped_column()

    # Hides the profile card from everyone else (see GetUserCardUseCase) -
    # visitors get a clear "this card is private" instead of the stats.
    card_is_private: Mapped[bool] = mapped_column(default=False)

    workouts: Mapped[list["Workout"]] = relationship(back_populates="user")

    card_stats: Mapped[list["ProfileCardStat"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    # Split by FK column, not by direction: which side of the pair a user is
    # on is arbitrary (canonical ordering), so "outgoing vs incoming" is a
    # `requested_by_id` filter, not one of these two collections.
    relations_as_one: Mapped[list["UserRelation"]] = relationship(
        foreign_keys="UserRelation.user_id_one", back_populates="user_one"
    )
    relations_as_two: Mapped[list["UserRelation"]] = relationship(
        foreign_keys="UserRelation.user_id_two", back_populates="user_two"
    )

    blocked_users: Mapped[list["BlockedUser"]] = relationship(
        foreign_keys="BlockedUser.user_id", back_populates="user"
    )
    blocked_by: Mapped[list["BlockedUser"]] = relationship(
        foreign_keys="BlockedUser.target_user_id", back_populates="target_user"
    )
