export interface RawRep {
  weight: number;
  amount: number;
}

export interface RawSet {
  reps: RawRep[];
}

export interface RawExercise {
  name: string;
  sets: RawSet[];
  startedAt: string;
  endedAt: string;
}

export interface RawWorkout {
  name: string;
  exercises: RawExercise[];
  startedAt: string;
  endedAt: string;
}

// Base substance generated via `python gen_workout.py`, then re-dated/re-named
// per persona for a believable feed (see scratchpad shift_batch.py).
export const rawWorkoutsByPerson: Record<string, RawWorkout> = {
  "tijmen_a": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Bench Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 47.5,
                "amount": 6
              },
              {
                "weight": 45.0,
                "amount": 6
              },
              {
                "weight": 42.5,
                "amount": 11
              },
              {
                "weight": 40.0,
                "amount": 5
              },
              {
                "weight": 40,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 55.0,
                "amount": 5
              },
              {
                "weight": 52.5,
                "amount": 8
              },
              {
                "weight": 50.0,
                "amount": 11
              },
              {
                "weight": 47.5,
                "amount": 8
              },
              {
                "weight": 45.0,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T10:52:26.000Z",
        "endedAt": "2026-07-01T11:00:26.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 16
              },
              {
                "weight": 22.5,
                "amount": 14
              },
              {
                "weight": 20.0,
                "amount": 15
              },
              {
                "weight": 17.5,
                "amount": 17
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 18
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 16
              },
              {
                "weight": 22.5,
                "amount": 12
              },
              {
                "weight": 20.0,
                "amount": 19
              },
              {
                "weight": 17.5,
                "amount": 20
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 18
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T11:01:26.000Z",
        "endedAt": "2026-07-01T11:07:26.000Z"
      }
    ],
    "startedAt": "2026-07-01T10:52:26.000Z",
    "endedAt": "2026-07-01T11:10:26.000Z"
  },
  "tijmen_b": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 100.0,
                "amount": 8
              },
              {
                "weight": 97.5,
                "amount": 6
              },
              {
                "weight": 95.0,
                "amount": 12
              },
              {
                "weight": 92.5,
                "amount": 7
              },
              {
                "weight": 90.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 67.5,
                "amount": 9
              },
              {
                "weight": 65.0,
                "amount": 11
              },
              {
                "weight": 62.5,
                "amount": 12
              },
              {
                "weight": 60.0,
                "amount": 8
              },
              {
                "weight": 57.5,
                "amount": 7
              },
              {
                "weight": 55.0,
                "amount": 8
              },
              {
                "weight": 52.5,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T12:52:26.000Z",
        "endedAt": "2026-06-29T12:58:26.000Z"
      },
      {
        "name": "Overhead Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 67.5,
                "amount": 7
              },
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 8
              },
              {
                "weight": 67.5,
                "amount": 10
              },
              {
                "weight": 65.0,
                "amount": 5
              },
              {
                "weight": 62.5,
                "amount": 8
              },
              {
                "weight": 60.0,
                "amount": 5
              },
              {
                "weight": 57.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 35.0,
                "amount": 8
              },
              {
                "weight": 32.5,
                "amount": 10
              },
              {
                "weight": 30.0,
                "amount": 8
              },
              {
                "weight": 30,
                "amount": 12
              },
              {
                "weight": 30,
                "amount": 11
              },
              {
                "weight": 30,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 37.5,
                "amount": 8
              },
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 32.5,
                "amount": 11
              },
              {
                "weight": 30.0,
                "amount": 11
              },
              {
                "weight": 30,
                "amount": 10
              },
              {
                "weight": 30,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T13:01:26.000Z",
        "endedAt": "2026-06-29T13:12:26.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 14
              },
              {
                "weight": 17.5,
                "amount": 18
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 18
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 20
              },
              {
                "weight": 27.5,
                "amount": 16
              },
              {
                "weight": 25.0,
                "amount": 20
              },
              {
                "weight": 22.5,
                "amount": 12
              },
              {
                "weight": 20.0,
                "amount": 13
              },
              {
                "weight": 17.5,
                "amount": 20
              },
              {
                "weight": 15.0,
                "amount": 16
              },
              {
                "weight": 15,
                "amount": 17
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T13:13:26.000Z",
        "endedAt": "2026-06-29T13:20:26.000Z"
      }
    ],
    "startedAt": "2026-06-29T12:52:26.000Z",
    "endedAt": "2026-06-29T13:22:26.000Z"
  },
  "henry": {
    "name": "Chest & Triceps",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 9
              },
              {
                "weight": 27.5,
                "amount": 12
              },
              {
                "weight": 25.0,
                "amount": 11
              },
              {
                "weight": 22.5,
                "amount": 10
              },
              {
                "weight": 20.0,
                "amount": 13
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 45.0,
                "amount": 8
              },
              {
                "weight": 42.5,
                "amount": 13
              },
              {
                "weight": 40.0,
                "amount": 15
              },
              {
                "weight": 37.5,
                "amount": 8
              },
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 32.5,
                "amount": 13
              },
              {
                "weight": 30.0,
                "amount": 12
              },
              {
                "weight": 27.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 42.5,
                "amount": 9
              },
              {
                "weight": 40.0,
                "amount": 9
              },
              {
                "weight": 37.5,
                "amount": 15
              },
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 32.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 45.0,
                "amount": 10
              },
              {
                "weight": 42.5,
                "amount": 12
              },
              {
                "weight": 40.0,
                "amount": 14
              },
              {
                "weight": 37.5,
                "amount": 11
              },
              {
                "weight": 35.0,
                "amount": 11
              },
              {
                "weight": 32.5,
                "amount": 12
              },
              {
                "weight": 30.0,
                "amount": 14
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T10:52:26.000Z",
        "endedAt": "2026-07-01T11:02:26.000Z"
      },
      {
        "name": "Bench Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 47.5,
                "amount": 8
              },
              {
                "weight": 45.0,
                "amount": 8
              },
              {
                "weight": 42.5,
                "amount": 6
              },
              {
                "weight": 40.0,
                "amount": 10
              },
              {
                "weight": 40,
                "amount": 5
              },
              {
                "weight": 40,
                "amount": 8
              },
              {
                "weight": 40,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 5
              },
              {
                "weight": 82.5,
                "amount": 8
              },
              {
                "weight": 80.0,
                "amount": 6
              },
              {
                "weight": 77.5,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 72.5,
                "amount": 8
              },
              {
                "weight": 70.0,
                "amount": 9
              },
              {
                "weight": 67.5,
                "amount": 12
              },
              {
                "weight": 65.0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 12
              },
              {
                "weight": 82.5,
                "amount": 8
              },
              {
                "weight": 80.0,
                "amount": 12
              },
              {
                "weight": 77.5,
                "amount": 11
              },
              {
                "weight": 75.0,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T11:04:26.000Z",
        "endedAt": "2026-07-01T11:13:26.000Z"
      }
    ],
    "startedAt": "2026-07-01T10:52:26.000Z",
    "endedAt": "2026-07-01T11:16:26.000Z"
  },
  "sara": {
    "name": "Pull & Arms",
    "exercises": [
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 5
              },
              {
                "weight": 17.5,
                "amount": 4
              },
              {
                "weight": 15.0,
                "amount": 10
              },
              {
                "weight": 12.5,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 7
              },
              {
                "weight": 2.5,
                "amount": 12
              },
              {
                "weight": 0.0,
                "amount": 11
              },
              {
                "weight": 0,
                "amount": 6
              },
              {
                "weight": 0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 7
              },
              {
                "weight": 12.5,
                "amount": 5
              },
              {
                "weight": 10.0,
                "amount": 11
              },
              {
                "weight": 7.5,
                "amount": 12
              },
              {
                "weight": 5.0,
                "amount": 5
              },
              {
                "weight": 2.5,
                "amount": 4
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 0.0,
                "amount": 5
              },
              {
                "weight": 0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 6
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 11
              },
              {
                "weight": 0,
                "amount": 11
              },
              {
                "weight": 0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T09:52:26.000Z",
        "endedAt": "2026-06-30T10:01:26.000Z"
      },
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 15
              },
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 12.5,
                "amount": 14
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 10
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 27.5,
                "amount": 8
              },
              {
                "weight": 25.0,
                "amount": 13
              },
              {
                "weight": 22.5,
                "amount": 8
              },
              {
                "weight": 20.0,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T10:03:26.000Z",
        "endedAt": "2026-06-30T10:12:26.000Z"
      },
      {
        "name": "Incline Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 37.5,
                "amount": 10
              },
              {
                "weight": 35.0,
                "amount": 6
              },
              {
                "weight": 35,
                "amount": 12
              },
              {
                "weight": 35,
                "amount": 7
              },
              {
                "weight": 35,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 77.5,
                "amount": 12
              },
              {
                "weight": 75.0,
                "amount": 7
              },
              {
                "weight": 72.5,
                "amount": 9
              },
              {
                "weight": 70.0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 72.5,
                "amount": 10
              },
              {
                "weight": 70.0,
                "amount": 6
              },
              {
                "weight": 67.5,
                "amount": 10
              },
              {
                "weight": 65.0,
                "amount": 6
              },
              {
                "weight": 62.5,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 10
              },
              {
                "weight": 67.5,
                "amount": 8
              },
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 11
              },
              {
                "weight": 57.5,
                "amount": 11
              },
              {
                "weight": 55.0,
                "amount": 8
              },
              {
                "weight": 52.5,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T10:15:26.000Z",
        "endedAt": "2026-06-30T10:31:26.000Z"
      }
    ],
    "startedAt": "2026-06-30T09:52:26.000Z",
    "endedAt": "2026-06-30T10:32:26.000Z"
  },
  "marcus": {
    "name": "Arm Day",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
          {
            "reps": [
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 32.5,
                "amount": 9
              },
              {
                "weight": 30.0,
                "amount": 11
              },
              {
                "weight": 27.5,
                "amount": 12
              },
              {
                "weight": 25.0,
                "amount": 10
              },
              {
                "weight": 22.5,
                "amount": 13
              },
              {
                "weight": 20.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 10
              },
              {
                "weight": 22.5,
                "amount": 15
              },
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 8
              },
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 15,
                "amount": 9
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T12:52:26.000Z",
        "endedAt": "2026-06-28T12:58:26.000Z"
      },
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 8
              },
              {
                "weight": 2.5,
                "amount": 8
              },
              {
                "weight": 0.0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 9
              },
              {
                "weight": 0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 12
              },
              {
                "weight": 0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 2.5,
                "amount": 10
              },
              {
                "weight": 0.0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 4
              },
              {
                "weight": 0,
                "amount": 4
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T12:59:26.000Z",
        "endedAt": "2026-06-28T13:06:26.000Z"
      },
      {
        "name": "Cable Fly",
        "sets": [
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 14
              },
              {
                "weight": 22.5,
                "amount": 15
              },
              {
                "weight": 20.0,
                "amount": 13
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 14
              },
              {
                "weight": 12.5,
                "amount": 10
              },
              {
                "weight": 10.0,
                "amount": 12
              },
              {
                "weight": 10,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 11
              },
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 12.5,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T13:09:26.000Z",
        "endedAt": "2026-06-28T13:18:26.000Z"
      }
    ],
    "startedAt": "2026-06-28T12:52:26.000Z",
    "endedAt": "2026-06-28T13:21:26.000Z"
  },
  "elena": {
    "name": "Leg Day",
    "exercises": [
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 13
              },
              {
                "weight": 7.5,
                "amount": 12
              },
              {
                "weight": 5.0,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 12
              },
              {
                "weight": 10.0,
                "amount": 11
              },
              {
                "weight": 7.5,
                "amount": 16
              },
              {
                "weight": 5.0,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 17
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 15
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 15
              },
              {
                "weight": 15.0,
                "amount": 14
              },
              {
                "weight": 12.5,
                "amount": 11
              },
              {
                "weight": 10.0,
                "amount": 14
              },
              {
                "weight": 7.5,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T10:52:26.000Z",
        "endedAt": "2026-06-30T11:06:26.000Z"
      },
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 5
              },
              {
                "weight": 60.0,
                "amount": 7
              },
              {
                "weight": 60,
                "amount": 6
              },
              {
                "weight": 60,
                "amount": 9
              },
              {
                "weight": 60,
                "amount": 7
              },
              {
                "weight": 60,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 115.0,
                "amount": 7
              },
              {
                "weight": 112.5,
                "amount": 10
              },
              {
                "weight": 110.0,
                "amount": 7
              },
              {
                "weight": 107.5,
                "amount": 8
              },
              {
                "weight": 105.0,
                "amount": 9
              },
              {
                "weight": 102.5,
                "amount": 9
              },
              {
                "weight": 100.0,
                "amount": 5
              },
              {
                "weight": 97.5,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 92.5,
                "amount": 5
              },
              {
                "weight": 90.0,
                "amount": 10
              },
              {
                "weight": 87.5,
                "amount": 8
              },
              {
                "weight": 85.0,
                "amount": 5
              },
              {
                "weight": 82.5,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 105.0,
                "amount": 8
              },
              {
                "weight": 102.5,
                "amount": 5
              },
              {
                "weight": 100.0,
                "amount": 10
              },
              {
                "weight": 97.5,
                "amount": 7
              },
              {
                "weight": 95.0,
                "amount": 9
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T11:09:26.000Z",
        "endedAt": "2026-06-30T11:20:26.000Z"
      }
    ],
    "startedAt": "2026-06-30T10:52:26.000Z",
    "endedAt": "2026-06-30T11:23:26.000Z"
  },
  "josh": {
    "name": "Full Body",
    "exercises": [
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 170.0,
                "amount": 12
              },
              {
                "weight": 167.5,
                "amount": 10
              },
              {
                "weight": 165.0,
                "amount": 11
              },
              {
                "weight": 162.5,
                "amount": 14
              },
              {
                "weight": 160.0,
                "amount": 14
              },
              {
                "weight": 157.5,
                "amount": 10
              },
              {
                "weight": 155.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 185.0,
                "amount": 8
              },
              {
                "weight": 182.5,
                "amount": 12
              },
              {
                "weight": 180.0,
                "amount": 12
              },
              {
                "weight": 177.5,
                "amount": 11
              },
              {
                "weight": 175.0,
                "amount": 14
              },
              {
                "weight": 172.5,
                "amount": 13
              },
              {
                "weight": 170.0,
                "amount": 15
              },
              {
                "weight": 167.5,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 145.0,
                "amount": 15
              },
              {
                "weight": 142.5,
                "amount": 10
              },
              {
                "weight": 140.0,
                "amount": 9
              },
              {
                "weight": 137.5,
                "amount": 12
              },
              {
                "weight": 135.0,
                "amount": 13
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T09:52:26.000Z",
        "endedAt": "2026-06-29T10:00:26.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 6
              },
              {
                "weight": 47.5,
                "amount": 6
              },
              {
                "weight": 45.0,
                "amount": 7
              },
              {
                "weight": 42.5,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 9
              },
              {
                "weight": 67.5,
                "amount": 11
              },
              {
                "weight": 65.0,
                "amount": 10
              },
              {
                "weight": 62.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 9
              },
              {
                "weight": 67.5,
                "amount": 7
              },
              {
                "weight": 65.0,
                "amount": 7
              },
              {
                "weight": 62.5,
                "amount": 11
              },
              {
                "weight": 60.0,
                "amount": 11
              },
              {
                "weight": 57.5,
                "amount": 6
              },
              {
                "weight": 55.0,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T10:03:26.000Z",
        "endedAt": "2026-06-29T10:15:26.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 18
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 12.5,
                "amount": 11
              },
              {
                "weight": 10.0,
                "amount": 17
              },
              {
                "weight": 7.5,
                "amount": 12
              },
              {
                "weight": 5.0,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 20
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 17
              },
              {
                "weight": 12.5,
                "amount": 19
              },
              {
                "weight": 10.0,
                "amount": 18
              },
              {
                "weight": 7.5,
                "amount": 16
              },
              {
                "weight": 5.0,
                "amount": 18
              },
              {
                "weight": 5,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 17
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T10:16:26.000Z",
        "endedAt": "2026-06-29T10:25:26.000Z"
      }
    ],
    "startedAt": "2026-06-29T09:52:26.000Z",
    "endedAt": "2026-06-29T10:26:26.000Z"
  }
}
;
