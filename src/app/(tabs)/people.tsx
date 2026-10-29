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

import Button from "@/components/Button";

import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state";
import type { Person } from "@/types";

function PersonRow({
  person,
  onPress,
}: {
  person: Person;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${person.name}'s profile`}
      onPress={onPress}
      style={({ pressed }) => [styles.personRow, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: person.avatarColor ?? colors.avatarPink },
        ]}
      >
        <Typography variant="h5" color={colors.textPrimary}>
          {person.name.trim().charAt(0).toUpperCase()}
        </Typography>
      </View>
      <View style={styles.personDetails}>
        <Typography variant="h6">{person.name}</Typography>
        <Typography
          variant="bodySmall"
          color={colors.textSecondary}
          numberOfLines={1}
        >
          {person.notes?.trim() || "No notes"}
        </Typography>
      </View>
      <MaterialDesignIcons
        name="chevron-right"
        size={24}
        color={colors.textTertiary}
      />
    </Pressable>
  );
}

export default function PeopleScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const router = useRouter();
  const people = usePeopleStore((state) => state.people);
  const [search, setSearch] = useState("");

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });

  const filteredPeople = people.filter((person) =>
    `${person.name} ${person.notes ?? ""}`
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <FlatList
      style={styles.screen}
      data={filteredPeople}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PersonRow
          person={item}
          onPress={() =>
            router.push({
              pathname: "/screens/person/[id]",
              params: { id: item.id },
            })
          }
        />
      )}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <View style={styles.titleRow}>
            <Typography variant="h2">People</Typography>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add person"
              onPress={() => router.push("/screens/addPerson")}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialDesignIcons
                name="plus"
                size={28}
                color={colors.peachDark}
              />
            </Pressable>
          </View>
          <View style={styles.searchBox}>
            <MaterialDesignIcons
              name="magnify"
              size={22}
              color={colors.textSecondary}
            />
            <TextInput
              accessibilityLabel="Search people"
              value={search}
              onChangeText={setSearch}
              placeholder="Search people"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="search"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.sectionHeading}>
            <Typography variant="h6">My people ({people.length})</Typography>
            <Button
              title="Add person"
              variant="text"
              size="small"
              onPress={() => router.push("/screens/addPerson")}
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.empty}
        >
          {search.trim()
            ? "No people match your search."
            : "No people yet. Add someone to get started."}
        </Typography>
      }
      contentContainerStyle={[
        styles.contentContainer,
        contentPlatformStyle,
        { paddingTop: spacing.xs },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing.xs,
  },
  listHeader: {
    gap: spacing.base,
    marginBottom: spacing.s,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.peachLight,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    gap: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    paddingHorizontal: spacing.s,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    color: colors.textPrimary,
    fontFamily: "Fredoka-Regular",
    fontSize: 16,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xxs,
  },
  personRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.75,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  personDetails: {
    flex: 1,
  },
  empty: {
    paddingVertical: spacing.xl,
    textAlign: "center",
  },
});
