import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";
import { AVATAR_SIZE } from "@/constants/style";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s,
  },
  icon: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AVATAR_SIZE / 2,
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
