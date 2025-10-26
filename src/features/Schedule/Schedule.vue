<script setup lang="ts">
  import { type CinemaSchedule } from "@/entities/Cinema";
  import { type Movie } from "@/entities/Movie";
  import type { Session as ISession, SessionMode } from "@/shared/types";
  import { formatDate } from "@/shared/utils/formatData";

  import Sessions from "./Sessions.vue";

  interface IScheduleSessions {
    [x: string]: number | ISession[];
    times: ISession[];
  }

  interface Props {
    schedule: { date: string | undefined; sessions: IScheduleSessions[] }[];
    moviesData?: Record<number, Movie>;
    cinemasData?: Record<number, CinemaSchedule>;
    mode: SessionMode;
  }

  const { schedule, moviesData, cinemasData, mode } = defineProps<Props>();

  const getTitle = (id: number) => {
    const data = mode === "movie" ? moviesData : cinemasData;
    return data?.[id]?.title || "Не найдено";
  };

  const getPoster = (movieId: number) => {
    return mode === "movie" ? moviesData?.[movieId]?.posterImage : undefined;
  };

  const getFieldId = (sessions: IScheduleSessions) =>
    Number(sessions?.[mode === "movie" ? "movieId" : "cinemaId"]);
</script>

<template>
  <div
    v-for="item in schedule"
    :key="item.date"
    class="sessions"
  >
    <div>{{ formatDate(item.date) }}</div>
    <hr class="divider">
    <div class="movies-list">
      <Sessions
        v-for="sessions in item.sessions"
        :key="getFieldId(sessions)"
        :sessions="sessions.times"
        :title="getTitle(getFieldId(sessions))"
        :poster="getPoster(getFieldId(sessions))"
      />
    </div>
  </div>
</template>

<style scoped>
  .sessions {
    padding-bottom: 3rem;
  }
  .sessions,
  .movies-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: inherit;
  }
  .divider {
    width: 100%;
    margin-bottom: 1rem;
  }
  .moviesList {
    gap: 1.5rem;
  }
</style>
