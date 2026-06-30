// import api from '@/api/api';
// import type { Friend, CreateFriend } from '@/types/friend';
// import { useCachedApi, useMutation } from '../api/useCacheApi';

// const buildKey = (entryId?: string) => {
//   const base = `friends`;
//   if (entryId !== undefined) return base + `_${entryId}`;
//   return base;
// };

// const buildUrl = (entryId?: string) => {
//   const base = `/friends`;
//   if (entryId !== undefined) return base + `/${entryId}`;
//   return base;
// };

// export default function useFriends() {
//   const fetchFriends = useCachedApi<Friend[], []>(
//     () => buildKey(),
//     async () => await api.get<Friend[]>(buildUrl()),
//   );

//   const fetchFriend = useCachedApi<Friend, [friendId: string]>(
//     (friendId) => buildKey(friendId),
//     async (friendId) => await api.get<Friend>(buildUrl(friendId)),
//   );

//   const createFriend = useMutation<Friend, [payload: CreateFriend]>(
//     async (payload) => await api.post<Friend, CreateFriend>(buildUrl(), payload),
//     {
//       itemKeyFactory: (result, _) => buildKey(result.id),
//       listKeyFactory: (_) => buildKey(),
//       listUpdater: (currentList, result) => {
//         return currentList.map((item) => (item.id == result.id ? result : item));
//       },
//     },
//   );

//   const deleteFriend = useMutation<void, [friendId: string], Friend>(
//     async (friendId) => await api.delete(buildUrl(friendId)),
//     {
//       itemKeyFactory: (_, friendId) => buildKey(friendId),
//       listKeyFactory: (_) => buildKey(),
//       listUpdater: (currentList, friendId) => currentList.filter((item) => item.id !== friendId),
//     },
//   );

//   return { fetchFriends, fetchFriend, createFriend, deleteFriend };
// }
