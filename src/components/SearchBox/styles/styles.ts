import { colors } from "@/foundation/colors";
import { StyleSheet } from "react-native";
import { spacing } from "@/foundation/spacing";

export const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    gap: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    paddingHorizontal: spacing.s,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    color: colors.textPrimary,
    fontFamily: "Fredoka-Regular",
    fontSize: 16,
  },
});
