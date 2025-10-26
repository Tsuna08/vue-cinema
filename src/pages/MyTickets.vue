<script setup lang="ts">
  import { computed, onMounted } from "vue";

  import { useBookingStore } from "@/entities/Booking";
  import { Tickets } from "@/features/Ticket";

  const bookingStore = useBookingStore();

  const paymentTimeSeconds = computed(() => bookingStore.paymentTimeSeconds);
  const unpaidBookings = computed(() => bookingStore.unpaidBookingsWithFullDetails);
  const futureBookings = computed(() => bookingStore.futureBookingsSortedWithFullDetails);
  const pastBookings = computed(() => bookingStore.pastBookingsSortedWithFullDetails);
  const hasAnyBookings = computed(() => bookingStore.bookings.length > 0);

  onMounted(() => {
    bookingStore.getSettings();
  });

  const handlePayment = (bookingId: string) => {
    if (bookingStore.isLoading) return;
    bookingStore.payBooking(bookingId);
  };

  const handleExpiredBooking = () => {
    bookingStore.removeExpiredBookings(paymentTimeSeconds.value);
  };
</script>

<template>
  <div class="my-tickets">
    <h2>Мои билеты</h2>

    <div
      v-if="bookingStore.isLoading"
      class="loading"
    >
      Загрузка билетов...
    </div>

    <div
      v-else-if="bookingStore.error"
      class="error"
    >
      {{ bookingStore.error }}
      <button
        class="retry-button"
        @click="bookingStore.getSettings()"
      >
        Попробовать снова
      </button>
    </div>

    <template v-else-if="hasAnyBookings">
      <Tickets
        v-if="unpaidBookings.length > 0"
        label="Неоплаченные билеты"
        :bookings="unpaidBookings"
        class-name="unpaid"
        :show-timer="true"
        :payment-time-seconds="paymentTimeSeconds"
        :is-loading="bookingStore.isLoading"
        @payment="handlePayment"
        @expire="handleExpiredBooking"
      />

      <Tickets
        v-if="futureBookings.length > 0"
        label="Предстоящие сеансы"
        :bookings="futureBookings"
        class-name="future"
      />

      <Tickets
        v-if="pastBookings.length > 0"
        label="История посещений"
        :bookings="pastBookings"
        class-name="past"
      />
    </template>

    <div
      v-else
      class="no-tickets"
    >
      <p>У вас пока нет билетов</p>
      <router-link
        to="/movies"
        class="find-movies-link"
      >
        Найти фильмы
      </router-link>
    </div>
  </div>
</template>

<style scoped>
  .my-tickets {
    padding: 20px;
  }

  .loading,
  .error,
  .no-tickets {
    text-align: center;
    padding: 20px;
    margin: 20px 0;
  }

  .error {
    color: var(--color-error);
  }
</style>
