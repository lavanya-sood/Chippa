import { Pressable, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { Person } from "@/types/models";
import { styles } from "./styles/styles";
import Avatar from "@/components/Avatar/Avatar";

interface PersonRowProps {
  person: Person;
  onPress?: () => void;
}

export default function PersonTile({ person, onPress }: PersonRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${person.name}'s profile`}
      onPress={onPress}
      style={({ pressed }) => [styles.personRow, pressed && styles.pressed]}
    >
      <Avatar name={person.name} avatarColor={person.avatarColor} />
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
