import type { Workout } from "@/types/gym"

export default function useGym() {
    const fetchWorkouts = (): Workout[] => {
        return [
            {
                id: 'some_id',
                startedAt: new Date("03-06-2026T11:00:00"),
                endedAt: new Date("03-06-2026T11:00:00"),
                exercises: [
                    {
                        name: 'squad',
                        startedAt: new Date("03-06-2026T11:00:00"),
                        endedAt: new Date("03-06-2026T11:00:00"),
                        sets: [
                            {
                                reps: [
                                    {
                                        weight: 10,
                                        amount: 8
                                    }
                                ]
                            },
                            {
                                reps: [
                                    {
                                        weight: 10,
                                        amount: 8
                                    }
                                ]
                            },
                            {
                                reps: [
                                    {
                                        weight: 10,
                                        amount: 7
                                    },
                                    {
                                        weight: 7.5,
                                        amount: 1
                                    }
                                ]
                            }
                        ]
                    }
                ],
            }
        ]
    }
    return {}
}
