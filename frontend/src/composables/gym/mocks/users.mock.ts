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

export const mockCurrentUser: User = makeUser('user-me', 'Tijmen');

export const mockCurrentPerson: MockPerson = {
  user: mockCurrentUser,
  rawWorkoutKeys: ['tijmen_a', 'tijmen_b'],
};

export const mockFriends: MockPerson[] = [
  { user: makeUser('user-henry', 'Henry'), rawWorkoutKeys: ['henry'] },
  { user: makeUser('user-sara', 'Sara'), rawWorkoutKeys: ['sara'] },
  { user: makeUser('user-marcus', 'Marcus'), rawWorkoutKeys: ['marcus'] },
];

export const mockCommunityMembers: MockPerson[] = [
  { user: makeUser('user-elena', 'Elena'), rawWorkoutKeys: ['elena'] },
  { user: makeUser('user-josh', 'Josh'), rawWorkoutKeys: ['josh'] },
];
