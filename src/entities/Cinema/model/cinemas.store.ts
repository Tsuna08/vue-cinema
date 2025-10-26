import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { API_ROUTES, client } from "@/app/api";
import type { Session } from "@/shared/types";
import { sortFilmsByDays } from "@/shared/utils/sortFilmsByDays";

import type { Cinema, CinemaSchedule } from "../types";

export const useCinemaStore = defineStore("cinemas", () => {
  const cinemas = ref<Cinema[]>([]);
  const cinemaSessions = ref<Session[]>([]);
  const error = ref<string | undefined>();
  const isLoading = ref(false);

  const sessionsByDate = computed(() => sortFilmsByDays("movieId", cinemaSessions.value));

  const cinemasSortedById = computed(() => {
    const result: { [key: number]: CinemaSchedule } = {};
    cinemas.value.forEach(cinema => {
      result[cinema.id] = { title: cinema.name, ...cinema };
    });
    return result;
  });

  const getCinemaInfo = (cinemaId: string) => {
    return cinemas.value.find(cinemas => cinemas.id === Number(cinemaId));
  };

  const clearError = () => {
    error.value = undefined;
  };

  const fetchCinemas = () => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get<Cinema[]>(API_ROUTES.cinemas.list)
      .then(result => {
        cinemas.value = result.data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить список кинотеатров";
        isLoading.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const getCinemaSessions = (cinemaId: string) => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get<Session[]>(API_ROUTES.cinemas.sessions(cinemaId))
      .then(result => {
        cinemaSessions.value = result.data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить информацию о кинотеатре";
        isLoading.value = false;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  return {
    // State
    cinemas,
    cinemaSessions,
    isLoading,
    error,
    // Computed
    cinemasSortedById,
    sessionsByDate,
    // Actions
    clearError,
    getCinemaInfo,
    fetchCinemas,
    getCinemaSessions,
  };
});
