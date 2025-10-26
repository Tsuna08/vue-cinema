<script setup lang="ts">
  import { computed, onMounted, onUnmounted, watch } from "vue";
  import { useRoute } from "vue-router";

  import { useCinemaStore } from "@/entities/Cinema";
  import { useMovieStore } from "@/entities/Movie";
  import { Schedule } from "@/features/Schedule";

  const route = useRoute();
  const store = useCinemaStore();
  const storeMovie = useMovieStore();

  const cinemaId = computed(() => route.params.id as string);
  const cinemaInfo = computed(() => store.getCinemaInfo(cinemaId.value));
  const movieTitles = computed(() => storeMovie.movieSortedById);
  const isLoading = computed(() => store.isLoading || storeMovie.isLoading);
  const hasData = computed(
    () => cinemaInfo.value && Object.keys(movieTitles.value || {}).length > 0,
  );

  onMounted(() => {
    const id = cinemaId.value;
    if (!id) return;

    store.fetchCinemas();
    store.getCinemaSessions(id);
    storeMovie.fetchMovies();
  });

  watch(cinemaId, newId => {
    if (newId) {
      store.getCinemaSessions(newId);
    }
  });

  onUnmounted(() => {
    store.clearError?.();
    storeMovie.clearError?.();
  });
</script>

<template>
  <div
    v-if="isLoading"
    class="loading"
  >
    Загрузка...
  </div>
  <div
    v-else-if="!hasData"
    class="error"
  >
    Данные не найдены
  </div>
  <template v-else>
    <h2>{{ cinemaInfo?.name }}</h2>
    <hr class="divider">
    <Schedule
      :schedule="store.sessionsByDate"
      :movies-data="movieTitles"
      mode="movie"
    />
  </template>
</template>

<style scoped>
  .divider {
    width: 100%;
    margin-bottom: 2rem;
  }
</style>
