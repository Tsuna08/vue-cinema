export interface Seat {
  rowNumber: number;
  seatNumber: number;
}

export interface MovieSession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
}

export interface MovieSessionDetails extends MovieSession {
  seats: {
    rows: number;
    seatsPerRow: number;
  };
  bookedSeats: Seat[];
}

export interface SeatWithStatus extends Seat {
  isBooked: boolean;
  isSelected: boolean;
}
