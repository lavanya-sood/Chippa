import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputExterior: {
    flexDirection: "row",
    backgroundColor: "white",
    minHeight: 48,
    marginTop: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },

  textInput: {
    fontWeight: "normal",
    fontFamily: "Fredoka-Regular",
    fontSize: 16,
  },
});
