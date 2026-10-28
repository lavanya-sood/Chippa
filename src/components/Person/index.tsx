import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { PersonAvatarColor } from "@/foundation/colors";
import { View } from "react-native";
import { styles } from "./styles";

interface PersonProps {
  name: string;
  avatarColor?: PersonAvatarColor;
  selected: boolean;
}

export default function Person({
  name,
  avatarColor = colors.avatarPink,
  selected,
}: PersonProps) {
  return (
    <View style={styles.person}>
      <View
        style={[
          styles.selectedIcon,
          { borderColor: selected ? colors.primary : colors.background },
        ]}
      >
        <View style={[styles.personIcon, { backgroundColor: avatarColor }]} />
      </View>
      <Typography
        variant={selected ? "h5" : "body"}
        style={[styles.personName]}
      >
        {name}
      </Typography>
    </View>
  );
}
