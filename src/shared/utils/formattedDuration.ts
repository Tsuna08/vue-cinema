export const formattedDuration = (duration: number) => {
  if (!duration) return "";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours}:${minutes}`;
};
