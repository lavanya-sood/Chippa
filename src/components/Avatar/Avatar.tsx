import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { generateInitials } from "@/utils/people";
import { useMemo } from "react";

interface AvatarProps {
  avatarColor?: string;
  name?: string;
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
}

export default function Avatar({
  avatarColor,
  name,
  size = "medium",
  icon,
}: AvatarProps) {
  const textVariant = useMemo(() => {
    if (size === "small") {
      return "h7";
    } else if (size === "large") {
      return "h1";
    } else {
      return "h4";
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
      {icon && <View>{icon}</View>}
      {name && (
        <Typography
          variant={textVariant}
          color={getPersonAvatarTextColor(avatarColor)}
        >
          {generateInitials(name)}
        </Typography>
      )}
    </View>
  );
}
