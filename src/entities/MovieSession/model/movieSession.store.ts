import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { API_ROUTES, client } from "@/app/api";
import { useAuthStore } from "@/app/auth.store";

import type { MovieSessionDetails, Seat } from "../types";

export const useMovieSessionStore = defineStore("movieSession", () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const currentSession = ref<MovieSessionDetails | null>(null);
  const selectedSeats = ref<Seat[]>([]);
  const isLoading = ref(false);
  const error = ref<string | undefined>();

  const sessionsCache = ref<Record<number, MovieSessionDetails>>({});

  const canBook = computed(() => authStore.isAuthenticated && selectedSeats.value.length > 0);

  const availableSeats = computed(() => {
    if (!currentSession.value) return [];

    const { seats, bookedSeats } = currentSession.value;
    const allSeats: Seat[] = [];

    for (let row = 1; row <= seats.rows; row++) {
      for (let seat = 1; seat <= seats.seatsPerRow; seat++) {
        allSeats.push({ rowNumber: row, seatNumber: seat });
      }
    }

    return allSeats.map(seat => ({
      ...seat,
      isBooked: bookedSeats.some(
        booked => booked.rowNumber === seat.rowNumber && booked.seatNumber === seat.seatNumber,
      ),
      isSelected: selectedSeats.value.some(
        selected =>
          selected.rowNumber === seat.rowNumber && selected.seatNumber === seat.seatNumber,
      ),
    }));
  });

  const getSessionById = (sessionId?: number): MovieSessionDetails | null => {
    if (!sessionId) return null;
    return sessionsCache.value[sessionId] || null;
  };

  const toggleSeat = (seat: Seat) => {
    const isSelected = selectedSeats.value.some(
      s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber,
    );

    if (isSelected) {
      selectedSeats.value = selectedSeats.value.filter(
        s => !(s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber),
      );
    } else {
      selectedSeats.value.push(seat);
    }
  };

  const fetchSessionDetails = (sessionId: number): Promise<MovieSessionDetails | void> => {
    if (sessionsCache.value[sessionId]) {
      currentSession.value = sessionsCache.value[sessionId];
      return Promise.resolve(sessionsCache.value[sessionId]);
    }

    isLoading.value = true;
    error.value = undefined;

    return client()
      .get<MovieSessionDetails>(API_ROUTES.movieSessions.details(String(sessionId)))
      .then(result => {
        currentSession.value = result.data;
        sessionsCache.value[sessionId] = result.data;
        return result.data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить информацию о сеансе";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const bookSelectedSeats = () => {
    if (!currentSession.value || !canBook.value) {
      error.value = "Невозможно забронировать места";
      return;
    }

    isLoading.value = true;
    error.value = undefined;

    client()
      .post(API_ROUTES.movieSessions.book(String(currentSession.value?.id)), {
        seats: selectedSeats.value,
      })
      .then(() => {
        selectedSeats.value = [];
        router.push({ name: "myTickets" });
      })
      .catch(() => {
        error.value = "Не удалось забронировать места";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const clearSelection = () => {
    selectedSeats.value = [];
    currentSession.value = null;
    error.value = undefined;
  };

  const clearCache = () => {
    sessionsCache.value = {};
  };

  return {
    // State
    currentSession,
    selectedSeats,
    isLoading,
    error,
    // Computed
    canBook,
    availableSeats,
    // Actions
    getSessionById,
    fetchSessionDetails,
    toggleSeat,
    bookSelectedSeats,
    clearSelection,
    clearCache,
  };
});
