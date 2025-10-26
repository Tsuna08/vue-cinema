export interface Cinema {
  id: number;
  name: string;
  address: string;
}

export interface CinemaSchedule extends Cinema {
  title: string;
}
