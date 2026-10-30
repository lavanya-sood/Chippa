import { colors } from "@/foundation/colors";
import { StyleSheet } from "react-native";
import { spacing } from "@/foundation/spacing";

export const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    paddingVertical: spacing.xs,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomColor: colors.primary,
  },
  selectedTabLabel: {
    fontFamily: "Fredoka-Medium",
  },
  tabContent: {
    flex: 1,
  },
});
