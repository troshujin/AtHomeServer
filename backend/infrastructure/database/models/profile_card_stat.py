from typing import TYPE_CHECKING
import uuid

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.user import User


class ProfileCardStat(Base):
    """
    One stat a user pinned to their profile card. `stat_key` is a namespaced
    catalog key (see domain/constants/profile_stat.py) - only the *selection*
    is stored; the value behind it is computed fresh on read, since it changes
    with every workout (or future song) logged and would go stale in a column.
    `position` orders the slots; position 0 is the card's hero stat.
    """

    __tablename__: str = "profile_card_stat"
    __table_args__ = (
        UniqueConstraint("user_id", "stat_key", name="uq_profile_card_stat_user_key"),
    )

    stat_key: Mapped[str] = mapped_column()
    position: Mapped[int] = mapped_column()

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="card_stats")
