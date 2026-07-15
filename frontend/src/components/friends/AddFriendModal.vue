<template>
  <Modal title="Add a friend" size="sm" @close="$emit('close')">
    <div class="add-friend">
      <p class="add-friend__intro">
        Have a friend scan this code — it opens your profile, where they can add you.
      </p>

      <div v-if="state === 'loading'" class="add-friend__qr-slot" aria-hidden="true">
        <SkeletonBlock height="15rem" width="15rem" border-radius="1.25rem" />
      </div>

      <EmptyState v-else-if="state === 'error'" message="Couldn't create your invite link.">
        <AppButton variant="primary" @click="generate">Try again</AppButton>
      </EmptyState>

      <template v-else>
        <div class="add-friend__qr-slot">
          <!-- White tile regardless of theme: QR codes need dark-on-light
               modules to scan reliably, so this is content, not chrome. -->
          <div class="add-friend__qr-tile">
            <canvas
              ref="canvasRef"
              class="add-friend__qr-canvas"
              role="img"
              aria-label="QR code linking to your profile"
            />
          </div>
        </div>

        <p class="add-friend__hint">This code and its link work for 30 minutes.</p>

        <div class="add-friend__buttons">
          <AppButton variant="primary" block @click="share">
            <Icon :icon="canNativeShare ? 'md.share' : 'md.content-copy'" />
            {{ canNativeShare ? 'Share link' : 'Copy link' }}
          </AppButton>
          <AppButton variant="ghost" block @click="$emit('scan')">
            <Icon icon="md.qr-code-scanner" />
            Scan a friend's code
          </AppButton>
        </div>
      </template>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import QRCode from 'qrcode';
import { nextTick, onMounted, ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Icon from '@/components/common/Icon.vue';
import Modal from '@/components/common/Modal.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import useShortUrl from '@/composables/useShortUrl';
import { useToastStore } from '@/stores/toasts';

/**
 * The "Add friend" sheet: a QR (and shareable short link) that lands the
 * other person on your `/users/:id` profile card page, where the actual
 * "Add friend" action lives. The QR encodes a 30-minute `/api/short/<hash>`
 * link rather than the raw URL - shorter payload, denser code, easier scan.
 */
const props = defineProps<{
  userId: string;
}>();

defineEmits<{
  close: [];
  scan: [];
}>();

const toasts = useToastStore();
const { createShortUrl } = useShortUrl();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const shortUrl = ref<string | null>(null);

const canNativeShare = typeof navigator.share === 'function';

const generate = async () => {
  state.value = 'loading';
  try {
    const result = await createShortUrl.execute(`${window.location.origin}/users/${props.userId}`);
    shortUrl.value = result.shortUrl;
    state.value = 'ready';

    await nextTick();
    if (canvasRef.value) {
      await QRCode.toCanvas(canvasRef.value, result.shortUrl, {
        width: 220,
        margin: 1,
        color: { dark: '#111827', light: '#ffffff' },
      });
    }
  } catch {
    state.value = 'error';
  }
};

const share = async () => {
  if (!shortUrl.value) return;

  if (canNativeShare) {
    try {
      await navigator.share({ title: 'Add me on AtHomeServer', url: shortUrl.value });
    } catch {
      // Dismissing the native share sheet rejects - that's a choice, not an error.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(shortUrl.value);
    toasts.addToast({ message: 'Link copied to clipboard.', type: 'success', duration: 3000 });
  } catch {
    toasts.addToast({ message: "Couldn't copy the link.", type: 'error', duration: 4000 });
  }
};

onMounted(generate);
</script>

<style scoped>
.add-friend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-friend__intro {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.add-friend__qr-slot {
  display: flex;
  justify-content: center;
}

.add-friend__qr-tile {
  padding: 0.9rem;
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--surface-border);
  box-shadow: var(--surface-shadow);
  line-height: 0;
}

.add-friend__qr-canvas {
  max-width: 100%;
}

.add-friend__hint {
  margin: 0;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.6;
}

.add-friend__buttons {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
</style>
