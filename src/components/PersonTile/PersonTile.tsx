import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import Button from "@/components/Button/Button";

import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import type { PersonAvatarColor } from "@/foundation/colors";
import { usePeopleStore } from "@/state/stores";
import type { Person } from "@/types/models";
import { styles } from "./styles/styles";

interface PersonRowProps {
  person: Person;
  onPress?: () => void;
}

const avatarTextColors: Record<PersonAvatarColor, string> = {
  [colors.avatarPink]: colors.pinkDark,
  [colors.avatarPeach]: colors.peachDark,
  [colors.avatarYellow]: colors.yellowDark,
  [colors.avatarSage]: colors.sageDark,
  [colors.avatarLavender]: colors.lavenderDark,
  [colors.avatarBlue]: colors.infoDark,
};

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
        <Typography variant="h6" color={avatarTextColors[avatarColor]}>
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
