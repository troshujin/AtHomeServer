from typing import TYPE_CHECKING
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from infrastructure.database.models._base import Base

if TYPE_CHECKING:
    from infrastructure.database.models.user import User


class Workout(Base):
    __tablename__: str = "workout"

    name: Mapped[str] = mapped_column()
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped[User] = relationship(back_populates="workouts", lazy="selectin")
    
    exercises: Mapped[list["WorkoutExercise"]] = relationship(
        back_populates="workout", lazy="selectin", cascade="all, delete-orphan"
    )


class WorkoutExercise(Base):
    __tablename__: str = "workout_exercise"

    name: Mapped[str] = mapped_column()
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    workout_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workout.id"))
    workout: Mapped["Workout"] = relationship(back_populates="exercises")

    sets: Mapped[list["WorkoutSet"]] = relationship(
        back_populates="exercise", lazy="selectin", cascade="all, delete-orphan"
    )


class WorkoutSet(Base):
    __tablename__: str = "workout_set"

    exercise_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workout_exercise.id"))
    exercise: Mapped["WorkoutExercise"] = relationship(back_populates="sets")

    reps: Mapped[list["WorkoutRep"]] = relationship(
        back_populates="set", lazy="selectin", cascade="all, delete-orphan"
    )


class WorkoutRep(Base):
    __tablename__: str = "workout_rep"

    weight: Mapped[int] = mapped_column()
    amount: Mapped[int] = mapped_column()

    set_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("workout_set.id"))
    set: Mapped["WorkoutSet"] = relationship(back_populates="reps")
