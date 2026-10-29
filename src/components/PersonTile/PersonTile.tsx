import { Pressable, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { Person } from "@/types/models";
import { styles } from "./styles/styles";

interface PersonRowProps {
  person: Person;
  onPress?: () => void;
}

export default function PersonTile({ person, onPress }: PersonRowProps) {
  const avatarColor = person.avatarColor ?? colors.avatarPink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${person.name}'s profile`}
      onPress={onPress}
      style={({ pressed }) => [styles.personRow, pressed && styles.pressed]}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Typography variant="h6" color={getPersonAvatarTextColor(avatarColor)}>
          {person.name.trim().charAt(0).toUpperCase()}
        </Typography>
      </View>
      <View style={styles.personDetails}>
        <Typography variant="h6">{person.name}</Typography>
        {person.notes && (
          <Typography
            variant="bodySmall"
            color={colors.textSecondary}
            numberOfLines={1}
          >
            {person.notes?.trim()}
          </Typography>
        )}
      </View>
      <MaterialDesignIcons
        name="chevron-right"
        size={24}
        color={colors.textTertiary}
      />
    </Pressable>
  );
}
