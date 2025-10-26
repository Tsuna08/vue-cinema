export interface Session {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: Date;
}

export type SortField = "movieId" | "cinemaId";

export type SessionMode = "movie" | "cinema";
