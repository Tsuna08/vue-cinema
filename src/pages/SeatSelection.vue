<script setup lang="ts">
  import { computed, onMounted, onUnmounted,watch } from "vue";
  import { useRoute, useRouter } from "vue-router";

  import { useAuthStore } from "@/app/auth.store";
  import type { SeatWithStatus } from "@/entities/MovieSession";
  import { useMovieSessionStore } from "@/entities/MovieSession";
  import SeatMap from "@/features/SeatMap.vue";

  const route = useRoute();
  const router = useRouter();
  const movieSessionStore = useMovieSessionStore();
  const authStore = useAuthStore();

  const sessionId = computed(() => {
    const id = Number(route.params.id);
    return isNaN(id) ? null : id;
  });

  const loadSession = () => {
    if (!sessionId.value || movieSessionStore.isLoading) return;
    movieSessionStore.fetchSessionDetails(sessionId.value);
  };

  onMounted(() => {
    if (!sessionId.value) {
      router.push({ name: "movies" });
      return;
    }
    loadSession();
  });

  watch(sessionId, newId => {
    if (newId) loadSession();
  });

  onUnmounted(() => {
    movieSessionStore.clearSelection?.();
  });

  const handleSeatSelect = (seat: SeatWithStatus) => {
    if (seat.isBooked || movieSessionStore.isLoading) return;
    movieSessionStore.toggleSeat(seat);
  };

  const handleBooking = () => {
    if (!authStore.isAuthenticated) {
      router.push({ name: "login" });
      return;
    }

    if (!movieSessionStore.canBook || movieSessionStore.isLoading) return;
    movieSessionStore.bookSelectedSeats();
  };

  const formatSessionDate = computed(() => {
    const session = movieSessionStore.currentSession;
    if (!session) return "";

    return new Date(session.startTime).toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const selectedSeatsText = computed(() => {
    return movieSessionStore.selectedSeats
      .map(seat => `Ряд ${seat.rowNumber}, Место ${seat.seatNumber}`)
      .join("; ");
  });
</script>

<template>
  <h2>Выбор мест</h2>

  <p
    v-if="movieSessionStore.isLoading"
    role="status"
    aria-live="polite"
  >
    Загрузка...
  </p>
  <p
    v-else-if="movieSessionStore.error"
    role="alert"
  >
    {{ movieSessionStore.error }}
  </p>

  <template v-else-if="movieSessionStore.currentSession">
    <section>
      <h3>Информация о сеансе</h3>
      <p>Дата и время: {{ formatSessionDate }}</p>
    </section>

    <SeatMap
      :rows="movieSessionStore.currentSession.seats.rows"
      :seats-per-row="movieSessionStore.currentSession.seats.seatsPerRow"
      :seats="movieSessionStore.availableSeats"
      :disabled="movieSessionStore.isLoading"
      @select="handleSeatSelect"
    />

    <p v-if="movieSessionStore.selectedSeats.length > 0">
      Выбранные места: {{ selectedSeatsText }}
    </p>
    <button
      :disabled="movieSessionStore.isLoading"
      aria-describedby="booking-hint"
      @click="handleBooking()"
    >
      {{ movieSessionStore.isLoading ? "Бронирование..." : "Забронировать" }}
    </button>
  </template>

  <p v-else>
    Сеанс не найден
  </p>
</template>
