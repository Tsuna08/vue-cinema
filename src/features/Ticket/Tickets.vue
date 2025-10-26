<script setup lang="ts">
  import { type BookingWithFullDetails } from "@/entities/Booking";
  import { Timer } from "@/shared";

  import TicketInfo from "./TicketInfo.vue";

  interface Props {
    bookings: BookingWithFullDetails[];
    label: string;
    className?: string;
    showTimer?: boolean;
    paymentTimeSeconds?: number;
    isLoading?: boolean;
  }

  const {
    bookings,
    label,
    className = "",
    showTimer = false,
    paymentTimeSeconds = 0,
    isLoading = false,
  } = defineProps<Props>();

  const emit = defineEmits<{
    payment: [bookingId: string];
    expire: [];
  }>();
</script>

<template>
  <section
    class="section"
    :class="className"
  >
    <h2 class="section-title">
      {{ label }}
    </h2>
    <hr class="divider">

    <div
      v-if="bookings.length === 0"
      class="empty-state"
    >
      <p>Нет бронирований</p>
    </div>

    <div
      v-else
      class="grid"
    >
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="card"
      >
        <TicketInfo :booking="booking" />

        <div
          v-if="showTimer"
          class="timer-section"
        >
          <button
            class="payment-button"
            :disabled="isLoading"
            @click="emit('payment', booking.id)"
          >
            {{ isLoading ? "Оплата..." : "Оплатить" }}
          </button>

          <Timer
            v-if="paymentTimeSeconds > 0"
            :start-time="booking.bookedAt"
            :payment-time-seconds="paymentTimeSeconds"
            @expire="emit('expire')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .section {
    margin-bottom: 2rem;
    text-align: left;
  }

  .divider {
    width: 100%;
    margin-bottom: 1rem;
  }

  .card {
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .timer-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
