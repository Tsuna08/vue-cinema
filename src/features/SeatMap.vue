<script setup lang="ts">
  import { computed } from "vue";

  import type { SeatWithStatus } from "@/entities/MovieSession";

  const { rows, seats, disabled } = defineProps<{
    rows: number;
    seats: SeatWithStatus[];
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "select", seat: SeatWithStatus): void;
  }>();

  const seatsByRow = computed(() => {
    const rowsSorted: SeatWithStatus[][] = [];
    for (let i = 1; i <= rows; i++) {
      rowsSorted.push(
        seats.filter(seat => seat.rowNumber === i).sort((a, b) => a.seatNumber - b.seatNumber),
      );
    }
    return rowsSorted;
  });

  const handleSeatClick = (seat: SeatWithStatus) => {
    if (!disabled && !seat.isBooked) {
      emit("select", seat);
    }
  };
</script>

<template>
  <div class="seat-map">
    <div class="rows">
      <div
        v-for="(row, rowIndex) in seatsByRow"
        :key="rowIndex"
        class="row"
      >
        <div class="row-number">
          Ряд {{ rowIndex + 1 }}
        </div>
        <div class="seats">
          <button
            v-for="seat in row"
            :key="seat.rowNumber + '-' + seat.seatNumber"
            class="seat"
            :class="{
              'seat-booked': seat.isBooked,
              'seat-selected': seat.isSelected,
              'seat-disabled': disabled,
            }"
            :disabled="seat.isBooked || disabled"
            @click="handleSeatClick(seat)"
          />
        </div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item">
        <div class="seat-example" />
        <span>Свободно</span>
      </div>
      <div class="legend-item">
        <div class="seat-example seat-booked" />
        <span>Занято</span>
      </div>
      <div class="legend-item">
        <div class="seat-example seat-selected" />
        <span>Выбрано</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .seat-map {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 20px;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .row-number {
    text-align: right;
    font-weight: bold;
    width: 5rem;
  }

  .seats {
    display: flex;
    gap: 0.5rem;
  }

  .seat {
    height: 1.375rem;
    border: 1px solid var(--color-second);
    background-color: var(--bg-main);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.475rem;
    transition: all 0.2s ease;
  }

  .seat:hover:not(:disabled):not(.seat-booked) {
    background-color: var(--bg-active);
    color: var(--color-main);
  }

  .seat-booked {
    background-color: var(--color-error);
    cursor: not-allowed;
  }

  .seat-selected {
    background-color: var(--color-select-seat);
  }

  .seat-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .legend {
    display: flex;
    gap: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .seat-example {
    width: 1.375rem;
    height: 1.375rem;
    border: 1px solid var(--color-second);
    border-radius: 6px;
    font-size: 0.475rem;
    cursor: default;
  }
</style>
