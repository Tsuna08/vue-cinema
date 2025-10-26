import type { Session, SortField } from "../types";

export const sortFilmsByDays = (sortField: SortField, sortedData: Session[]) => {
  const sortedCinemaSessions = [...sortedData].sort((a, b) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();

    return dateA - dateB;
  });

  const allDates = sortedCinemaSessions.map(
    data => new Date(data.startTime).toISOString().split("T")[0],
  );
  const uniqueDates = [...new Set(allDates)];

  const sortedDates = uniqueDates.sort();

  return sortedDates.map(date => {
    const sessions = sortedCinemaSessions.filter(
      session => new Date(session.startTime).toISOString().split("T")[0] === date,
    );
    const allMovieForSession = sessions.map(item => item[sortField]);
    const uniqueMovieId = [...new Set(allMovieForSession)].sort();
    const sortBySortField = uniqueMovieId.map(sortFieldId => ({
      [sortField]: sortFieldId,
      times: sessions.filter(item => item[sortField] === sortFieldId),
    }));

    return { date, sessions: sortBySortField };
  });
};
