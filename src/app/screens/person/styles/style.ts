import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";
import { PROFILE_AVATAR_SIZE } from "@/constants/style";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    gap: spacing.l,
    paddingBottom: spacing.base,
  },
  hero: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  missingPerson: {
    justifyContent: "center",
    paddingHorizontal: spacing.base,
    gap: spacing.s,
  },
  avatar: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: PROFILE_AVATAR_SIZE / 2,
  },
  name: {
    marginTop: spacing.xs,
  },
  splitsSection: {
    gap: spacing.xs,
  },
  splitsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  splitsCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  splitSeparator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.s,
    backgroundColor: colors.divider,
  },
  createFooter: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.s,
    backgroundColor: colors.background,
  },
  pressed: {
    opacity: 0.75,
  },
  editButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxxs,
    paddingHorizontal: spacing.xxs,
  },
});
