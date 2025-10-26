<script setup lang="ts">
  import { useRouter } from "vue-router";

  import type { Session } from "@/shared/types";
  import { getTime } from "@/shared/utils/formatData";

  const { sessions } = defineProps<{ sessions: Session[] }>();

  const router = useRouter();

  const onGoToChooseSeat = (sessionId: number) => {
    router.push({ name: "seatSelection", params: { id: sessionId } });
  };

  const isAvailable = (session: Session): boolean => {
    const sessionTime = new Date(session.startTime);
    const now = new Date();
    return sessionTime > now;
  };
</script>

<template>
  <div class="time">
    <button
      v-for="item in sessions"
      :key="item.id"
      :disabled="!isAvailable(item)"
      :class="{
        unavailable: !isAvailable(item),
      }"
      @click="onGoToChooseSeat(item.id)"
    >
      {{ getTime(item.startTime) }}
    </button>
  </div>
</template>

<style scoped>
  .time {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  .unavailable {
    background-color: var(--bg-disabled);
    color: var(--color-third);
    cursor: auto;
  }

  button {
    min-width: 5rem;
  }
</style>
