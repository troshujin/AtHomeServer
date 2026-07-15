import uuid
from typing import Annotated

from fastapi import Depends
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

from application.auth.services.identity import IdentityService
from application.profile.dto import ProfileStatDto, UserCardDto, UserCardOwnerDto
from application.profile.services.gym_stats import compute_gym_stats
from core.common.result import Result, fail, succeed
from core.exceptions.base import CustomException
from core.exceptions.standard import NotFoundException
from infrastructure.database.models import Workout
from infrastructure.database.repositories.blocked_user import BlockedUserRepository
from infrastructure.database.repositories.profile_card_stat import ProfileCardStatRepository
from infrastructure.database.repositories.user import UserRepository
from infrastructure.database.repositories.workout import WorkoutRepository
from infrastructure.database.session import get_db_session


class GetUserCardUseCase:
    """
    Another user's profile card: their pinned stat selection, with values
    computed fresh from their data. Hidden (is_visible=False, no stats) when
    the owner set the card private or a block stands between the two users -
    a they-blocked-you and a private card are deliberately indistinguishable,
    so a block can't be discovered by opening someone's card.
    """

    def __init__(
        self,
        identity_service: Annotated[IdentityService, Depends()],
        session: Annotated[AsyncSession, Depends(get_db_session)],
    ) -> None:
        self.identity_service: IdentityService = identity_service
        self.user_repo: UserRepository = UserRepository(session=session)
        self.card_repo: ProfileCardStatRepository = ProfileCardStatRepository(session=session)
        self.workout_repo: WorkoutRepository = WorkoutRepository(session=session)
        self.blocked_repo: BlockedUserRepository = BlockedUserRepository(session=session)

    async def __call__(self, user_id: uuid.UUID) -> Result[UserCardDto]:
        user_session = await self.identity_service.get_current_user_session()

        if not user_session or not user_session.profile:
            return fail(CustomException("Corrupt user session"))

        me_id = uuid.UUID(user_session.profile.id)

        target = await self.user_repo.get_by_id(user_id)
        if not target:
            return fail(NotFoundException("This user doesn't exist"))

        owner = UserCardOwnerDto(
            id=target.id,
            username=target.username,
            member_since=target.created_at,
        )

        is_me = me_id == user_id
        hidden = target.card_is_private or await self.blocked_repo.exists_between(me_id, user_id)

        # Your own card is never hidden from you - the profile page's
        # preview must keep working while the card is private.
        if hidden and not is_me:
            return succeed(UserCardDto(user=owner, is_visible=False, stats=[]))

        selected = await self.card_repo.get_for_user(str(user_id))

        if not selected:
            return succeed(UserCardDto(user=owner, is_visible=True, stats=[]))

        def modifier(query: Select[tuple[Workout]]) -> Select[tuple[Workout]]:
            return query.where(Workout.user_id == user_id)

        workouts = await self.workout_repo.get(modifier=modifier)
        values = compute_gym_stats(workouts)

        stats = [
            ProfileStatDto(key=stat.stat_key, value=values.get(stat.stat_key, 0.0))
            for stat in selected
        ]

        return succeed(UserCardDto(user=owner, is_visible=True, stats=stats))
