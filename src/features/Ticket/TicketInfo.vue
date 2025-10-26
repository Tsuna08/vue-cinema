<script setup lang="ts">
  import { type BookingWithFullDetails } from "@/entities/Booking";
  import { formatDateTime } from "@/shared/utils/formatData";

  const { booking } = defineProps<{ booking?: BookingWithFullDetails }>();
  const date = booking?.startTime ? booking?.startTime?.toString() : "";
</script>

<template>
  <div class="info-seats">
    <div class="info">
      <strong>{{ booking?.movieTitle }}</strong>
      <p>{{ booking?.cinemaName }}</p>
      <p>{{ formatDateTime(date) }}</p>
    </div>
    <div class="seats">
      <p
        v-for="(seat, index) in booking?.seats"
        :key="index"
      >
        Ряд {{ seat.rowNumber }} Место {{ seat.seatNumber }}
      </p>
    </div>
  </div>
</template>

<style scoped>
  .info-seats {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .info {
    width: 20rem;
  }
  .info,
  .seats {
    display: flex;
    flex-direction: column;
  }

  p {
    margin: 0;
  }
</style>
