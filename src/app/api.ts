import axios, { type AxiosInstance, type AxiosResponse } from "axios";

import { useAuthStore } from "./auth.store";

export const API_ROUTES = {
  login: "login",
  register: "register",
  cinemas: {
    list: "cinemas",
    sessions: (cinemaId: string) => `cinemas/${cinemaId}/sessions`,
  },
  movies: {
    list: "movies",
    sessions: (movieId: string) => `movies/${movieId}/sessions`,
  },
  movieSessions: {
    details: (sessionId: string) => `movieSessions/${sessionId}`,
    book: (sessionId: string) => `movieSessions/${sessionId}/bookings`,
  },
  bookings: {
    my: "me/bookings",
    pay: (bookingId: string) => `bookings/${bookingId}/payments`,
  },
  settings: "settings",
};

export function createBaseClient(): AxiosInstance {
  return axios.create({
    baseURL: "/api/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const client = (): AxiosInstance => {
  const authStore = useAuthStore();
  const client = createBaseClient();

  client.interceptors.request.use(config => {
    const token = authStore.getToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    error => {
      const { status } = error.response || {};

      if (status === 401) {
        authStore.logout();
      }
      return Promise.reject(error);
    },
  );

  return client;
};
