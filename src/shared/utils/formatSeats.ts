import type { Seat } from "@/entities/MovieSession";

export const formatSeats = (seats?: Seat[]): string => {
  if (!seats) return "";
  return seats.map(seat => `Ряд ${seat.rowNumber} Место ${seat.seatNumber}`).join("; ");
};
