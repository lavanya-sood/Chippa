export const colors = {
  // Basics
  white: "#ffffff",
  black: "#000000",

  // Brand
  primary: "#476F62",
  primaryDark: "#35584E",
  primaryLight: "#DCE9E3",
  primaryPale: "#EEF5F1",

  // Backgrounds
  background: "#FFF9F3",
  surface: "#FFFCF8",
  surfaceWarm: "#FFF3EA",
  surfacePink: "#FDEAE7",

  // Borders
  border: "#E9E1D8",
  divider: "#EEE7DF",

  // Text
  textBase: "#000000",
  textPrimary: "#263A35",
  textSecondary: "#66736E",
  textTertiary: "#9AA29E",
  textOnPrimary: "#FFFFFF",
  textDisabled: "#B8BCB9",

  // Accents
  peach: "#F6C8B8",
  peachLight: "#FBE4DB",

  pink: "#F5BFC1",
  pinkLight: "#FCE5E3",

  yellow: "#F7D477",
  yellowLight: "#FFF0C7",

  sage: "#C9D8C5",
  sageLight: "#E7EFE4",

  lavender: "#D9D2E6",
  lavenderLight: "#EEEAF3",

  // Semantic
  success: "#5F8A70",
  successLight: "#E4F0E7",

  warning: "#D99B4A",
  warningLight: "#FFF0D6",

  error: "#C96B67",
  errorLight: "#FBE5E3",

  info: "#7894A8",

  // People
  avatarPink: "#F5BFC1",
  avatarPeach: "#F6C8B8",
  avatarYellow: "#F7D477",
  avatarSage: "#C9D8C5",
  avatarLavender: "#D9D2E6",
  avatarBlue: "#BFD8E5",
};

export const personAvatarColors = [
  { name: "Pink", color: colors.avatarPink },
  { name: "Peach", color: colors.avatarPeach },
  { name: "Yellow", color: colors.avatarYellow },
  { name: "Sage", color: colors.avatarSage },
  { name: "Lavender", color: colors.avatarLavender },
  { name: "Blue", color: colors.avatarBlue },
] as const;

export type PersonAvatarColor =
  (typeof personAvatarColors)[number]["color"];
