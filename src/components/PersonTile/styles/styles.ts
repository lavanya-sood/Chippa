import { colors } from "@/foundation/colors";
import { StyleSheet } from "react-native";
import { spacing } from "@/foundation/spacing";

const PERSON_ROW_HEIGHT = 80;
const AVATAR_SIZE = 48;

export const styles = StyleSheet.create({
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AVATAR_SIZE / 2,
  },
  personDetails: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
