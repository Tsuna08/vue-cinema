export const formatDate = (dateString?: string): string => {
  const date = new Date(dateString || "");
  if (isNaN(date.getTime())) return "Неверная дата";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "numeric",
  });
};

export const getTime = (dateString?: Date): string => {
  const date = new Date(dateString || "");
  if (isNaN(date.getTime())) return "Неверное время";

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Неверная дата";

  return date
    .toLocaleString("ru-RU", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " ");
};
