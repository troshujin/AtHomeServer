<template>
  <Modal :title="title" size="sm" :enable-closing="!loading" @close="$emit('close')">
    <p class="confirm-dialog__message">
      <slot>{{ message }}</slot>
    </p>

    <template #footer>
      <AppButton variant="ghost" :disabled="loading" @click="$emit('close')">
        {{ cancelLabel }}
      </AppButton>
      <button
        type="button"
        class="confirm-dialog__confirm"
        :class="{ 'confirm-dialog__confirm--danger': danger }"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        {{ loading ? 'Working…' : confirmLabel }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue';
import Modal from '@/components/common/Modal.vue';

withDefaults(
  defineProps<{
    title: string;
    /** Plain-text body. Use the default slot instead for anything richer. */
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Styles the confirm button as destructive. Defaults on - this
     * component exists for irreversible actions (see the style guide's
     * "irreversible actions" rule), so that's the common case. */
    danger?: boolean;
    /** Disables both buttons and the Modal's own close paths (Escape,
     * outside click, the × button) while a confirm action is in flight. */
    loading?: boolean;
  }>(),
  {
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: true,
    loading: false,
  },
);

defineEmits<{
  confirm: [];
  close: [];
}>();
</script>

<style scoped>
.confirm-dialog__message {
  margin: 0;
  color: var(--color-text);
  opacity: 0.85;
  line-height: 1.5;
}

/* Resting-state danger tint, not hover-only like SetInputRow's remove
   button - the whole point of this dialog is to make the consequence
   unmistakable before it happens, not to stay quiet until interacted with.
   Tinted background + colored text (not solid fill + white text) so it
   clears contrast in both themes without needing a separate dark-theme
   treatment - see STYLE_GUIDE.md's contrast rules for why --color-danger
   isn't used as a solid fill. */
.confirm-dialog__confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.3rem;
  border: none;
  border-radius: var(--radius-pill);
  background: rgba(var(--overlay-rgb), 0.08);
  color: var(--color-secondary);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.87rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.confirm-dialog__confirm--danger {
  background: rgba(var(--color-danger-rgb), 0.15);
  color: var(--color-danger);
}

.confirm-dialog__confirm--danger:hover:not(:disabled) {
  background: rgba(var(--color-danger-rgb), 0.24);
}

.confirm-dialog__confirm:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .confirm-dialog__confirm {
    transition: none;
  }
}
</style>
