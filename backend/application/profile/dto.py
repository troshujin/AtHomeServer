import uuid
from datetime import datetime

from core.common.schema import APIBaseModel


class ProfileStatDto(APIBaseModel):
    """
    One entry of the stat catalog: a namespaced key (see
    domain/constants/profile_stat.py) and its freshly computed numeric value.
    Labeling/formatting is the frontend registry's job - the backend stays a
    pure number source so new stat kinds never need a presentation change here.
    """

    key: str
    value: float


class ProfileCardStatsDto(APIBaseModel):
    """The user's pinned card stats, in slot order (index 0 = hero slot),
    plus whether the card is hidden from visitors."""

    stat_keys: list[str]
    is_private: bool = False


class MutateProfileCardStatsDto(APIBaseModel):
    stat_keys: list[str]


class MutateCardPrivacyDto(APIBaseModel):
    is_private: bool


class UserCardOwnerDto(APIBaseModel):
    id: uuid.UUID
    username: str
    member_since: datetime


class UserCardDto(APIBaseModel):
    """Another user's profile card as a visitor sees it. When the owner made
    it private (or a block stands between the two users) `is_visible` is
    False and `stats` is empty - the owner's identity still comes through so
    the visitor can be told *whose* card is hidden."""

    user: UserCardOwnerDto
    is_visible: bool
    stats: list[ProfileStatDto]
