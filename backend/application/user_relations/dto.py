import uuid
from datetime import datetime

from core.common.schema import APIBaseModel, BaseEntity
from infrastructure.database.models import BlockedUser, UserRelation


class RelationUserDto(BaseEntity):
    username: str


class UserRelationDto(APIBaseModel):
    """One relation as seen from the current user's side: `user` is always
    the *other* person, whichever canonical slot they're stored in."""

    id: uuid.UUID
    created_at: datetime
    user: RelationUserDto


class UserRelationsDto(APIBaseModel):
    """The current user's relations, pre-grouped: accepted friendships,
    requests waiting on *me*, and requests I sent that wait on them."""

    friends: list[UserRelationDto]
    incoming: list[UserRelationDto]
    outgoing: list[UserRelationDto]


class BlockedUserDto(APIBaseModel):
    id: uuid.UUID
    created_at: datetime
    user: RelationUserDto


def to_relation_dto(relation: UserRelation, me_id: uuid.UUID) -> UserRelationDto:
    other = relation.user_two if relation.user_id_one == me_id else relation.user_one
    return UserRelationDto(
        id=relation.id,
        created_at=relation.created_at,
        user=RelationUserDto.model_validate(other),
    )


def to_blocked_dto(block: BlockedUser) -> BlockedUserDto:
    return BlockedUserDto(
        id=block.id,
        created_at=block.created_at,
        user=RelationUserDto.model_validate(block.target_user),
    )
