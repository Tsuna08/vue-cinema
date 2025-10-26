import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { API_ROUTES, client } from "@/app/api";
import { useCinemaStore } from "@/entities/Cinema";
import { useMovieStore } from "@/entities/Movie";
import { useMovieSessionStore } from "@/entities/MovieSession";

import type { Booking, BookingWithFullDetails } from "../types";

const toDate = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  return new Date();
};

export const useBookingStore = defineStore("booking", () => {
  const bookings = ref<Booking[]>([]);
  const isLoading = ref(false);
  const error = ref<string | undefined>();
  const paymentTimeSeconds = ref(0);

  const movieSessionStore = useMovieSessionStore();
  const movieStore = useMovieStore();
  const cinemaStore = useCinemaStore();

  const bookingsWithFullDetails = computed<BookingWithFullDetails[]>(() => {
    return bookings.value.map(booking => {
      const sessionData = movieSessionStore.getSessionById(booking.movieSessionId);

      const movie = sessionData?.movieId
        ? movieStore.movieSortedById[sessionData.movieId]
        : undefined;
      const cinema = sessionData?.cinemaId
        ? cinemaStore.cinemasSortedById[sessionData.cinemaId]
        : undefined;

      return {
        ...booking,
        startTime: sessionData?.startTime ? toDate(sessionData.startTime) : undefined,
        movieTitle: movie?.title,
        cinemaName: cinema?.name,
      };
    });
  });

  const unpaidBookingsWithFullDetails = computed(() => {
    return bookingsWithFullDetails.value.filter(booking => !booking.isPaid);
  });

  const futureBookingsWithFullDetails = computed(() => {
    const now = new Date();
    return bookingsWithFullDetails.value.filter(booking => {
      if (!booking.isPaid) return false;
      if (!booking.startTime) return false;

      return booking.startTime > now;
    });
  });

  const pastBookingsWithFullDetails = computed(() => {
    const now = new Date();
    return bookingsWithFullDetails.value.filter(booking => {
      if (!booking.isPaid) return false;
      if (!booking.startTime) return false;

      return booking.startTime <= now;
    });
  });

  const sortedByDays = (bookings: BookingWithFullDetails[]) => {
    return bookings.sort((a, b) => {
      const dateA = a.startTime ? a.startTime.getTime() : 0;
      const dateB = b.startTime ? b.startTime.getTime() : 0;

      return dateA - dateB;
    });
  };

  const futureBookingsSortedWithFullDetails = computed(() => {
    return sortedByDays([...futureBookingsWithFullDetails.value]);
  });

  const pastBookingsSortedWithFullDetails = computed(() => {
    return sortedByDays([...pastBookingsWithFullDetails.value]);
  });

  const bookingsGroupedByDay = computed(() => {
    const grouped: { [key: string]: BookingWithFullDetails[] } = {};

    futureBookingsSortedWithFullDetails.value.forEach(booking => {
      if (!booking.startTime) return;
      const dateKey = booking.startTime.toDateString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(booking);
    });

    return grouped;
  });

  const getBookingWithFullDetails = (bookingId: string) => {
    return bookingsWithFullDetails.value.find(booking => booking.id === bookingId);
  };

  const fetchBookingsWithFullDetails = () => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get(API_ROUTES.bookings.my)
      .then((result: AxiosResponse<Booking[]>) => {
        bookings.value = result.data;

        return Promise.all([movieStore.fetchMovies(), cinemaStore.fetchCinemas()]);
      })
      .then(() => {
        const sessionPromises = bookings.value
          .filter(booking => booking.movieSessionId)
          .map(booking => movieSessionStore.fetchSessionDetails(booking.movieSessionId!));

        return Promise.all(sessionPromises);
      })
      .then(() => {
        error.value = undefined;
      })
      .catch(() => {
        error.value = "Не удалось загрузить билеты";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const fetchBookings = () => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get(API_ROUTES.bookings.my)
      .then((result: AxiosResponse<Booking[]>) => {
        bookings.value = result.data;
        error.value = undefined;
      })
      .catch(() => {
        error.value = "Не удалось загрузить билеты";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const payBooking = (bookingId: string) => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .post(API_ROUTES.bookings.pay(bookingId))
      .then(() => {
        return fetchBookingsWithFullDetails();
      })
      .catch(() => {
        error.value = "Не удалось оплатить билет";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const getSettings = () => {
    isLoading.value = true;
    error.value = undefined;

    client()
      .get(API_ROUTES.settings)
      .then(settings => {
        paymentTimeSeconds.value = settings.data.bookingPaymentTimeSeconds;
        return fetchBookingsWithFullDetails();
      })
      .catch(() => {
        error.value = "Не удалось загрузить билеты. Попробуйте обновить страницу.";
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const removeExpiredBookings = (paymentTimeSeconds: number) => {
    const now = new Date();
    bookings.value = bookings.value.filter(booking => {
      if (booking.isPaid) return true;

      const bookedAt = toDate(booking.bookedAt);
      const expirationTime = new Date(bookedAt.getTime() + paymentTimeSeconds * 1000);
      return now < expirationTime;
    });
  };

  return {
    // State
    bookings,
    isLoading,
    error,
    paymentTimeSeconds,
    // Computed
    bookingsWithFullDetails,
    unpaidBookingsWithFullDetails,
    futureBookingsWithFullDetails,
    pastBookingsWithFullDetails,
    futureBookingsSortedWithFullDetails,
    pastBookingsSortedWithFullDetails,
    bookingsGroupedByDay,
    // Actions
    fetchBookings,
    fetchBookingsWithFullDetails,
    payBooking,
    removeExpiredBookings,
    getSettings,
    getBookingWithFullDetails,
  };
});
