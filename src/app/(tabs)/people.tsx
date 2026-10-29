import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state/stores";
import SearchBox from "@/components/SearchBox/SearchBox";
import PersonTile from "@/components/PersonTile/PersonTile";

export default function PeopleScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const router = useRouter();
  const people = usePeopleStore((state) => state.people);
  const [search, setSearch] = useState("");

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      paddingBottom: safeAreaInsets.bottom,
    },
  });

  const filteredPeople = people.filter((person) =>
    `${person.name} ${person.notes ?? ""}`
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <View
      style={[
        styles.screen,
        contentPlatformStyle,
        { paddingTop: safeAreaInsets.top },
      ]}
    >
      <View style={styles.screenHeader}>
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
          <SearchBox searchValue={search} onChange={setSearch} />

          <View style={styles.sectionHeading}>
            <Typography variant="h3">My people ({people.length})</Typography>
          </View>
        </View>
      </View>
      <FlatList
        style={styles.peopleList}
        data={filteredPeople}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PersonTile
            person={item}
            onPress={() =>
              router.push({
                pathname: "/screens/person/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
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
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
  },
  peopleList: {
    flex: 1,
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

  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xxs,
  },

  pressed: {
    opacity: 0.75,
  },

  empty: {
    paddingVertical: spacing.xl,
    textAlign: "center",
  },
});
