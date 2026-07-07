import { ref } from 'vue';

// Module-level, not created per-call - every Modal instance needs to push
// onto the SAME stack for `isTop()` to mean anything. A stack created fresh
// inside `useModalStack()` would make every modal think it's always the
// topmost, which breaks Escape-key handling the moment two are ever open
// at once (a confirm dialog opened from within another modal, say).
const stack = ref<string[]>([]);

export function useModalStack(id: string) {
  const open = () => {
    stack.value.push(id);
  };

  const close = () => {
    const idx = stack.value.lastIndexOf(id);
    if (idx !== -1) stack.value.splice(idx, 1);
  };

  const isTop = () => stack.value[stack.value.length - 1] === id;

  return { open, close, isTop };
}
