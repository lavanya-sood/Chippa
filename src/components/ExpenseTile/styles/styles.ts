import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  expenseTile: {
    padding: spacing.s,
    flexDirection: "row",
    backgroundColor: "white",
    minHeight: 48,
    marginTop: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    gap: spacing.s,
  },
  icon: {
    width: 60,
    height: 60,
    backgroundColor: colors.avatarLavender,
    borderRadius: 30,
  },
  details: {
    flex: 1,
  },
  headingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    color: colors.textSecondary,
  },
  peopleIconList: {
    marginTop: spacing.xxs,
    flexDirection: "row",
    gap: spacing.xxxs,
  },
  personIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
