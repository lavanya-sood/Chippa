import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  form: {
    marginTop: spacing.base,
    gap: spacing.s,
  },
  footer: {
    gap: spacing.s,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.s,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  selectedPerson: {
    color: colors.error,
  },
  payerSection: {
    gap: spacing.xxs,
  },
  payerDropdown: {
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
  payerDropdownText: {
    flex: 1,
  },
  payerAvatar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.avatarPink,
  },
  payerOptions: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  payerOption: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingHorizontal: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  payerOptionSelected: {
    backgroundColor: colors.primaryPale,
  },
  deleteButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: spacing.s,
  },
  pickerOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: spacing.s,
  },
  pickerCard: {
    width: "100%",
    maxWidth: 400,
    padding: spacing.l,
    gap: spacing.l,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  closeLabel: {
    color: colors.textSecondary,
    fontSize: 26,
    lineHeight: 30,
  },
  selectedIcon: {
    width: 64,
    height: 64,
    borderRadius: 30,
    borderWidth: 4,
    // borderColor: colors.background,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  personIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.avatarPink,
    borderRadius: 100,
  },
  //   exteriorPersonIcon: {
  //     borderColor: colors.primary,
  //   },
  peopleList: {
    marginTop: spacing.s,
  },
  peopleListContent: {
    gap: spacing.xxs,
  },
});
