export const generateShortId = (index: number) => {
  // Generates something like: "0-k4z2"
  return `${index}-${Math.random().toString(36).substring(2, 6)}`;
};
