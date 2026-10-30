import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { StyleSheet } from "react-native";
import {
  AVATAR_SIZE_SMALL,
  AVATAR_SIZE_MEDIUM,
  AVATAR_SIZE_LARGE,
} from "@/constants/style";

export const styles = StyleSheet.create({
  personIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: AVATAR_SIZE_SMALL,
    height: AVATAR_SIZE_SMALL,
    borderRadius: AVATAR_SIZE_SMALL / 2,
  },
  medium: {
    width: AVATAR_SIZE_MEDIUM,
    height: AVATAR_SIZE_MEDIUM,
    borderRadius: AVATAR_SIZE_MEDIUM / 2,
  },
  large: {
    width: AVATAR_SIZE_LARGE,
    height: AVATAR_SIZE_LARGE,
    borderRadius: AVATAR_SIZE_LARGE / 2,
  },
});
