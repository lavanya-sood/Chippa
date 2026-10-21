import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: spacing.base,
  },

  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: "transparent",
  },

  small: {
    minHeight: 20,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  medium: {
    minHeight: 40,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  large: {
    minHeight: 50,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.s,
  },

  label: {
    fontWeight: "600",
    fontFamily: "Fredoka",
    fontSize: 28,
  },
  primaryLabel: {
    color: colors.textOnPrimary,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  outlineLabel: {
    color: colors.textPrimary,
  },
  textLabel: {
    color: colors.textPrimary,
  },

  smallLabel: {
    fontSize: 12,
  },
  mediumLabel: {
    fontSize: 16,
  },
  largeLabel: {
    fontSize: 20,
  },

  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
