<script setup lang="ts">
  import { computed, onMounted, watch } from "vue";
  import { useRoute } from "vue-router";

  import { useCinemaStore } from "@/entities/Cinema";
  import { useMovieStore } from "@/entities/Movie";
  import MovieInfo from "@/features/MovieInfo.vue";
  import { Schedule } from "@/features/Schedule";

  const route = useRoute();
  const store = useMovieStore();
  const storeCinema = useCinemaStore();

  const movieId = computed(() => Number(route.params.id));
  const movie = computed(() => store.movies.find(item => item.id === movieId.value));
  const cinemaTitles = computed(() => storeCinema.cinemasSortedById);
  const isLoading = computed(() => store.isLoading || storeCinema.isLoading);

  onMounted(() => {
    const id = movieId.value;
    if (!id) return;

    storeCinema.fetchCinemas();
    store.fetchMovies();
    store.getMovieSessions(id.toString());
  });

  watch(movieId, newId => {
    if (newId) {
      store.getMovieSessions(newId.toString());
    }
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
    v-else-if="!movie"
    class="error"
  >
    Фильм не найден
  </div>
  <template v-else>
    <MovieInfo :movie="movie" />
    <Schedule
      :schedule="store.sessionsByDate"
      :cinemas-data="cinemaTitles"
      mode="cinema"
    />
  </template>
</template>

<style scoped>
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
  }
</style>
