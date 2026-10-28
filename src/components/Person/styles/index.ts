import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  person: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
  personName: {
    width: 64,
    textAlign: "center",
  },
});
