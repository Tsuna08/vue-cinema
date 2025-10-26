<script setup lang="ts">
  import type { Session } from "@/shared/types";

  import ListTime from "./ListTime.vue";

  interface Props {
    sessions: Session[];
    title?: string;
    poster?: string;
  }

  const { sessions, title, poster } = defineProps<Props>();
</script>

<template>
  <div class="movie">
    <div class="title">
      <img
        v-if="poster"
        :src="poster"
        alt="poster"
      >
      {{ title }}
    </div>
    <ListTime :sessions="sessions" />
  </div>
</template>

<style scoped>
  .movie {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
  .title {
    display: flex;
    gap: 2rem;
    width: 100%;
    text-align: left;
  }
</style>
