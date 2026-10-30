import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { generateInitials } from "@/utils/people";
import { useMemo } from "react";
import {
  AVATAR_SIZE_SMALL,
  AVATAR_SIZE_MEDIUM,
  AVATAR_SIZE_LARGE,
} from "@/constants/style";

type ICON_SIZES = "small" | "medium" | "large";
interface AvatarProps {
  avatarColor?: string;
  name?: string;
  icon?: (color: string, size: number) => React.ReactNode;
  size?: ICON_SIZES;
}

export default function Avatar({
  avatarColor,
  name,
  size = "medium",
  icon,
}: AvatarProps) {
  const foregroundColor = getPersonAvatarTextColor(avatarColor);
  const iconSize = useMemo(() => {
    if (size === "small") {
      return AVATAR_SIZE_SMALL * 0.6;
    } else if (size === "large") {
      return AVATAR_SIZE_LARGE * 0.6;
    } else {
      return AVATAR_SIZE_MEDIUM * 0.5;
    }
  }, [size]);

  const textVariant = useMemo(() => {
    if (size === "small") {
      return "h7";
    } else if (size === "large") {
      return "h1";
    } else {
      return "h3";
    }
  }, [size]);

  return (
    <View
      style={[
        styles.personIcon,
        {
          backgroundColor: avatarColor ?? colors.avatarPink,
        },
        styles[size],
      ]}
    >
      {icon && <View>{icon(foregroundColor, iconSize)}</View>}
      {name && (
        <Typography variant={textVariant} color={foregroundColor}>
          {generateInitials(name)}
        </Typography>
      )}
    </View>
  );
}
