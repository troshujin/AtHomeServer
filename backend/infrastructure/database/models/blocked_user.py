from typing import TYPE_CHECKING
import uuid

from sqlalchemy import CheckConstraint, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.user import User


class BlockedUser(Base):
    """
    Directional and independent of `UserRelation`: blocking doesn't require
    (or imply) a friend relationship, and a mutual block is two rows, not one.
    """

    __tablename__: str = "blocked_user"
    __table_args__ = (
        UniqueConstraint("user_id", "target_user_id", name="uq_blocked_user_pair"),
        CheckConstraint("user_id != target_user_id", name="ck_blocked_user_not_self"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    target_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))

    user: Mapped["User"] = relationship(
        foreign_keys=[user_id], back_populates="blocked_users", lazy="selectin"
    )
    target_user: Mapped["User"] = relationship(
        foreign_keys=[target_user_id], back_populates="blocked_by", lazy="selectin"
    )
