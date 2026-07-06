<template>
  <div ref="rootRef" class="combobox">
    <input
      :id="id"
      ref="inputRef"
      class="combobox__input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-listbox`"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @focus="open"
      @keydown="handleKeydown"
    />

    <Transition name="combobox-fade">
      <ul v-if="isOpen && filteredOptions.length > 0" :id="`${id}-listbox`" class="combobox__list" role="listbox">
        <li
          v-for="(option, index) in filteredOptions"
          :key="option"
          :id="`${id}-option-${index}`"
          class="combobox__option"
          :class="{ 'is-highlighted': index === highlightedIndex }"
          role="option"
          :aria-selected="index === highlightedIndex"
          @mousedown.prevent="select(option)"
        >
          {{ option }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: string[];
    id: string;
    placeholder?: string;
  }>(),
  {
    placeholder: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const highlightedIndex = ref(-1);

// Typed text always wins - this is a free-text field with suggestions, not
// a picker restricted to the known list, so a brand new exercise name is
// just as valid an input as picking an existing one.
const filteredOptions = computed(() => {
  const query = props.modelValue.trim().toLowerCase();
  const pool = query
    ? props.options.filter((option) => option.toLowerCase().includes(query))
    : props.options;

  return [...pool]
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
      const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
      return aStarts - bStarts;
    })
    .slice(0, 8);
});

const open = () => {
  isOpen.value = true;
  highlightedIndex.value = -1;
};

const close = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  open();
};

const select = (option: string) => {
  emit('update:modelValue', option);
  close();
  inputRef.value?.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (!isOpen.value) {
      open();
      return;
    }
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
  } else if (event.key === 'Enter') {
    if (isOpen.value && highlightedIndex.value >= 0) {
      event.preventDefault();
      const option = filteredOptions.value[highlightedIndex.value];
      if (option) select(option);
    } else {
      close();
    }
  } else if (event.key === 'Escape') {
    close();
  }
};

const handleOutsideClick = (event: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    close();
  }
};

onMounted(() => document.addEventListener('click', handleOutsideClick));
onUnmounted(() => document.removeEventListener('click', handleOutsideClick));

defineExpose({
  focus: () => nextTick(() => inputRef.value?.focus()),
});
</script>

<style scoped>
.combobox {
  position: relative;
}

.combobox__input {
  width: 100%;
}

.combobox__list {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.3rem);
  left: 0;
  right: 0;
  max-height: 14rem;
  overflow-y: auto;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--surface-shadow-lg);
}

.combobox__option {
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.87rem;
  color: var(--color-text);
  cursor: pointer;
}

.combobox__option.is-highlighted {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
}

.combobox-fade-enter-active,
.combobox-fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.combobox-fade-enter-from,
.combobox-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .combobox-fade-enter-active,
  .combobox-fade-leave-active {
    transition: none;
  }
}
</style>
