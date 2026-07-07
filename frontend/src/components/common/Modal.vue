<template>
  <Teleport to="body">
    <Transition name="modal-backdrop" appear>
      <div class="modal-backdrop" @click.self="handleOutsideClick">
        <Transition name="modal-panel" appear>
          <div
            class="modal"
            :class="[`modal--${size}`, customClass]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <header class="modal__header">
              <h2 :id="titleId" class="modal__title">{{ title }}</h2>
              <button
                v-if="enableClosing"
                class="modal__close"
                type="button"
                aria-label="Close"
                @click="requestClose"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>

            <div class="modal__body">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="modal__footer">
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useModalStack } from '@/composables/useModalStack';

const props = withDefaults(
  defineProps<{
    title: string;
    customClass?: string;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    /** Master switch - false hides the close button and ignores Escape/
     * outside-click, for a step (e.g. a request in flight) that shouldn't
     * be dismissible. */
    enableClosing?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    customClass: '',
    closeOnEscape: true,
    closeOnOutsideClick: true,
    enableClosing: true,
    size: 'sm',
  },
);

const emit = defineEmits<{
  close: [];
}>();

const id = Math.random().toString(36).slice(2);
const titleId = `modal-title-${id}`;
const { open, close: closeStack, isTop } = useModalStack(id);

const requestClose = () => {
  if (props.enableClosing) emit('close');
};

const handleOutsideClick = () => {
  if (props.closeOnOutsideClick) requestClose();
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === 'Escape' && isTop()) {
    requestClose();
  }
};

onMounted(() => {
  open();
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  closeStack();
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

@media (min-width: 641px) {
  .modal-backdrop {
    align-items: center;
  }
}

.modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 26rem;
  max-height: min(32rem, 80vh);
  padding: 1.25rem;
  background: var(--glass-bg-solid);
  border: 1px solid var(--surface-border);
  box-shadow: var(--surface-shadow-lg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

@media (min-width: 641px) {
  .modal {
    border-radius: var(--radius-lg);
    margin-bottom: 0;
  }
}

.modal--md {
  max-width: 42rem;
}

.modal--lg {
  max-width: min(95vw, 1100px);
  max-height: min(95vh, 1100px);
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.modal__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: rgba(var(--overlay-rgb), 0.06);
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.modal__close:hover {
  background: rgba(var(--overlay-rgb), 0.1);
}

.modal__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  color: var(--color-text);
}

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  flex-shrink: 0;
  margin-top: 1.25rem;
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.18s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .modal-backdrop-enter-active,
  .modal-backdrop-leave-active,
  .modal-panel-enter-active,
  .modal-panel-leave-active,
  .modal__close {
    transition: none !important;
  }
}
</style>
