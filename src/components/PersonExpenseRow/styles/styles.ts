import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
  },
  details: {
    flex: 1,
  },
  share: {
    alignItems: "flex-end",
  },
  pressed: {
    opacity: 0.75,
  },
});
