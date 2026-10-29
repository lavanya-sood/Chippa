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
import { usePeopleStore } from "@/state/stores";
import type { Person } from "@/types/models";
import { styles } from "./styles/styles";
interface SearchBoxProps {
  searchValue: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ searchValue, onChange }: SearchBoxProps) {
  return (
    <View style={styles.searchBox}>
      <MaterialDesignIcons
        name="magnify"
        size={22}
        color={colors.textSecondary}
      />
      <TextInput
        accessibilityLabel="Search people"
        value={searchValue}
        onChangeText={onChange}
        placeholder="Search people"
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        style={styles.searchInput}
      />
    </View>
  );
}
