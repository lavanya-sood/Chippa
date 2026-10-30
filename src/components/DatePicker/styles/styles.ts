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
  payerOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xxs,
    backgroundColor: colors.surface,
  },
  payerOptionSelected: {
    borderColor: colors.primary,
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
});
