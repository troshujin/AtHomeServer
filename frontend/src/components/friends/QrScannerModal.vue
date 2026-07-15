<template>
  <Modal title="Scan a friend's code" size="sm" @close="$emit('close')">
    <div class="qr-scanner">
      <EmptyState
        v-if="state === 'unsupported'"
        message="This browser can't scan QR codes. Ask your friend to share their link instead — it does the same thing."
      />

      <EmptyState
        v-else-if="state === 'error'"
        message="Couldn't start the camera. Check the camera permission for this site and try again."
      >
        <AppButton variant="primary" @click="start">Try again</AppButton>
      </EmptyState>

      <template v-else>
        <div class="qr-scanner__viewport">
          <!-- muted + playsinline are what allow autoplay inside a PWA/iOS
               webview; without them the frame stays black. -->
          <video ref="videoRef" class="qr-scanner__video" autoplay muted playsinline />
          <div class="qr-scanner__frame" aria-hidden="true" />
        </div>

        <p class="qr-scanner__hint" role="status">
          {{
            wrongCode
              ? "That code isn't an AtHomeServer invite."
              : "Point the camera at a friend's add-me code."
          }}
        </p>
      </template>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Modal from '@/components/common/Modal.vue';

/**
 * Camera QR scanner built on the platform's own BarcodeDetector (see the
 * style guide's "native-feel over reinvented" rule) - no decoding library.
 * Browsers without it (notably iOS Safari) get a clear "share the link
 * instead" fallback rather than a broken camera view; the shared link and
 * the QR carry the same URL, so nothing is lost.
 *
 * A detected code only navigates when it points at this app's own origin -
 * a QR is arbitrary attacker-controlled input, not a trusted link.
 */
defineEmits<{
  close: [];
}>();

// BarcodeDetector isn't in TypeScript's DOM lib yet - minimal local shape.
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorLike {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
}
type BarcodeDetectorConstructor = new (options?: { formats: string[] }) => BarcodeDetectorLike;

const SCAN_INTERVAL_MS = 300;

const videoRef = ref<HTMLVideoElement | null>(null);
const state = ref<'scanning' | 'unsupported' | 'error'>('scanning');
const wrongCode = ref(false);

let stream: MediaStream | null = null;
let pollTimer: number | null = null;
let navigating = false;

const detectorConstructor = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor })
  .BarcodeDetector;

const stop = () => {
  if (pollTimer !== null) {
    window.clearInterval(pollTimer);
    pollTimer = null;
  }
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
};

const handleValue = (value: string) => {
  if (!value.startsWith(`${window.location.origin}/`)) {
    wrongCode.value = true;
    return;
  }
  // Short links live under /api/, outside the SPA router - a full
  // navigation is the correct way to follow them.
  navigating = true;
  stop();
  window.location.assign(value);
};

const start = async () => {
  if (!detectorConstructor || !navigator.mediaDevices?.getUserMedia) {
    state.value = 'unsupported';
    return;
  }

  state.value = 'scanning';
  wrongCode.value = false;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
  } catch {
    state.value = 'error';
    return;
  }

  const video = videoRef.value;
  if (!video) return;
  video.srcObject = stream;

  const detector = new detectorConstructor({ formats: ['qr_code'] });

  pollTimer = window.setInterval(async () => {
    if (navigating || !videoRef.value || videoRef.value.readyState < 2) return;
    try {
      const codes = await detector.detect(videoRef.value);
      const value = codes[0]?.rawValue;
      if (value) handleValue(value);
    } catch {
      // A single failed frame isn't an error state - just try the next one.
    }
  }, SCAN_INTERVAL_MS);
};

onMounted(start);
onBeforeUnmount(stop);
</script>

<style scoped>
.qr-scanner {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.qr-scanner__viewport {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  background: #000;
}

.qr-scanner__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* A simple centered target frame so "where do I aim" needs no explanation. */
.qr-scanner__frame {
  position: absolute;
  inset: 18%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-md);
  pointer-events: none;
}

.qr-scanner__hint {
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
