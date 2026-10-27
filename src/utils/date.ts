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

// export const formatDate = (date: string | Date): string => {
//   const d = new Date(date);

//   if (isNaN(d.getTime())) return "";

//   const day = d.getDate();
//   const month = d.toLocaleString("en-AU", { month: "short" });
//   const year = d.getFullYear();

//   const hours = d.getHours();
//   const minutes = String(d.getMinutes()).padStart(2, "0");

//   const hour12 = hours % 12 || 12;
//   const period = hours >= 12 ? "pm" : "am";

//   return `${day} ${month} ${year} ${hour12}:${minutes}${period}`;
// };
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  const options = { timeZone: "Australia/Sydney" };
  const formattedDate = d.toLocaleDateString("en-AU", options);
  const formattedTime = d.toLocaleTimeString("en-AU", {
    ...options,
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate}, ${formattedTime}`;
};
