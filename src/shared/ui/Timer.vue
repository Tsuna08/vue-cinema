<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  startTime: string;
  paymentTimeSeconds: number;
}>();

const emit = defineEmits<{
  expire: [];
}>();

const timeLeft = ref("00:00");
let timer: number;

const expirationTime = computed(
  () => new Date(props.startTime).getTime() + props.paymentTimeSeconds * 1000,
);

const updateTimer = () => {
  const now = Date.now();
  const distance = expirationTime.value - now;

  if (distance <= 0) {
    clearInterval(timer);
    timeLeft.value = "00:00";
    emit("expire");
    return;
  }

  const minutes = Math.floor(distance / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  timeLeft.value = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const isCritical = computed(() => timeLeft.value.startsWith("0") && timeLeft.value !== "00:00");

onMounted(() => {
  updateTimer();
  timer = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="timer" :class="{ 'timer-warning': isCritical }">
    {{ timeLeft }}
  </div>
</template>

<style scoped>
.timer {
  font-weight: bold;
  color: var(--color-main);
  min-width: 60px;
  text-align: center;
}

.timer-warning {
  color: var(--color-error);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
