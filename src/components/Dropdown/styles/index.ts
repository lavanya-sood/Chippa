import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xxs,
  },
  dropdown: {
    minHeight: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.base,
    backgroundColor: colors.surface,
  },
  selectedText: {
    flex: 1,
  },
  options: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  option: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingHorizontal: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primaryPale,
  },
});
