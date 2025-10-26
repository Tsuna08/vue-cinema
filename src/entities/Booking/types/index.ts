import type { Seat } from "@/entities/MovieSession";

export interface Booking {
  id: string;
  userId: number;
  movieSessionId: number;
  sessionId: number;
  bookedAt: string;
  seats: Seat[];
  isPaid: boolean;
}

export interface BookingWithFullDetails extends Booking {
  startTime?: Date;
  movieTitle?: string;
  cinemaName?: string;
}
