import type { User } from '@/types/user';

const JOIN_DATE = new Date('2025-01-01T00:00:00.000Z');

const makeUser = (id: string, username: string): User => ({
  id,
  username,
  createdAt: JOIN_DATE,
  updatedAt: JOIN_DATE,
});

export interface MockPerson {
  user: User;
  rawWorkoutKeys: string[];
}

const rawKeys = (person: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `${person}_${i}`);

export const mockCurrentUser: User = makeUser('user-me', 'Tijmen');

export const mockCurrentPerson: MockPerson = {
  user: mockCurrentUser,
  rawWorkoutKeys: rawKeys('tijmen', 10),
};

export const mockFriends: MockPerson[] = [
  { user: makeUser('user-henry', 'Henry'), rawWorkoutKeys: rawKeys('henry', 2) },
  { user: makeUser('user-sara', 'Sara'), rawWorkoutKeys: rawKeys('sara', 2) },
  { user: makeUser('user-marcus', 'Marcus'), rawWorkoutKeys: rawKeys('marcus', 2) },
  { user: makeUser('user-liam', 'Liam'), rawWorkoutKeys: rawKeys('liam', 2) },
  { user: makeUser('user-priya', 'Priya'), rawWorkoutKeys: rawKeys('priya', 2) },
];

export const mockCommunityMembers: MockPerson[] = [
  { user: makeUser('user-elena', 'Elena'), rawWorkoutKeys: rawKeys('elena', 2) },
  { user: makeUser('user-josh', 'Josh'), rawWorkoutKeys: rawKeys('josh', 2) },
  { user: makeUser('user-noah', 'Noah'), rawWorkoutKeys: rawKeys('noah', 2) },
  { user: makeUser('user-ava', 'Ava'), rawWorkoutKeys: rawKeys('ava', 2) },
  { user: makeUser('user-zane', 'Zane'), rawWorkoutKeys: rawKeys('zane', 2) },
];
