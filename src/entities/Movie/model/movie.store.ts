import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { API_ROUTES, client } from "@/app/api";
import type { Session } from "@/shared/types";
import { sortFilmsByDays } from "@/shared/utils/sortFilmsByDays";

import type { Movie } from "../types";

export const useMovieStore = defineStore("movies", () => {
  const movies = ref<Movie[]>([]);
  const movieSessions = ref<Session[]>([]);
  const error = ref<string | undefined>();
  const isLoading = ref(false);

  const movieSortedById = computed(() => {
    const result: { [key: number]: Movie } = {};
    movies.value.forEach(movie => {
      result[movie.id] = movie;
    });
    return result;
  });

  const sessionsByDate = computed(() => sortFilmsByDays("cinemaId", movieSessions.value));

  const clearError = () => {
    error.value = undefined;
  };

  const fetchMovies = () => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get<Movie[]>(API_ROUTES.movies.list)
      .then(result => {
        movies.value = result.data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить список фильмов";
        isLoading.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const getMovieSessions = (movieId: string) => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get<Session[]>(API_ROUTES.movies.sessions(movieId))
      .then(result => {
        movieSessions.value = result.data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить информацию о фильме";
        isLoading.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  return {
    // State
    movies,
    isLoading,
    error,
    // Computed
    movieSortedById,
    sessionsByDate,
    movieSessions,
    // Actions
    clearError,
    getMovieSessions,
    fetchMovies,
  };
});
