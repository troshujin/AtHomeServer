#!/usr/bin/env python3
import sys
import json
import random
from datetime import datetime, timedelta, timezone

EXERCISES = [
    ("Bench Press",        {"weight": (40, 100), "reps": (5, 12)}),
    ("Squat",              {"weight": (60, 140), "reps": (5, 10)}),
    ("Deadlift",           {"weight": (80, 160), "reps": (3,  8)}),
    ("Overhead Press",     {"weight": (30,  70), "reps": (5, 12)}),
    ("Barbell Row",        {"weight": (40,  90), "reps": (6, 12)}),
    ("Pull Up",            {"weight": ( 0,  20), "reps": (4, 12)}),
    ("Dumbbell Curl",      {"weight": (10,  30), "reps": (8, 15)}),
    ("Tricep Pushdown",    {"weight": (15,  45), "reps": (8, 15)}),
    ("Leg Press",          {"weight": (80, 200), "reps": (8, 15)}),
    ("Romanian Deadlift",  {"weight": (50, 110), "reps": (6, 12)}),
    ("Lateral Raise",      {"weight": ( 5,  20), "reps": (10, 20)}),
    ("Face Pull",          {"weight": (15,  35), "reps": (12, 20)}),
    ("Cable Fly",          {"weight": (10,  30), "reps": (10, 15)}),
    ("Incline Press",      {"weight": (35,  80), "reps": (6, 12)}),
    ("Hip Thrust",         {"weight": (60, 140), "reps": (8, 15)}),
]

def iso(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")

def random_duration(min_minutes: int, max_minutes: int) -> timedelta:
    return timedelta(minutes=random.randint(min_minutes, max_minutes))

def gen_rep(weight_range: tuple[int, int], rep_range: tuple[int, int]) -> dict:
    return {
        "weight": round(random.randint(*weight_range) / 2.5) * 2.5,
        "amount": random.randint(*rep_range),
    }

def gen_set(weight_range: tuple[int, int], rep_range: tuple[int, int]) -> dict:
    rep_count = random.randint(4, 8)
    base_weight = round(random.randint(*weight_range) / 2.5) * 2.5
    reps = []
    for i in range(rep_count):
        # slight fatigue: weight drops a little each rep, reps stay same
        weight = max(base_weight - i * 2.5, weight_range[0])
        reps.append({"weight": weight, "amount": random.randint(*rep_range)})
    return {"reps": reps}

def gen_exercise(name: str, profile: dict, start: datetime) -> tuple[dict, datetime]:
    set_count = random.randint(2, 4)
    sets = []
    current = start
    for _ in range(set_count):
        sets.append(gen_set(profile["weight"], profile["reps"]))
        current += random_duration(1, 3)  # rest between sets

    end = current + random_duration(2, 5)
    exercise = {
        "name": name,
        "sets": sets,
        "startedAt": iso(start),
        "endedAt": iso(end),
    }
    return exercise, end

def gen_workout(exercise_count: int) -> dict:
    if exercise_count > len(EXERCISES):
        print(f"Max {len(EXERCISES)} exercises available, capping at that.")
        exercise_count = len(EXERCISES)

    chosen = random.sample(EXERCISES, exercise_count)
    workout_name = f"Workout {datetime.now(timezone.utc).strftime('%A')}"
    start = datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 5))

    exercises = []
    current = start
    for name, profile in chosen:
        exercise, current = gen_exercise(name, profile, current)
        exercises.append(exercise)
        current += random_duration(1, 3)  # walk between exercises

    workout_end = current
    return {
        "name": workout_name,
        "exercises": exercises,
        "startedAt": iso(start),
        "endedAt": iso(workout_end),
    }

OUTPUT_FILE = "gen_workout.json"

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    workout = gen_workout(count)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(workout, f, indent=2)
    print(f"Written to {OUTPUT_FILE}")