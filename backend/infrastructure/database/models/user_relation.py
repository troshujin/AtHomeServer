from typing import TYPE_CHECKING
import uuid

from sqlalchemy import CheckConstraint, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from domain.constants.user_relation import UserRelationStatus
from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.user import User


class UserRelation(Base):
    """
    One row per unordered user pair (friend request/acceptance). `user_id_one`
    is always the smaller UUID so a pair can never be stored twice in reverse
    order; `requested_by_id` records which side of the pair initiated it,
    since the ordering itself carries no directional meaning.
    """

    __tablename__: str = "user_relation"
    __table_args__ = (
        UniqueConstraint("user_id_one", "user_id_two", name="uq_user_relation_pair"),
        CheckConstraint("user_id_one < user_id_two", name="ck_user_relation_pair_order"),
        CheckConstraint(
            "requested_by_id = user_id_one OR requested_by_id = user_id_two",
            name="ck_user_relation_requester_is_party",
        ),
    )

    status: Mapped[UserRelationStatus] = mapped_column()

    user_id_one: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user_id_two: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    requested_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))

    user_one: Mapped["User"] = relationship(
        foreign_keys=[user_id_one], back_populates="relations_as_one", lazy="selectin"
    )
    user_two: Mapped["User"] = relationship(
        foreign_keys=[user_id_two], back_populates="relations_as_two", lazy="selectin"
    )
    requested_by: Mapped["User"] = relationship(foreign_keys=[requested_by_id], lazy="selectin")
