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
// per persona for a believable carousel of ~10 cards per section
// (see scratchpad gen_carousel_batch.py).
export const rawWorkoutsByPerson: Record<string, RawWorkout> = {
  "tijmen_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 8
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 8
              },
              {
                "weight": 10,
                "amount": 9
              },
              {
                "weight": 10,
                "amount": 14
              },
              {
                "weight": 10,
                "amount": 14
              },
              {
                "weight": 10,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 27.5,
                "amount": 14
              },
              {
                "weight": 25.0,
                "amount": 8
              },
              {
                "weight": 22.5,
                "amount": 9
              },
              {
                "weight": 20.0,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-26T08:21:04.000Z",
        "endedAt": "2026-06-26T08:27:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 18
              },
              {
                "weight": 5,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 18
              },
              {
                "weight": 12.5,
                "amount": 20
              },
              {
                "weight": 10.0,
                "amount": 12
              },
              {
                "weight": 7.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 7.5,
                "amount": 11
              },
              {
                "weight": 5.0,
                "amount": 18
              },
              {
                "weight": 5,
                "amount": 11
              },
              {
                "weight": 5,
                "amount": 19
              },
              {
                "weight": 5,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 19
              },
              {
                "weight": 5,
                "amount": 13
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
                "amount": 17
              },
              {
                "weight": 12.5,
                "amount": 19
              },
              {
                "weight": 10.0,
                "amount": 17
              },
              {
                "weight": 7.5,
                "amount": 15
              },
              {
                "weight": 5.0,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-06-26T08:30:04.000Z",
        "endedAt": "2026-06-26T08:44:04.000Z"
      }
    ],
    "startedAt": "2026-06-26T08:21:04.000Z",
    "endedAt": "2026-06-26T08:45:04.000Z"
  },
  "tijmen_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 9
              },
              {
                "weight": 67.5,
                "amount": 14
              },
              {
                "weight": 65.0,
                "amount": 10
              },
              {
                "weight": 62.5,
                "amount": 13
              },
              {
                "weight": 60.0,
                "amount": 10
              },
              {
                "weight": 60,
                "amount": 15
              },
              {
                "weight": 60,
                "amount": 14
              },
              {
                "weight": 60,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 130.0,
                "amount": 13
              },
              {
                "weight": 127.5,
                "amount": 13
              },
              {
                "weight": 125.0,
                "amount": 13
              },
              {
                "weight": 122.5,
                "amount": 15
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
                "amount": 12
              },
              {
                "weight": 62.5,
                "amount": 15
              },
              {
                "weight": 60.0,
                "amount": 9
              },
              {
                "weight": 60,
                "amount": 8
              },
              {
                "weight": 60,
                "amount": 12
              },
              {
                "weight": 60,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T05:21:04.000Z",
        "endedAt": "2026-06-27T05:34:04.000Z"
      },
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 9
              },
              {
                "weight": 12.5,
                "amount": 6
              },
              {
                "weight": 10.0,
                "amount": 5
              },
              {
                "weight": 7.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 6
              },
              {
                "weight": 7.5,
                "amount": 7
              },
              {
                "weight": 5.0,
                "amount": 10
              },
              {
                "weight": 2.5,
                "amount": 10
              },
              {
                "weight": 0.0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 10
              },
              {
                "weight": 12.5,
                "amount": 12
              },
              {
                "weight": 10.0,
                "amount": 8
              },
              {
                "weight": 7.5,
                "amount": 6
              },
              {
                "weight": 5.0,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T05:37:04.000Z",
        "endedAt": "2026-06-27T05:46:04.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 27.5,
                "amount": 15
              },
              {
                "weight": 25.0,
                "amount": 14
              },
              {
                "weight": 22.5,
                "amount": 13
              },
              {
                "weight": 20.0,
                "amount": 14
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 19
              },
              {
                "weight": 15,
                "amount": 14
              },
              {
                "weight": 15,
                "amount": 16
              },
              {
                "weight": 15,
                "amount": 16
              },
              {
                "weight": 15,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 32.5,
                "amount": 17
              },
              {
                "weight": 30.0,
                "amount": 17
              },
              {
                "weight": 27.5,
                "amount": 14
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
                "amount": 19
              },
              {
                "weight": 17.5,
                "amount": 20
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T05:49:04.000Z",
        "endedAt": "2026-06-27T06:00:04.000Z"
      }
    ],
    "startedAt": "2026-06-27T05:21:04.000Z",
    "endedAt": "2026-06-27T06:02:04.000Z"
  },
  "tijmen_2": {
    "name": "Leg Day",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 11
              },
              {
                "weight": 15.0,
                "amount": 15
              },
              {
                "weight": 15,
                "amount": 10
              },
              {
                "weight": 15,
                "amount": 9
              },
              {
                "weight": 15,
                "amount": 13
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 8
              },
              {
                "weight": 15.0,
                "amount": 10
              },
              {
                "weight": 15,
                "amount": 9
              },
              {
                "weight": 15,
                "amount": 13
              }
            ]
          }
        ],
        "startedAt": "2026-06-24T05:21:04.000Z",
        "endedAt": "2026-06-24T05:29:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
                "amount": 20
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
                "weight": 7.5,
                "amount": 19
              },
              {
                "weight": 5.0,
                "amount": 15
              },
              {
                "weight": 5,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 17
              },
              {
                "weight": 17.5,
                "amount": 17
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
                "amount": 12
              },
              {
                "weight": 7.5,
                "amount": 11
              },
              {
                "weight": 5.0,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-24T05:30:04.000Z",
        "endedAt": "2026-06-24T05:38:04.000Z"
      }
    ],
    "startedAt": "2026-06-24T05:21:04.000Z",
    "endedAt": "2026-06-24T05:40:04.000Z"
  },
  "tijmen_3": {
    "name": "Full Body",
    "exercises": [
      {
        "name": "Overhead Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 9
              },
              {
                "weight": 30,
                "amount": 6
              },
              {
                "weight": 30,
                "amount": 9
              },
              {
                "weight": 30,
                "amount": 10
              },
              {
                "weight": 30,
                "amount": 7
              },
              {
                "weight": 30,
                "amount": 10
              },
              {
                "weight": 30,
                "amount": 8
              },
              {
                "weight": 30,
                "amount": 10
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
                "amount": 8
              },
              {
                "weight": 65.0,
                "amount": 11
              },
              {
                "weight": 62.5,
                "amount": 8
              },
              {
                "weight": 60.0,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T06:21:04.000Z",
        "endedAt": "2026-07-01T06:32:04.000Z"
      },
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 82.5,
                "amount": 12
              },
              {
                "weight": 80.0,
                "amount": 15
              },
              {
                "weight": 80,
                "amount": 12
              },
              {
                "weight": 80,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 125.0,
                "amount": 15
              },
              {
                "weight": 122.5,
                "amount": 13
              },
              {
                "weight": 120.0,
                "amount": 13
              },
              {
                "weight": 117.5,
                "amount": 9
              },
              {
                "weight": 115.0,
                "amount": 11
              },
              {
                "weight": 112.5,
                "amount": 9
              },
              {
                "weight": 110.0,
                "amount": 11
              },
              {
                "weight": 107.5,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 105.0,
                "amount": 15
              },
              {
                "weight": 102.5,
                "amount": 8
              },
              {
                "weight": 100.0,
                "amount": 15
              },
              {
                "weight": 97.5,
                "amount": 13
              },
              {
                "weight": 95.0,
                "amount": 9
              },
              {
                "weight": 92.5,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 140.0,
                "amount": 10
              },
              {
                "weight": 137.5,
                "amount": 14
              },
              {
                "weight": 135.0,
                "amount": 13
              },
              {
                "weight": 132.5,
                "amount": 9
              },
              {
                "weight": 130.0,
                "amount": 14
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T06:34:04.000Z",
        "endedAt": "2026-07-01T06:47:04.000Z"
      }
    ],
    "startedAt": "2026-07-01T06:21:04.000Z",
    "endedAt": "2026-07-01T06:50:04.000Z"
  },
  "tijmen_4": {
    "name": "Upper Body",
    "exercises": [
      {
        "name": "Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 140.0,
                "amount": 8
              },
              {
                "weight": 137.5,
                "amount": 4
              },
              {
                "weight": 135.0,
                "amount": 7
              },
              {
                "weight": 132.5,
                "amount": 7
              },
              {
                "weight": 130.0,
                "amount": 6
              },
              {
                "weight": 127.5,
                "amount": 8
              },
              {
                "weight": 125.0,
                "amount": 5
              },
              {
                "weight": 122.5,
                "amount": 4
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 95.0,
                "amount": 3
              },
              {
                "weight": 92.5,
                "amount": 3
              },
              {
                "weight": 90.0,
                "amount": 8
              },
              {
                "weight": 87.5,
                "amount": 8
              },
              {
                "weight": 85.0,
                "amount": 3
              },
              {
                "weight": 82.5,
                "amount": 7
              },
              {
                "weight": 80.0,
                "amount": 8
              },
              {
                "weight": 80,
                "amount": 4
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T08:21:04.000Z",
        "endedAt": "2026-07-04T08:29:04.000Z"
      },
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 87.5,
                "amount": 12
              },
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 13
              },
              {
                "weight": 80.0,
                "amount": 12
              },
              {
                "weight": 77.5,
                "amount": 14
              },
              {
                "weight": 75.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 117.5,
                "amount": 14
              },
              {
                "weight": 115.0,
                "amount": 10
              },
              {
                "weight": 112.5,
                "amount": 10
              },
              {
                "weight": 110.0,
                "amount": 8
              },
              {
                "weight": 107.5,
                "amount": 15
              },
              {
                "weight": 105.0,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T08:30:04.000Z",
        "endedAt": "2026-07-04T08:36:04.000Z"
      }
    ],
    "startedAt": "2026-07-04T08:21:04.000Z",
    "endedAt": "2026-07-04T08:37:04.000Z"
  },
  "tijmen_5": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 92.5,
                "amount": 10
              },
              {
                "weight": 90.0,
                "amount": 10
              },
              {
                "weight": 87.5,
                "amount": 10
              },
              {
                "weight": 85.0,
                "amount": 9
              },
              {
                "weight": 82.5,
                "amount": 12
              },
              {
                "weight": 80.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 7
              },
              {
                "weight": 50,
                "amount": 8
              },
              {
                "weight": 50,
                "amount": 6
              },
              {
                "weight": 50,
                "amount": 12
              },
              {
                "weight": 50,
                "amount": 6
              },
              {
                "weight": 50,
                "amount": 10
              },
              {
                "weight": 50,
                "amount": 9
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T04:21:04.000Z",
        "endedAt": "2026-07-02T04:27:04.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 35.0,
                "amount": 20
              },
              {
                "weight": 32.5,
                "amount": 20
              },
              {
                "weight": 30.0,
                "amount": 15
              },
              {
                "weight": 27.5,
                "amount": 16
              },
              {
                "weight": 25.0,
                "amount": 19
              },
              {
                "weight": 22.5,
                "amount": 20
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 15
              },
              {
                "weight": 27.5,
                "amount": 20
              },
              {
                "weight": 25.0,
                "amount": 16
              },
              {
                "weight": 22.5,
                "amount": 20
              },
              {
                "weight": 20.0,
                "amount": 15
              },
              {
                "weight": 17.5,
                "amount": 19
              },
              {
                "weight": 15.0,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 27.5,
                "amount": 19
              },
              {
                "weight": 25.0,
                "amount": 17
              },
              {
                "weight": 22.5,
                "amount": 13
              },
              {
                "weight": 20.0,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T04:28:04.000Z",
        "endedAt": "2026-07-02T04:37:04.000Z"
      },
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 75.0,
                "amount": 6
              },
              {
                "weight": 72.5,
                "amount": 10
              },
              {
                "weight": 70.0,
                "amount": 10
              },
              {
                "weight": 67.5,
                "amount": 10
              },
              {
                "weight": 65.0,
                "amount": 7
              },
              {
                "weight": 62.5,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 120.0,
                "amount": 6
              },
              {
                "weight": 117.5,
                "amount": 10
              },
              {
                "weight": 115.0,
                "amount": 5
              },
              {
                "weight": 112.5,
                "amount": 8
              },
              {
                "weight": 110.0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 8
              },
              {
                "weight": 75.0,
                "amount": 9
              },
              {
                "weight": 72.5,
                "amount": 8
              },
              {
                "weight": 70.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 105.0,
                "amount": 7
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
                "amount": 5
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T04:38:04.000Z",
        "endedAt": "2026-07-02T04:50:04.000Z"
      }
    ],
    "startedAt": "2026-07-02T04:21:04.000Z",
    "endedAt": "2026-07-02T04:52:04.000Z"
  },
  "tijmen_6": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 2.5,
                "amount": 7
              },
              {
                "weight": 0.0,
                "amount": 5
              },
              {
                "weight": 0,
                "amount": 5
              },
              {
                "weight": 0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 8
              },
              {
                "weight": 2.5,
                "amount": 6
              },
              {
                "weight": 0.0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
                "amount": 11
              },
              {
                "weight": 12.5,
                "amount": 9
              },
              {
                "weight": 10.0,
                "amount": 5
              },
              {
                "weight": 7.5,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 5
              },
              {
                "weight": 10.0,
                "amount": 8
              },
              {
                "weight": 7.5,
                "amount": 4
              },
              {
                "weight": 5.0,
                "amount": 5
              },
              {
                "weight": 2.5,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-06T06:21:04.000Z",
        "endedAt": "2026-07-06T06:30:04.000Z"
      },
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 137.5,
                "amount": 8
              },
              {
                "weight": 135.0,
                "amount": 13
              },
              {
                "weight": 132.5,
                "amount": 14
              },
              {
                "weight": 130.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 80,
                "amount": 12
              },
              {
                "weight": 80,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 200.0,
                "amount": 12
              },
              {
                "weight": 197.5,
                "amount": 12
              },
              {
                "weight": 195.0,
                "amount": 11
              },
              {
                "weight": 192.5,
                "amount": 12
              },
              {
                "weight": 190.0,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-07-06T06:31:04.000Z",
        "endedAt": "2026-07-06T06:41:04.000Z"
      },
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 6
              },
              {
                "weight": 62.5,
                "amount": 6
              },
              {
                "weight": 60.0,
                "amount": 6
              },
              {
                "weight": 57.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 10
              },
              {
                "weight": 60.0,
                "amount": 9
              },
              {
                "weight": 57.5,
                "amount": 7
              },
              {
                "weight": 55.0,
                "amount": 9
              },
              {
                "weight": 52.5,
                "amount": 6
              },
              {
                "weight": 50.0,
                "amount": 11
              },
              {
                "weight": 50,
                "amount": 12
              },
              {
                "weight": 50,
                "amount": 11
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
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 8
              },
              {
                "weight": 75.0,
                "amount": 11
              },
              {
                "weight": 72.5,
                "amount": 7
              },
              {
                "weight": 70.0,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-07-06T06:43:04.000Z",
        "endedAt": "2026-07-06T06:53:04.000Z"
      }
    ],
    "startedAt": "2026-07-06T06:21:04.000Z",
    "endedAt": "2026-07-06T06:56:04.000Z"
  },
  "tijmen_7": {
    "name": "Leg Day",
    "exercises": [
      {
        "name": "Incline Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 6
              },
              {
                "weight": 57.5,
                "amount": 6
              },
              {
                "weight": 55.0,
                "amount": 11
              },
              {
                "weight": 52.5,
                "amount": 12
              },
              {
                "weight": 50.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 72.5,
                "amount": 7
              },
              {
                "weight": 70.0,
                "amount": 11
              },
              {
                "weight": 67.5,
                "amount": 8
              },
              {
                "weight": 65.0,
                "amount": 6
              },
              {
                "weight": 62.5,
                "amount": 9
              },
              {
                "weight": 60.0,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T08:21:04.000Z",
        "endedAt": "2026-06-25T08:29:04.000Z"
      },
      {
        "name": "Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 125.0,
                "amount": 5
              },
              {
                "weight": 122.5,
                "amount": 7
              },
              {
                "weight": 120.0,
                "amount": 5
              },
              {
                "weight": 117.5,
                "amount": 4
              },
              {
                "weight": 115.0,
                "amount": 3
              },
              {
                "weight": 112.5,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 102.5,
                "amount": 3
              },
              {
                "weight": 100.0,
                "amount": 5
              },
              {
                "weight": 97.5,
                "amount": 6
              },
              {
                "weight": 95.0,
                "amount": 3
              },
              {
                "weight": 92.5,
                "amount": 6
              },
              {
                "weight": 90.0,
                "amount": 5
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T08:31:04.000Z",
        "endedAt": "2026-06-25T08:38:04.000Z"
      }
    ],
    "startedAt": "2026-06-25T08:21:04.000Z",
    "endedAt": "2026-06-25T08:39:04.000Z"
  },
  "tijmen_8": {
    "name": "Full Body",
    "exercises": [
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 135.0,
                "amount": 5
              },
              {
                "weight": 132.5,
                "amount": 8
              },
              {
                "weight": 130.0,
                "amount": 5
              },
              {
                "weight": 127.5,
                "amount": 7
              },
              {
                "weight": 125.0,
                "amount": 7
              },
              {
                "weight": 122.5,
                "amount": 10
              },
              {
                "weight": 120.0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 127.5,
                "amount": 6
              },
              {
                "weight": 125.0,
                "amount": 10
              },
              {
                "weight": 122.5,
                "amount": 10
              },
              {
                "weight": 120.0,
                "amount": 9
              },
              {
                "weight": 117.5,
                "amount": 8
              },
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
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-06-20T08:21:04.000Z",
        "endedAt": "2026-06-20T08:27:04.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 42.5,
                "amount": 12
              },
              {
                "weight": 40.0,
                "amount": 12
              },
              {
                "weight": 40,
                "amount": 11
              },
              {
                "weight": 40,
                "amount": 10
              },
              {
                "weight": 40,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 47.5,
                "amount": 10
              },
              {
                "weight": 45.0,
                "amount": 12
              },
              {
                "weight": 42.5,
                "amount": 10
              },
              {
                "weight": 40.0,
                "amount": 10
              },
              {
                "weight": 40,
                "amount": 12
              },
              {
                "weight": 40,
                "amount": 12
              },
              {
                "weight": 40,
                "amount": 12
              },
              {
                "weight": 40,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 11
              },
              {
                "weight": 80.0,
                "amount": 11
              },
              {
                "weight": 77.5,
                "amount": 7
              },
              {
                "weight": 75.0,
                "amount": 6
              },
              {
                "weight": 72.5,
                "amount": 6
              },
              {
                "weight": 70.0,
                "amount": 6
              },
              {
                "weight": 67.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 45.0,
                "amount": 9
              },
              {
                "weight": 42.5,
                "amount": 12
              },
              {
                "weight": 40.0,
                "amount": 9
              },
              {
                "weight": 40,
                "amount": 10
              },
              {
                "weight": 40,
                "amount": 6
              },
              {
                "weight": 40,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-20T08:30:04.000Z",
        "endedAt": "2026-06-20T08:42:04.000Z"
      }
    ],
    "startedAt": "2026-06-20T08:21:04.000Z",
    "endedAt": "2026-06-20T08:44:04.000Z"
  },
  "tijmen_9": {
    "name": "Upper Body",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
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
                "amount": 12
              },
              {
                "weight": 32.5,
                "amount": 9
              },
              {
                "weight": 30.0,
                "amount": 12
              },
              {
                "weight": 27.5,
                "amount": 11
              },
              {
                "weight": 25.0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 14
              },
              {
                "weight": 27.5,
                "amount": 9
              },
              {
                "weight": 25.0,
                "amount": 15
              },
              {
                "weight": 22.5,
                "amount": 12
              },
              {
                "weight": 20.0,
                "amount": 8
              },
              {
                "weight": 17.5,
                "amount": 11
              },
              {
                "weight": 15.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 12
              },
              {
                "weight": 22.5,
                "amount": 12
              },
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 8
              },
              {
                "weight": 15.0,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 9
              },
              {
                "weight": 20.0,
                "amount": 11
              },
              {
                "weight": 17.5,
                "amount": 15
              },
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 15,
                "amount": 12
              },
              {
                "weight": 15,
                "amount": 15
              },
              {
                "weight": 15,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T08:21:04.000Z",
        "endedAt": "2026-06-28T08:30:04.000Z"
      },
      {
        "name": "Cable Fly",
        "sets": [
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 10,
                "amount": 12
              },
              {
                "weight": 10,
                "amount": 13
              },
              {
                "weight": 10,
                "amount": 10
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
                "amount": 11
              },
              {
                "weight": 17.5,
                "amount": 10
              },
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
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T08:33:04.000Z",
        "endedAt": "2026-06-28T08:42:04.000Z"
      }
    ],
    "startedAt": "2026-06-28T08:21:04.000Z",
    "endedAt": "2026-06-28T08:44:04.000Z"
  },
  "henry_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 122.5,
                "amount": 14
              },
              {
                "weight": 120.0,
                "amount": 8
              },
              {
                "weight": 117.5,
                "amount": 10
              },
              {
                "weight": 115.0,
                "amount": 8
              },
              {
                "weight": 112.5,
                "amount": 15
              },
              {
                "weight": 110.0,
                "amount": 15
              },
              {
                "weight": 107.5,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 112.5,
                "amount": 13
              },
              {
                "weight": 110.0,
                "amount": 14
              },
              {
                "weight": 107.5,
                "amount": 13
              },
              {
                "weight": 105.0,
                "amount": 9
              },
              {
                "weight": 102.5,
                "amount": 13
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T06:21:04.000Z",
        "endedAt": "2026-07-02T06:28:04.000Z"
      },
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 10
              },
              {
                "weight": 82.5,
                "amount": 5
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
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
                "amount": 9
              },
              {
                "weight": 60.0,
                "amount": 5
              },
              {
                "weight": 60,
                "amount": 7
              },
              {
                "weight": 60,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 95.0,
                "amount": 5
              },
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
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T06:30:04.000Z",
        "endedAt": "2026-07-02T06:40:04.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 30.0,
                "amount": 17
              },
              {
                "weight": 27.5,
                "amount": 15
              },
              {
                "weight": 25.0,
                "amount": 17
              },
              {
                "weight": 22.5,
                "amount": 18
              },
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 18
              },
              {
                "weight": 15.0,
                "amount": 20
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
                "amount": 18
              },
              {
                "weight": 15,
                "amount": 19
              },
              {
                "weight": 15,
                "amount": 14
              },
              {
                "weight": 15,
                "amount": 16
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 32.5,
                "amount": 14
              },
              {
                "weight": 30.0,
                "amount": 14
              },
              {
                "weight": 27.5,
                "amount": 19
              },
              {
                "weight": 25.0,
                "amount": 18
              }
            ]
          }
        ],
        "startedAt": "2026-07-02T06:41:04.000Z",
        "endedAt": "2026-07-02T06:52:04.000Z"
      }
    ],
    "startedAt": "2026-07-02T06:21:04.000Z",
    "endedAt": "2026-07-02T06:54:04.000Z"
  },
  "henry_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 9
              },
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 10
              },
              {
                "weight": 15.0,
                "amount": 9
              },
              {
                "weight": 12.5,
                "amount": 11
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 10
              },
              {
                "weight": 20.0,
                "amount": 11
              },
              {
                "weight": 17.5,
                "amount": 11
              },
              {
                "weight": 15.0,
                "amount": 9
              },
              {
                "weight": 12.5,
                "amount": 10
              },
              {
                "weight": 10.0,
                "amount": 13
              },
              {
                "weight": 10,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 11
              },
              {
                "weight": 15.0,
                "amount": 8
              },
              {
                "weight": 12.5,
                "amount": 14
              },
              {
                "weight": 10.0,
                "amount": 14
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T06:21:04.000Z",
        "endedAt": "2026-06-28T06:30:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 19
              },
              {
                "weight": 5,
                "amount": 15
              },
              {
                "weight": 5,
                "amount": 12
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
                "weight": 10.0,
                "amount": 11
              },
              {
                "weight": 7.5,
                "amount": 14
              },
              {
                "weight": 5.0,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 20
              },
              {
                "weight": 5,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 16
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 16
              },
              {
                "weight": 5.0,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 19
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T06:32:04.000Z",
        "endedAt": "2026-06-28T06:41:04.000Z"
      },
      {
        "name": "Overhead Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 60.0,
                "amount": 12
              },
              {
                "weight": 57.5,
                "amount": 8
              },
              {
                "weight": 55.0,
                "amount": 6
              },
              {
                "weight": 52.5,
                "amount": 8
              },
              {
                "weight": 50.0,
                "amount": 7
              },
              {
                "weight": 47.5,
                "amount": 7
              },
              {
                "weight": 45.0,
                "amount": 6
              },
              {
                "weight": 42.5,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 32.5,
                "amount": 5
              },
              {
                "weight": 30.0,
                "amount": 7
              },
              {
                "weight": 30,
                "amount": 8
              },
              {
                "weight": 30,
                "amount": 5
              },
              {
                "weight": 30,
                "amount": 9
              },
              {
                "weight": 30,
                "amount": 7
              },
              {
                "weight": 30,
                "amount": 9
              },
              {
                "weight": 30,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 35.0,
                "amount": 6
              },
              {
                "weight": 32.5,
                "amount": 9
              },
              {
                "weight": 30.0,
                "amount": 8
              },
              {
                "weight": 30,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T06:42:04.000Z",
        "endedAt": "2026-06-28T06:51:04.000Z"
      }
    ],
    "startedAt": "2026-06-28T06:21:04.000Z",
    "endedAt": "2026-06-28T06:54:04.000Z"
  },
  "sara_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 162.5,
                "amount": 11
              },
              {
                "weight": 160.0,
                "amount": 15
              },
              {
                "weight": 157.5,
                "amount": 11
              },
              {
                "weight": 155.0,
                "amount": 11
              },
              {
                "weight": 152.5,
                "amount": 8
              },
              {
                "weight": 150.0,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 87.5,
                "amount": 8
              },
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 15
              },
              {
                "weight": 80.0,
                "amount": 14
              },
              {
                "weight": 80,
                "amount": 9
              },
              {
                "weight": 80,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 197.5,
                "amount": 13
              },
              {
                "weight": 195.0,
                "amount": 11
              },
              {
                "weight": 192.5,
                "amount": 15
              },
              {
                "weight": 190.0,
                "amount": 8
              },
              {
                "weight": 187.5,
                "amount": 13
              },
              {
                "weight": 185.0,
                "amount": 14
              },
              {
                "weight": 182.5,
                "amount": 13
              }
            ]
          }
        ],
        "startedAt": "2026-07-06T05:21:04.000Z",
        "endedAt": "2026-07-06T05:33:04.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 87.5,
                "amount": 12
              },
              {
                "weight": 85.0,
                "amount": 10
              },
              {
                "weight": 82.5,
                "amount": 6
              },
              {
                "weight": 80.0,
                "amount": 7
              },
              {
                "weight": 77.5,
                "amount": 9
              },
              {
                "weight": 75.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 55.0,
                "amount": 9
              },
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 8
              },
              {
                "weight": 47.5,
                "amount": 12
              },
              {
                "weight": 45.0,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-06T05:34:04.000Z",
        "endedAt": "2026-07-06T05:42:04.000Z"
      }
    ],
    "startedAt": "2026-07-06T05:21:04.000Z",
    "endedAt": "2026-07-06T05:45:04.000Z"
  },
  "sara_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
          {
            "reps": [
              {
                "weight": 45.0,
                "amount": 14
              },
              {
                "weight": 42.5,
                "amount": 8
              },
              {
                "weight": 40.0,
                "amount": 11
              },
              {
                "weight": 37.5,
                "amount": 8
              },
              {
                "weight": 35.0,
                "amount": 10
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
                "amount": 10
              },
              {
                "weight": 32.5,
                "amount": 14
              },
              {
                "weight": 30.0,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 37.5,
                "amount": 9
              },
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 32.5,
                "amount": 10
              },
              {
                "weight": 30.0,
                "amount": 13
              },
              {
                "weight": 27.5,
                "amount": 11
              },
              {
                "weight": 25.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 37.5,
                "amount": 15
              },
              {
                "weight": 35.0,
                "amount": 8
              },
              {
                "weight": 32.5,
                "amount": 12
              },
              {
                "weight": 30.0,
                "amount": 14
              },
              {
                "weight": 27.5,
                "amount": 13
              },
              {
                "weight": 25.0,
                "amount": 13
              },
              {
                "weight": 22.5,
                "amount": 15
              },
              {
                "weight": 20.0,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T08:21:04.000Z",
        "endedAt": "2026-07-01T08:32:04.000Z"
      },
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 14
              },
              {
                "weight": 17.5,
                "amount": 9
              },
              {
                "weight": 15.0,
                "amount": 11
              },
              {
                "weight": 12.5,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 9
              },
              {
                "weight": 20.0,
                "amount": 8
              },
              {
                "weight": 17.5,
                "amount": 15
              },
              {
                "weight": 15.0,
                "amount": 11
              },
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 15
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
                "amount": 8
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
                "weight": 10,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-01T08:33:04.000Z",
        "endedAt": "2026-07-01T08:40:04.000Z"
      }
    ],
    "startedAt": "2026-07-01T08:21:04.000Z",
    "endedAt": "2026-07-01T08:42:04.000Z"
  },
  "marcus_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 8
              },
              {
                "weight": 60.0,
                "amount": 8
              },
              {
                "weight": 57.5,
                "amount": 10
              },
              {
                "weight": 55.0,
                "amount": 6
              },
              {
                "weight": 52.5,
                "amount": 8
              },
              {
                "weight": 50.0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 57.5,
                "amount": 8
              },
              {
                "weight": 55.0,
                "amount": 6
              },
              {
                "weight": 52.5,
                "amount": 11
              },
              {
                "weight": 50.0,
                "amount": 12
              },
              {
                "weight": 47.5,
                "amount": 10
              },
              {
                "weight": 45.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 40.0,
                "amount": 12
              },
              {
                "weight": 40,
                "amount": 7
              },
              {
                "weight": 40,
                "amount": 6
              },
              {
                "weight": 40,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 9
              },
              {
                "weight": 87.5,
                "amount": 12
              },
              {
                "weight": 85.0,
                "amount": 8
              },
              {
                "weight": 82.5,
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 12
              },
              {
                "weight": 77.5,
                "amount": 9
              },
              {
                "weight": 75.0,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T08:21:04.000Z",
        "endedAt": "2026-07-04T08:35:04.000Z"
      },
      {
        "name": "Overhead Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 40.0,
                "amount": 8
              },
              {
                "weight": 37.5,
                "amount": 10
              },
              {
                "weight": 35.0,
                "amount": 10
              },
              {
                "weight": 32.5,
                "amount": 12
              },
              {
                "weight": 30.0,
                "amount": 10
              },
              {
                "weight": 30,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 55.0,
                "amount": 7
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
                "amount": 6
              },
              {
                "weight": 45.0,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 10
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
                "amount": 6
              },
              {
                "weight": 55.0,
                "amount": 6
              },
              {
                "weight": 52.5,
                "amount": 9
              },
              {
                "weight": 50.0,
                "amount": 6
              },
              {
                "weight": 47.5,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 60.0,
                "amount": 12
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
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 11
              },
              {
                "weight": 47.5,
                "amount": 12
              },
              {
                "weight": 45.0,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T08:36:04.000Z",
        "endedAt": "2026-07-04T08:47:04.000Z"
      }
    ],
    "startedAt": "2026-07-04T08:21:04.000Z",
    "endedAt": "2026-07-04T08:49:04.000Z"
  },
  "marcus_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 9
              },
              {
                "weight": 60.0,
                "amount": 7
              },
              {
                "weight": 57.5,
                "amount": 7
              },
              {
                "weight": 55.0,
                "amount": 7
              },
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 8
              },
              {
                "weight": 60.0,
                "amount": 6
              },
              {
                "weight": 57.5,
                "amount": 9
              },
              {
                "weight": 55.0,
                "amount": 8
              },
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 10
              },
              {
                "weight": 50,
                "amount": 10
              },
              {
                "weight": 50,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 9
              },
              {
                "weight": 87.5,
                "amount": 6
              },
              {
                "weight": 85.0,
                "amount": 6
              },
              {
                "weight": 82.5,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 102.5,
                "amount": 9
              },
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
                "amount": 8
              },
              {
                "weight": 92.5,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T06:21:04.000Z",
        "endedAt": "2026-06-27T06:31:04.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 52.5,
                "amount": 6
              },
              {
                "weight": 50.0,
                "amount": 8
              },
              {
                "weight": 47.5,
                "amount": 10
              },
              {
                "weight": 45.0,
                "amount": 12
              },
              {
                "weight": 42.5,
                "amount": 7
              },
              {
                "weight": 40.0,
                "amount": 9
              },
              {
                "weight": 40,
                "amount": 10
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
                "weight": 45.0,
                "amount": 11
              },
              {
                "weight": 42.5,
                "amount": 10
              },
              {
                "weight": 40.0,
                "amount": 11
              },
              {
                "weight": 40,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 42.5,
                "amount": 8
              },
              {
                "weight": 40.0,
                "amount": 8
              },
              {
                "weight": 40,
                "amount": 7
              },
              {
                "weight": 40,
                "amount": 6
              },
              {
                "weight": 40,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 77.5,
                "amount": 11
              },
              {
                "weight": 75.0,
                "amount": 11
              },
              {
                "weight": 72.5,
                "amount": 7
              },
              {
                "weight": 70.0,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T06:32:04.000Z",
        "endedAt": "2026-06-27T06:44:04.000Z"
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
                "amount": 5
              },
              {
                "weight": 0.0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 4
              },
              {
                "weight": 0,
                "amount": 11
              },
              {
                "weight": 0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 5
              },
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 12
              },
              {
                "weight": 5.0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 2.5,
                "amount": 6
              },
              {
                "weight": 0.0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 4
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 10
              },
              {
                "weight": 5.0,
                "amount": 4
              },
              {
                "weight": 2.5,
                "amount": 9
              },
              {
                "weight": 0.0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-06-27T06:46:04.000Z",
        "endedAt": "2026-06-27T06:59:04.000Z"
      }
    ],
    "startedAt": "2026-06-27T06:21:04.000Z",
    "endedAt": "2026-06-27T07:00:04.000Z"
  },
  "liam_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Incline Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 12
              },
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 7
              },
              {
                "weight": 57.5,
                "amount": 6
              },
              {
                "weight": 55.0,
                "amount": 6
              },
              {
                "weight": 52.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 40.0,
                "amount": 10
              },
              {
                "weight": 37.5,
                "amount": 10
              },
              {
                "weight": 35.0,
                "amount": 8
              },
              {
                "weight": 35,
                "amount": 11
              },
              {
                "weight": 35,
                "amount": 10
              },
              {
                "weight": 35,
                "amount": 7
              },
              {
                "weight": 35,
                "amount": 7
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
                "amount": 7
              },
              {
                "weight": 40.0,
                "amount": 6
              },
              {
                "weight": 37.5,
                "amount": 6
              },
              {
                "weight": 35.0,
                "amount": 9
              },
              {
                "weight": 35,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 42.5,
                "amount": 12
              },
              {
                "weight": 40.0,
                "amount": 6
              },
              {
                "weight": 37.5,
                "amount": 9
              },
              {
                "weight": 35.0,
                "amount": 8
              },
              {
                "weight": 35,
                "amount": 6
              },
              {
                "weight": 35,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T05:21:04.000Z",
        "endedAt": "2026-06-23T05:33:04.000Z"
      },
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 6
              },
              {
                "weight": 75.0,
                "amount": 9
              },
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
                "amount": 6
              },
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 9
              },
              {
                "weight": 60.0,
                "amount": 6
              },
              {
                "weight": 60,
                "amount": 8
              },
              {
                "weight": 60,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 10
              },
              {
                "weight": 87.5,
                "amount": 6
              },
              {
                "weight": 85.0,
                "amount": 5
              },
              {
                "weight": 82.5,
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 75.0,
                "amount": 8
              },
              {
                "weight": 72.5,
                "amount": 9
              },
              {
                "weight": 70.0,
                "amount": 8
              },
              {
                "weight": 67.5,
                "amount": 9
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
          }
        ],
        "startedAt": "2026-06-23T05:34:04.000Z",
        "endedAt": "2026-06-23T05:47:04.000Z"
      }
    ],
    "startedAt": "2026-06-23T05:21:04.000Z",
    "endedAt": "2026-06-23T05:49:04.000Z"
  },
  "liam_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 8
              },
              {
                "weight": 12.5,
                "amount": 8
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 9
              },
              {
                "weight": 20.0,
                "amount": 9
              },
              {
                "weight": 17.5,
                "amount": 10
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 12.5,
                "amount": 14
              },
              {
                "weight": 10.0,
                "amount": 13
              },
              {
                "weight": 10,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 8
              },
              {
                "weight": 22.5,
                "amount": 8
              },
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 9
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 12.5,
                "amount": 9
              },
              {
                "weight": 10.0,
                "amount": 8
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
                "weight": 10.0,
                "amount": 9
              },
              {
                "weight": 10,
                "amount": 9
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 10
              },
              {
                "weight": 10,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T05:21:04.000Z",
        "endedAt": "2026-06-29T05:32:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 7.5,
                "amount": 15
              },
              {
                "weight": 5.0,
                "amount": 19
              },
              {
                "weight": 5,
                "amount": 14
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
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 18
              },
              {
                "weight": 12.5,
                "amount": 17
              },
              {
                "weight": 10.0,
                "amount": 13
              },
              {
                "weight": 7.5,
                "amount": 19
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 15
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 7.5,
                "amount": 10
              },
              {
                "weight": 5.0,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 12
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
                "weight": 17.5,
                "amount": 12
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
                "amount": 18
              },
              {
                "weight": 7.5,
                "amount": 10
              },
              {
                "weight": 5.0,
                "amount": 20
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T05:35:04.000Z",
        "endedAt": "2026-06-29T05:49:04.000Z"
      },
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 2.5,
                "amount": 8
              },
              {
                "weight": 0.0,
                "amount": 12
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 9
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 9
              },
              {
                "weight": 0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 2.5,
                "amount": 11
              },
              {
                "weight": 0.0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 6
              },
              {
                "weight": 0,
                "amount": 4
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 9
              },
              {
                "weight": 17.5,
                "amount": 4
              },
              {
                "weight": 15.0,
                "amount": 4
              },
              {
                "weight": 12.5,
                "amount": 7
              },
              {
                "weight": 10.0,
                "amount": 6
              },
              {
                "weight": 7.5,
                "amount": 8
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
                "amount": 9
              },
              {
                "weight": 7.5,
                "amount": 4
              },
              {
                "weight": 5.0,
                "amount": 6
              },
              {
                "weight": 2.5,
                "amount": 11
              },
              {
                "weight": 0.0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 4
              }
            ]
          }
        ],
        "startedAt": "2026-06-29T05:52:04.000Z",
        "endedAt": "2026-06-29T06:02:04.000Z"
      }
    ],
    "startedAt": "2026-06-29T05:21:04.000Z",
    "endedAt": "2026-06-29T06:03:04.000Z"
  },
  "priya_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 135.0,
                "amount": 7
              },
              {
                "weight": 132.5,
                "amount": 9
              },
              {
                "weight": 130.0,
                "amount": 6
              },
              {
                "weight": 127.5,
                "amount": 6
              },
              {
                "weight": 125.0,
                "amount": 7
              },
              {
                "weight": 122.5,
                "amount": 9
              },
              {
                "weight": 120.0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 60.0,
                "amount": 6
              },
              {
                "weight": 60,
                "amount": 10
              },
              {
                "weight": 60,
                "amount": 6
              },
              {
                "weight": 60,
                "amount": 8
              },
              {
                "weight": 60,
                "amount": 5
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:21:04.000Z",
        "endedAt": "2026-06-25T04:26:04.000Z"
      },
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 182.5,
                "amount": 12
              },
              {
                "weight": 180.0,
                "amount": 8
              },
              {
                "weight": 177.5,
                "amount": 8
              },
              {
                "weight": 175.0,
                "amount": 13
              },
              {
                "weight": 172.5,
                "amount": 15
              },
              {
                "weight": 170.0,
                "amount": 15
              },
              {
                "weight": 167.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 8
              },
              {
                "weight": 82.5,
                "amount": 8
              },
              {
                "weight": 80.0,
                "amount": 14
              },
              {
                "weight": 80,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 87.5,
                "amount": 9
              },
              {
                "weight": 85.0,
                "amount": 8
              },
              {
                "weight": 82.5,
                "amount": 11
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 80,
                "amount": 14
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:29:04.000Z",
        "endedAt": "2026-06-25T04:37:04.000Z"
      },
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 5
              },
              {
                "weight": 7.5,
                "amount": 8
              },
              {
                "weight": 5.0,
                "amount": 4
              },
              {
                "weight": 2.5,
                "amount": 11
              },
              {
                "weight": 0.0,
                "amount": 12
              },
              {
                "weight": 0,
                "amount": 4
              },
              {
                "weight": 0,
                "amount": 10
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
                "weight": 2.5,
                "amount": 11
              },
              {
                "weight": 0.0,
                "amount": 6
              },
              {
                "weight": 0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 5
              },
              {
                "weight": 0,
                "amount": 8
              },
              {
                "weight": 0,
                "amount": 7
              },
              {
                "weight": 0,
                "amount": 4
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:40:04.000Z",
        "endedAt": "2026-06-25T04:48:04.000Z"
      }
    ],
    "startedAt": "2026-06-25T04:21:04.000Z",
    "endedAt": "2026-06-25T04:51:04.000Z"
  },
  "priya_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 82.5,
                "amount": 12
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 8
              },
              {
                "weight": 75.0,
                "amount": 8
              },
              {
                "weight": 72.5,
                "amount": 11
              },
              {
                "weight": 70.0,
                "amount": 7
              },
              {
                "weight": 67.5,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 50.0,
                "amount": 8
              },
              {
                "weight": 47.5,
                "amount": 7
              },
              {
                "weight": 45.0,
                "amount": 12
              },
              {
                "weight": 42.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 87.5,
                "amount": 8
              },
              {
                "weight": 85.0,
                "amount": 7
              },
              {
                "weight": 82.5,
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 8
              },
              {
                "weight": 77.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 11
              },
              {
                "weight": 77.5,
                "amount": 11
              },
              {
                "weight": 75.0,
                "amount": 12
              },
              {
                "weight": 72.5,
                "amount": 10
              },
              {
                "weight": 70.0,
                "amount": 9
              },
              {
                "weight": 67.5,
                "amount": 9
              },
              {
                "weight": 65.0,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T04:21:04.000Z",
        "endedAt": "2026-06-28T04:31:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 12.5,
                "amount": 16
              },
              {
                "weight": 10.0,
                "amount": 19
              },
              {
                "weight": 7.5,
                "amount": 19
              },
              {
                "weight": 5.0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 10
              },
              {
                "weight": 5.0,
                "amount": 11
              },
              {
                "weight": 5,
                "amount": 11
              },
              {
                "weight": 5,
                "amount": 19
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 10
              },
              {
                "weight": 5.0,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 12
              },
              {
                "weight": 5,
                "amount": 20
              },
              {
                "weight": 5,
                "amount": 20
              }
            ]
          }
        ],
        "startedAt": "2026-06-28T04:32:04.000Z",
        "endedAt": "2026-06-28T04:39:04.000Z"
      }
    ],
    "startedAt": "2026-06-28T04:21:04.000Z",
    "endedAt": "2026-06-28T04:42:04.000Z"
  },
  "elena_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Incline Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 77.5,
                "amount": 6
              },
              {
                "weight": 75.0,
                "amount": 12
              },
              {
                "weight": 72.5,
                "amount": 12
              },
              {
                "weight": 70.0,
                "amount": 11
              },
              {
                "weight": 67.5,
                "amount": 9
              },
              {
                "weight": 65.0,
                "amount": 6
              },
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 37.5,
                "amount": 6
              },
              {
                "weight": 35.0,
                "amount": 12
              },
              {
                "weight": 35,
                "amount": 12
              },
              {
                "weight": 35,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T06:21:04.000Z",
        "endedAt": "2026-07-05T06:27:04.000Z"
      },
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 6
              },
              {
                "weight": 77.5,
                "amount": 7
              },
              {
                "weight": 75.0,
                "amount": 6
              },
              {
                "weight": 72.5,
                "amount": 12
              },
              {
                "weight": 70.0,
                "amount": 12
              },
              {
                "weight": 67.5,
                "amount": 11
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
                "amount": 9
              },
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 6
              },
              {
                "weight": 60.0,
                "amount": 8
              },
              {
                "weight": 57.5,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 95.0,
                "amount": 12
              },
              {
                "weight": 92.5,
                "amount": 8
              },
              {
                "weight": 90.0,
                "amount": 8
              },
              {
                "weight": 87.5,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 12
              },
              {
                "weight": 77.5,
                "amount": 8
              },
              {
                "weight": 75.0,
                "amount": 10
              },
              {
                "weight": 72.5,
                "amount": 11
              },
              {
                "weight": 70.0,
                "amount": 6
              },
              {
                "weight": 67.5,
                "amount": 12
              },
              {
                "weight": 65.0,
                "amount": 9
              },
              {
                "weight": 62.5,
                "amount": 6
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T06:30:04.000Z",
        "endedAt": "2026-07-05T06:40:04.000Z"
      }
    ],
    "startedAt": "2026-07-05T06:21:04.000Z",
    "endedAt": "2026-07-05T06:42:04.000Z"
  },
  "elena_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 152.5,
                "amount": 12
              },
              {
                "weight": 150.0,
                "amount": 10
              },
              {
                "weight": 147.5,
                "amount": 14
              },
              {
                "weight": 145.0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 115.0,
                "amount": 8
              },
              {
                "weight": 112.5,
                "amount": 8
              },
              {
                "weight": 110.0,
                "amount": 13
              },
              {
                "weight": 107.5,
                "amount": 15
              },
              {
                "weight": 105.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 142.5,
                "amount": 13
              },
              {
                "weight": 140.0,
                "amount": 12
              },
              {
                "weight": 137.5,
                "amount": 10
              },
              {
                "weight": 135.0,
                "amount": 12
              },
              {
                "weight": 132.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
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
                "amount": 9
              },
              {
                "weight": 135.0,
                "amount": 15
              },
              {
                "weight": 132.5,
                "amount": 9
              }
            ]
          }
        ],
        "startedAt": "2026-06-21T07:21:04.000Z",
        "endedAt": "2026-06-21T07:36:04.000Z"
      },
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 110.0,
                "amount": 9
              },
              {
                "weight": 107.5,
                "amount": 11
              },
              {
                "weight": 105.0,
                "amount": 6
              },
              {
                "weight": 102.5,
                "amount": 9
              },
              {
                "weight": 100.0,
                "amount": 11
              },
              {
                "weight": 97.5,
                "amount": 6
              },
              {
                "weight": 95.0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 9
              },
              {
                "weight": 62.5,
                "amount": 10
              },
              {
                "weight": 60.0,
                "amount": 10
              },
              {
                "weight": 57.5,
                "amount": 7
              },
              {
                "weight": 55.0,
                "amount": 9
              },
              {
                "weight": 52.5,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-21T07:38:04.000Z",
        "endedAt": "2026-06-21T07:45:04.000Z"
      }
    ],
    "startedAt": "2026-06-21T07:21:04.000Z",
    "endedAt": "2026-06-21T07:46:04.000Z"
  },
  "josh_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 97.5,
                "amount": 8
              },
              {
                "weight": 95.0,
                "amount": 7
              },
              {
                "weight": 92.5,
                "amount": 9
              },
              {
                "weight": 90.0,
                "amount": 9
              },
              {
                "weight": 87.5,
                "amount": 11
              },
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
                "amount": 10
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
                "amount": 11
              },
              {
                "weight": 62.5,
                "amount": 7
              },
              {
                "weight": 60.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 70.0,
                "amount": 12
              },
              {
                "weight": 67.5,
                "amount": 11
              },
              {
                "weight": 65.0,
                "amount": 12
              },
              {
                "weight": 62.5,
                "amount": 12
              },
              {
                "weight": 60.0,
                "amount": 10
              },
              {
                "weight": 57.5,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T07:21:04.000Z",
        "endedAt": "2026-07-05T07:29:04.000Z"
      },
      {
        "name": "Pull Up",
        "sets": [
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 9
              },
              {
                "weight": 15.0,
                "amount": 6
              },
              {
                "weight": 12.5,
                "amount": 7
              },
              {
                "weight": 10.0,
                "amount": 9
              },
              {
                "weight": 7.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 5
              },
              {
                "weight": 2.5,
                "amount": 7
              },
              {
                "weight": 0.0,
                "amount": 10
              },
              {
                "weight": 0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 8
              },
              {
                "weight": 5.0,
                "amount": 7
              },
              {
                "weight": 2.5,
                "amount": 5
              },
              {
                "weight": 0.0,
                "amount": 5
              },
              {
                "weight": 0,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 4
              },
              {
                "weight": 12.5,
                "amount": 4
              },
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 10
              },
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
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T07:30:04.000Z",
        "endedAt": "2026-07-05T07:38:04.000Z"
      },
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 175.0,
                "amount": 14
              },
              {
                "weight": 172.5,
                "amount": 8
              },
              {
                "weight": 170.0,
                "amount": 11
              },
              {
                "weight": 167.5,
                "amount": 14
              },
              {
                "weight": 165.0,
                "amount": 14
              },
              {
                "weight": 162.5,
                "amount": 11
              },
              {
                "weight": 160.0,
                "amount": 11
              },
              {
                "weight": 157.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 137.5,
                "amount": 14
              },
              {
                "weight": 135.0,
                "amount": 13
              },
              {
                "weight": 132.5,
                "amount": 12
              },
              {
                "weight": 130.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 180.0,
                "amount": 14
              },
              {
                "weight": 177.5,
                "amount": 10
              },
              {
                "weight": 175.0,
                "amount": 12
              },
              {
                "weight": 172.5,
                "amount": 14
              },
              {
                "weight": 170.0,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T07:39:04.000Z",
        "endedAt": "2026-07-05T07:48:04.000Z"
      }
    ],
    "startedAt": "2026-07-05T07:21:04.000Z",
    "endedAt": "2026-07-05T07:51:04.000Z"
  },
  "josh_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 122.5,
                "amount": 9
              },
              {
                "weight": 120.0,
                "amount": 8
              },
              {
                "weight": 117.5,
                "amount": 12
              },
              {
                "weight": 115.0,
                "amount": 11
              },
              {
                "weight": 112.5,
                "amount": 10
              },
              {
                "weight": 110.0,
                "amount": 11
              },
              {
                "weight": 107.5,
                "amount": 13
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 117.5,
                "amount": 11
              },
              {
                "weight": 115.0,
                "amount": 15
              },
              {
                "weight": 112.5,
                "amount": 8
              },
              {
                "weight": 110.0,
                "amount": 13
              },
              {
                "weight": 107.5,
                "amount": 13
              },
              {
                "weight": 105.0,
                "amount": 14
              },
              {
                "weight": 102.5,
                "amount": 15
              },
              {
                "weight": 100.0,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T06:21:04.000Z",
        "endedAt": "2026-06-23T06:28:04.000Z"
      },
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 20
              },
              {
                "weight": 12.5,
                "amount": 10
              },
              {
                "weight": 10.0,
                "amount": 14
              },
              {
                "weight": 7.5,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 11
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 20
              },
              {
                "weight": 5,
                "amount": 20
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
                "weight": 7.5,
                "amount": 13
              },
              {
                "weight": 5.0,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 16
              },
              {
                "weight": 5,
                "amount": 18
              },
              {
                "weight": 5,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 16
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 10.0,
                "amount": 12
              },
              {
                "weight": 7.5,
                "amount": 11
              },
              {
                "weight": 5.0,
                "amount": 20
              },
              {
                "weight": 5,
                "amount": 13
              },
              {
                "weight": 5,
                "amount": 17
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T06:30:04.000Z",
        "endedAt": "2026-06-23T06:43:04.000Z"
      }
    ],
    "startedAt": "2026-06-23T06:21:04.000Z",
    "endedAt": "2026-06-23T06:44:04.000Z"
  },
  "noah_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Tricep Pushdown",
        "sets": [
          {
            "reps": [
              {
                "weight": 40.0,
                "amount": 15
              },
              {
                "weight": 37.5,
                "amount": 13
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
          },
          {
            "reps": [
              {
                "weight": 27.5,
                "amount": 10
              },
              {
                "weight": 25.0,
                "amount": 15
              },
              {
                "weight": 22.5,
                "amount": 8
              },
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 13
              },
              {
                "weight": 15.0,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 15
              },
              {
                "weight": 22.5,
                "amount": 15
              },
              {
                "weight": 20.0,
                "amount": 14
              },
              {
                "weight": 17.5,
                "amount": 9
              },
              {
                "weight": 15.0,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 9
              },
              {
                "weight": 15,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 10
              },
              {
                "weight": 15,
                "amount": 13
              },
              {
                "weight": 15,
                "amount": 8
              },
              {
                "weight": 15,
                "amount": 8
              },
              {
                "weight": 15,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:21:04.000Z",
        "endedAt": "2026-06-25T04:34:04.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 77.5,
                "amount": 7
              },
              {
                "weight": 75.0,
                "amount": 12
              },
              {
                "weight": 72.5,
                "amount": 7
              },
              {
                "weight": 70.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 7
              },
              {
                "weight": 87.5,
                "amount": 7
              },
              {
                "weight": 85.0,
                "amount": 9
              },
              {
                "weight": 82.5,
                "amount": 12
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 6
              },
              {
                "weight": 87.5,
                "amount": 11
              },
              {
                "weight": 85.0,
                "amount": 10
              },
              {
                "weight": 82.5,
                "amount": 12
              },
              {
                "weight": 80.0,
                "amount": 11
              },
              {
                "weight": 77.5,
                "amount": 12
              },
              {
                "weight": 75.0,
                "amount": 8
              },
              {
                "weight": 72.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 72.5,
                "amount": 6
              },
              {
                "weight": 70.0,
                "amount": 11
              },
              {
                "weight": 67.5,
                "amount": 12
              },
              {
                "weight": 65.0,
                "amount": 9
              },
              {
                "weight": 62.5,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:36:04.000Z",
        "endedAt": "2026-06-25T04:46:04.000Z"
      },
      {
        "name": "Cable Fly",
        "sets": [
          {
            "reps": [
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
                "amount": 14
              },
              {
                "weight": 10,
                "amount": 10
              },
              {
                "weight": 10,
                "amount": 13
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 11
              },
              {
                "weight": 22.5,
                "amount": 13
              },
              {
                "weight": 20.0,
                "amount": 11
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 14
              }
            ]
          }
        ],
        "startedAt": "2026-06-25T04:48:04.000Z",
        "endedAt": "2026-06-25T04:59:04.000Z"
      }
    ],
    "startedAt": "2026-06-25T04:21:04.000Z",
    "endedAt": "2026-06-25T05:01:04.000Z"
  },
  "noah_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Lateral Raise",
        "sets": [
          {
            "reps": [
              {
                "weight": 5.0,
                "amount": 19
              },
              {
                "weight": 5,
                "amount": 10
              },
              {
                "weight": 5,
                "amount": 20
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
                "weight": 20.0,
                "amount": 17
              },
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
                "amount": 10
              },
              {
                "weight": 12.5,
                "amount": 13
              },
              {
                "weight": 10.0,
                "amount": 16
              },
              {
                "weight": 7.5,
                "amount": 20
              },
              {
                "weight": 5.0,
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
                "weight": 15.0,
                "amount": 17
              },
              {
                "weight": 12.5,
                "amount": 18
              },
              {
                "weight": 10.0,
                "amount": 18
              },
              {
                "weight": 7.5,
                "amount": 13
              },
              {
                "weight": 5.0,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 16
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 12.5,
                "amount": 18
              },
              {
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 7.5,
                "amount": 14
              },
              {
                "weight": 5.0,
                "amount": 14
              },
              {
                "weight": 5,
                "amount": 15
              },
              {
                "weight": 5,
                "amount": 17
              },
              {
                "weight": 5,
                "amount": 16
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T06:21:04.000Z",
        "endedAt": "2026-06-23T06:31:04.000Z"
      },
      {
        "name": "Squat",
        "sets": [
          {
            "reps": [
              {
                "weight": 122.5,
                "amount": 5
              },
              {
                "weight": 120.0,
                "amount": 7
              },
              {
                "weight": 117.5,
                "amount": 6
              },
              {
                "weight": 115.0,
                "amount": 7
              },
              {
                "weight": 112.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 135.0,
                "amount": 10
              },
              {
                "weight": 132.5,
                "amount": 5
              },
              {
                "weight": 130.0,
                "amount": 5
              },
              {
                "weight": 127.5,
                "amount": 8
              },
              {
                "weight": 125.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 130.0,
                "amount": 9
              },
              {
                "weight": 127.5,
                "amount": 5
              },
              {
                "weight": 125.0,
                "amount": 8
              },
              {
                "weight": 122.5,
                "amount": 7
              },
              {
                "weight": 120.0,
                "amount": 5
              },
              {
                "weight": 117.5,
                "amount": 5
              },
              {
                "weight": 115.0,
                "amount": 5
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T06:34:04.000Z",
        "endedAt": "2026-06-23T06:45:04.000Z"
      },
      {
        "name": "Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 145.0,
                "amount": 7
              },
              {
                "weight": 142.5,
                "amount": 7
              },
              {
                "weight": 140.0,
                "amount": 6
              },
              {
                "weight": 137.5,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 90.0,
                "amount": 4
              },
              {
                "weight": 87.5,
                "amount": 3
              },
              {
                "weight": 85.0,
                "amount": 8
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
                "weight": 80,
                "amount": 8
              },
              {
                "weight": 80,
                "amount": 4
              },
              {
                "weight": 80,
                "amount": 3
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 85.0,
                "amount": 6
              },
              {
                "weight": 82.5,
                "amount": 3
              },
              {
                "weight": 80.0,
                "amount": 8
              },
              {
                "weight": 80,
                "amount": 3
              },
              {
                "weight": 80,
                "amount": 5
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 150.0,
                "amount": 8
              },
              {
                "weight": 147.5,
                "amount": 5
              },
              {
                "weight": 145.0,
                "amount": 5
              },
              {
                "weight": 142.5,
                "amount": 4
              },
              {
                "weight": 140.0,
                "amount": 6
              },
              {
                "weight": 137.5,
                "amount": 3
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T06:48:04.000Z",
        "endedAt": "2026-06-23T06:57:04.000Z"
      }
    ],
    "startedAt": "2026-06-23T06:21:04.000Z",
    "endedAt": "2026-06-23T06:59:04.000Z"
  },
  "ava_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Romanian Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 95.0,
                "amount": 9
              },
              {
                "weight": 92.5,
                "amount": 9
              },
              {
                "weight": 90.0,
                "amount": 6
              },
              {
                "weight": 87.5,
                "amount": 6
              },
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 9
              },
              {
                "weight": 80.0,
                "amount": 10
              },
              {
                "weight": 77.5,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 12
              },
              {
                "weight": 77.5,
                "amount": 9
              },
              {
                "weight": 75.0,
                "amount": 10
              },
              {
                "weight": 72.5,
                "amount": 6
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
                "weight": 62.5,
                "amount": 7
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
                "amount": 9
              },
              {
                "weight": 52.5,
                "amount": 6
              },
              {
                "weight": 50.0,
                "amount": 6
              },
              {
                "weight": 50,
                "amount": 11
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T08:21:04.000Z",
        "endedAt": "2026-07-05T08:32:04.000Z"
      },
      {
        "name": "Leg Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 95.0,
                "amount": 15
              },
              {
                "weight": 92.5,
                "amount": 8
              },
              {
                "weight": 90.0,
                "amount": 12
              },
              {
                "weight": 87.5,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 197.5,
                "amount": 8
              },
              {
                "weight": 195.0,
                "amount": 13
              },
              {
                "weight": 192.5,
                "amount": 10
              },
              {
                "weight": 190.0,
                "amount": 9
              },
              {
                "weight": 187.5,
                "amount": 12
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T08:33:04.000Z",
        "endedAt": "2026-07-05T08:43:04.000Z"
      },
      {
        "name": "Bench Press",
        "sets": [
          {
            "reps": [
              {
                "weight": 97.5,
                "amount": 5
              },
              {
                "weight": 95.0,
                "amount": 5
              },
              {
                "weight": 92.5,
                "amount": 5
              },
              {
                "weight": 90.0,
                "amount": 5
              },
              {
                "weight": 87.5,
                "amount": 5
              },
              {
                "weight": 85.0,
                "amount": 6
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 60.0,
                "amount": 7
              },
              {
                "weight": 57.5,
                "amount": 12
              },
              {
                "weight": 55.0,
                "amount": 5
              },
              {
                "weight": 52.5,
                "amount": 10
              },
              {
                "weight": 50.0,
                "amount": 10
              },
              {
                "weight": 47.5,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 50.0,
                "amount": 6
              },
              {
                "weight": 47.5,
                "amount": 10
              },
              {
                "weight": 45.0,
                "amount": 7
              },
              {
                "weight": 42.5,
                "amount": 11
              },
              {
                "weight": 40.0,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 100.0,
                "amount": 9
              },
              {
                "weight": 97.5,
                "amount": 10
              },
              {
                "weight": 95.0,
                "amount": 9
              },
              {
                "weight": 92.5,
                "amount": 9
              },
              {
                "weight": 90.0,
                "amount": 5
              },
              {
                "weight": 87.5,
                "amount": 10
              },
              {
                "weight": 85.0,
                "amount": 5
              }
            ]
          }
        ],
        "startedAt": "2026-07-05T08:45:04.000Z",
        "endedAt": "2026-07-05T08:56:04.000Z"
      }
    ],
    "startedAt": "2026-07-05T08:21:04.000Z",
    "endedAt": "2026-07-05T08:59:04.000Z"
  },
  "ava_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Dumbbell Curl",
        "sets": [
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 12
              },
              {
                "weight": 22.5,
                "amount": 8
              },
              {
                "weight": 20.0,
                "amount": 13
              },
              {
                "weight": 17.5,
                "amount": 12
              },
              {
                "weight": 15.0,
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
                "amount": 12
              },
              {
                "weight": 22.5,
                "amount": 10
              },
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 12
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 9
              },
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
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 12
              },
              {
                "weight": 10,
                "amount": 8
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 11
              },
              {
                "weight": 22.5,
                "amount": 12
              },
              {
                "weight": 20.0,
                "amount": 8
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 15
              },
              {
                "weight": 12.5,
                "amount": 9
              },
              {
                "weight": 10.0,
                "amount": 13
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T05:21:04.000Z",
        "endedAt": "2026-06-23T05:33:04.000Z"
      },
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 92.5,
                "amount": 13
              },
              {
                "weight": 90.0,
                "amount": 15
              },
              {
                "weight": 87.5,
                "amount": 11
              },
              {
                "weight": 85.0,
                "amount": 11
              },
              {
                "weight": 82.5,
                "amount": 11
              },
              {
                "weight": 80.0,
                "amount": 11
              },
              {
                "weight": 77.5,
                "amount": 9
              },
              {
                "weight": 75.0,
                "amount": 10
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 105.0,
                "amount": 13
              },
              {
                "weight": 102.5,
                "amount": 14
              },
              {
                "weight": 100.0,
                "amount": 10
              },
              {
                "weight": 97.5,
                "amount": 11
              },
              {
                "weight": 95.0,
                "amount": 8
              },
              {
                "weight": 92.5,
                "amount": 15
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 107.5,
                "amount": 15
              },
              {
                "weight": 105.0,
                "amount": 9
              },
              {
                "weight": 102.5,
                "amount": 10
              },
              {
                "weight": 100.0,
                "amount": 13
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 105.0,
                "amount": 12
              },
              {
                "weight": 102.5,
                "amount": 8
              },
              {
                "weight": 100.0,
                "amount": 9
              },
              {
                "weight": 97.5,
                "amount": 8
              }
            ]
          }
        ],
        "startedAt": "2026-06-23T05:35:04.000Z",
        "endedAt": "2026-06-23T05:49:04.000Z"
      }
    ],
    "startedAt": "2026-06-23T05:21:04.000Z",
    "endedAt": "2026-06-23T05:52:04.000Z"
  },
  "zane_0": {
    "name": "Push Day",
    "exercises": [
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 135.0,
                "amount": 10
              },
              {
                "weight": 132.5,
                "amount": 12
              },
              {
                "weight": 130.0,
                "amount": 8
              },
              {
                "weight": 127.5,
                "amount": 13
              },
              {
                "weight": 125.0,
                "amount": 11
              },
              {
                "weight": 122.5,
                "amount": 10
              },
              {
                "weight": 120.0,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 65.0,
                "amount": 8
              },
              {
                "weight": 62.5,
                "amount": 13
              },
              {
                "weight": 60.0,
                "amount": 15
              },
              {
                "weight": 60,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T05:21:04.000Z",
        "endedAt": "2026-06-30T05:28:04.000Z"
      },
      {
        "name": "Cable Fly",
        "sets": [
          {
            "reps": [
              {
                "weight": 17.5,
                "amount": 12
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
                "amount": 15
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
                "amount": 13
              },
              {
                "weight": 17.5,
                "amount": 11
              },
              {
                "weight": 15.0,
                "amount": 12
              },
              {
                "weight": 12.5,
                "amount": 11
              },
              {
                "weight": 10.0,
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 11
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 20.0,
                "amount": 10
              },
              {
                "weight": 17.5,
                "amount": 14
              },
              {
                "weight": 15.0,
                "amount": 10
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
                "weight": 10.0,
                "amount": 10
              },
              {
                "weight": 10,
                "amount": 11
              },
              {
                "weight": 10,
                "amount": 12
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
                "amount": 15
              },
              {
                "weight": 10,
                "amount": 15
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T05:29:04.000Z",
        "endedAt": "2026-06-30T05:41:04.000Z"
      },
      {
        "name": "Barbell Row",
        "sets": [
          {
            "reps": [
              {
                "weight": 60.0,
                "amount": 8
              },
              {
                "weight": 57.5,
                "amount": 8
              },
              {
                "weight": 55.0,
                "amount": 9
              },
              {
                "weight": 52.5,
                "amount": 6
              },
              {
                "weight": 50.0,
                "amount": 8
              },
              {
                "weight": 47.5,
                "amount": 9
              },
              {
                "weight": 45.0,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 55.0,
                "amount": 12
              },
              {
                "weight": 52.5,
                "amount": 7
              },
              {
                "weight": 50.0,
                "amount": 11
              },
              {
                "weight": 47.5,
                "amount": 6
              },
              {
                "weight": 45.0,
                "amount": 9
              },
              {
                "weight": 42.5,
                "amount": 11
              },
              {
                "weight": 40.0,
                "amount": 7
              }
            ]
          }
        ],
        "startedAt": "2026-06-30T05:44:04.000Z",
        "endedAt": "2026-06-30T05:49:04.000Z"
      }
    ],
    "startedAt": "2026-06-30T05:21:04.000Z",
    "endedAt": "2026-06-30T05:50:04.000Z"
  },
  "zane_1": {
    "name": "Pull Day",
    "exercises": [
      {
        "name": "Hip Thrust",
        "sets": [
          {
            "reps": [
              {
                "weight": 62.5,
                "amount": 9
              },
              {
                "weight": 60.0,
                "amount": 15
              },
              {
                "weight": 60,
                "amount": 13
              },
              {
                "weight": 60,
                "amount": 13
              },
              {
                "weight": 60,
                "amount": 11
              },
              {
                "weight": 60,
                "amount": 15
              },
              {
                "weight": 60,
                "amount": 9
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 77.5,
                "amount": 13
              },
              {
                "weight": 75.0,
                "amount": 11
              },
              {
                "weight": 72.5,
                "amount": 8
              },
              {
                "weight": 70.0,
                "amount": 10
              },
              {
                "weight": 67.5,
                "amount": 15
              },
              {
                "weight": 65.0,
                "amount": 10
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T05:21:04.000Z",
        "endedAt": "2026-07-04T05:29:04.000Z"
      },
      {
        "name": "Face Pull",
        "sets": [
          {
            "reps": [
              {
                "weight": 22.5,
                "amount": 14
              },
              {
                "weight": 20.0,
                "amount": 12
              },
              {
                "weight": 17.5,
                "amount": 16
              },
              {
                "weight": 15.0,
                "amount": 16
              },
              {
                "weight": 15,
                "amount": 17
              },
              {
                "weight": 15,
                "amount": 14
              },
              {
                "weight": 15,
                "amount": 16
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 25.0,
                "amount": 19
              },
              {
                "weight": 22.5,
                "amount": 19
              },
              {
                "weight": 20.0,
                "amount": 13
              },
              {
                "weight": 17.5,
                "amount": 14
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 35.0,
                "amount": 15
              },
              {
                "weight": 32.5,
                "amount": 20
              },
              {
                "weight": 30.0,
                "amount": 19
              },
              {
                "weight": 27.5,
                "amount": 16
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T05:31:04.000Z",
        "endedAt": "2026-07-04T05:41:04.000Z"
      },
      {
        "name": "Deadlift",
        "sets": [
          {
            "reps": [
              {
                "weight": 112.5,
                "amount": 4
              },
              {
                "weight": 110.0,
                "amount": 4
              },
              {
                "weight": 107.5,
                "amount": 3
              },
              {
                "weight": 105.0,
                "amount": 6
              },
              {
                "weight": 102.5,
                "amount": 5
              },
              {
                "weight": 100.0,
                "amount": 6
              },
              {
                "weight": 97.5,
                "amount": 4
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 97.5,
                "amount": 8
              },
              {
                "weight": 95.0,
                "amount": 3
              },
              {
                "weight": 92.5,
                "amount": 6
              },
              {
                "weight": 90.0,
                "amount": 7
              },
              {
                "weight": 87.5,
                "amount": 5
              },
              {
                "weight": 85.0,
                "amount": 7
              }
            ]
          },
          {
            "reps": [
              {
                "weight": 80.0,
                "amount": 7
              },
              {
                "weight": 80,
                "amount": 5
              },
              {
                "weight": 80,
                "amount": 4
              },
              {
                "weight": 80,
                "amount": 5
              },
              {
                "weight": 80,
                "amount": 6
              },
              {
                "weight": 80,
                "amount": 3
              },
              {
                "weight": 80,
                "amount": 6
              }
            ]
          }
        ],
        "startedAt": "2026-07-04T05:42:04.000Z",
        "endedAt": "2026-07-04T05:49:04.000Z"
      }
    ],
    "startedAt": "2026-07-04T05:21:04.000Z",
    "endedAt": "2026-07-04T05:52:04.000Z"
  }
}
;
