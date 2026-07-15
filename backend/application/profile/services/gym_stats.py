"""
Computes the `gym.*` half of the profile-stat catalog from a user's workouts.

Values are computed fresh on every read instead of being persisted - they
change with every workout logged, and a user's full workout history is small
enough that recomputing is cheaper than keeping a materialized copy honest.
A future feature (music, etc.) adds its own sibling module contributing its
own `<feature>.*` keys; GetProfileStatsUseCase merges the catalogs.
"""

from collections.abc import Sequence
from datetime import datetime, timedelta, timezone

from infrastructure.database.models import Workout

# The rolling window the per-week averages are taken over. Recent enough to
# reflect current habits (an all-time average would barely move after a year
# of data), long enough to smooth over a single busy or lazy week.
ACTIVITY_WINDOW_WEEKS = 8


def _workout_volume(workout: Workout) -> float:
    return sum(
        rep.weight * rep.amount
        for exercise in workout.exercises
        for workout_set in exercise.sets
        for rep in workout_set.reps
    )


def _week_streak(workouts: Sequence[Workout], now: datetime) -> int:
    """
    Consecutive ISO weeks with at least one workout, counting backwards from
    the current week. A quiet current week doesn't break the streak (the week
    isn't over yet) - it just doesn't count until something is logged in it.
    """
    weeks = {workout.started_at.isocalendar()[:2] for workout in workouts}
    if not weeks:
        return 0

    cursor = now
    if now.isocalendar()[:2] not in weeks:
        cursor = now - timedelta(weeks=1)

    streak = 0
    while cursor.isocalendar()[:2] in weeks:
        streak += 1
        cursor -= timedelta(weeks=1)

    return streak


def compute_gym_stats(workouts: Sequence[Workout]) -> dict[str, float]:
    """Returns every `gym.*` catalog key, in the order the picker lists them."""
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(weeks=ACTIVITY_WINDOW_WEEKS)

    total_volume = sum(_workout_volume(workout) for workout in workouts)

    recent = [workout for workout in workouts if workout.started_at >= window_start]
    recent_volume = sum(_workout_volume(workout) for workout in recent)

    all_reps = [
        rep
        for workout in workouts
        for exercise in workout.exercises
        for workout_set in exercise.sets
        for rep in workout_set.reps
    ]

    session_minutes = [
        (workout.ended_at - workout.started_at).total_seconds() / 60
        for workout in workouts
        if workout.ended_at is not None
    ]

    return {
        "gym.total_workouts": float(len(workouts)),
        "gym.total_volume": total_volume,
        "gym.workouts_per_week": len(recent) / ACTIVITY_WINDOW_WEEKS,
        "gym.volume_per_week": recent_volume / ACTIVITY_WINDOW_WEEKS,
        "gym.heaviest_lift": max((rep.weight for rep in all_reps), default=0.0),
        "gym.total_reps": float(sum(rep.amount for rep in all_reps)),
        "gym.week_streak": float(_week_streak(workouts, now)),
        "gym.longest_session_min": max(session_minutes, default=0.0),
    }
