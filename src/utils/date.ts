export const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-AU", { timeZone: "Australia/Sydney" });
};
