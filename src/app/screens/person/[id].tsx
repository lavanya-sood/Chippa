import AppHeader from "@/components/AppHeader/AppHeader";
import Button from "@/components/Button/Button";
import PersonExpenseRow from "@/components/PersonExpenseRow/PersonExpenseRow";
import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { getExpensesForPerson } from "@/utils/expense";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AVATAR_SIZE = 120;

export default function PersonProfileScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = usePeopleStore((state) =>
    state.people.find((item) => item.id === id),
  );
  const expenses = useExpensesStore((state) => state.expenses);
  const removePerson = usePeopleStore((state) => state.removePerson);

  const usedInExpenses = person
    ? getExpensesForPerson(expenses, person.id)
    : [];

  const confirmDelete = () => {
    if (!person) return;

    Alert.alert(
      "Delete person?",
      `This will remove ${person.name} from your people list.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removePerson(person.id);
            router.back();
          },
        },
      ],
    );
  };

  if (!person) {
    return (
      <View
        style={[
          styles.screen,
          styles.missingPerson,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <Typography variant="h5">Person not found</Typography>
        <Button
          title="Back to people"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: safeAreaInsets.top,
        },
      ]}
    >
      <AppHeader
        title="Person details"
        onBackPress={() => router.back()}
        rightIcon={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit expense"
            onPress={() =>
              router.push({
                pathname: "/screens/addPerson",
                params: { personId: person.id },
              })
            }
            style={styles.editButton}
          >
            <MaterialDesignIcons
              name="pencil-outline"
              size={28}
              color={colors.black}
            />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={[styles.content]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: person.avatarColor ?? colors.avatarPink },
            ]}
          >
            <Typography
              variant="h1"
              color={getPersonAvatarTextColor(person.avatarColor)}
            >
              {person.name.trim().charAt(0).toUpperCase()}
            </Typography>
          </View>
          <Typography variant="h2" style={styles.name}>
            {person.name}
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {person.notes?.trim() || "No notes yet"}
          </Typography>
        </View>

        <View style={styles.splitsSection}>
          <View style={styles.splitsHeading}>
            <Typography variant="h5">Splits with {person.name}</Typography>
            {usedInExpenses.length > 3 && (
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/screens/expenses",
                    params: { personId: person.id },
                  })
                }
                style={({ pressed }) => [
                  styles.seeAllButton,
                  pressed && styles.pressed,
                ]}
              >
                <Typography variant="bodySmall" color={colors.primary}>
                  See all
                </Typography>
              </Pressable>
            )}
          </View>
          {usedInExpenses.length > 0 ? (
            <View style={styles.splitsCard}>
              {usedInExpenses.slice(0, 3).map((expense, index) => (
                <View key={expense.id}>
                  {index > 0 && <View style={styles.splitSeparator} />}
                  <PersonExpenseRow
                    expense={expense}
                    personId={person.id}
                    personName={person.name}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/expense/[id]",
                        params: { id: expense.id },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          ) : (
            <Typography variant="body" color={colors.textSecondary}>
              No splits with {person.name} yet.
            </Typography>
          )}
        </View>
      </ScrollView>
      <View
        style={[
          styles.createFooter,
          { paddingBottom: safeAreaInsets.bottom + spacing.base },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Create a new split with ${person.name}`}
          onPress={() => router.push("/screens/addExpense")}
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialDesignIcons
            name="plus-circle-outline"
            size={28}
            color={colors.peachDark}
          />
          <Typography variant="h6" color={colors.peachDark}>
            Create a new split with {person.name}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    gap: spacing.l,
    paddingBottom: spacing.base,
  },
  hero: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  missingPerson: {
    justifyContent: "center",
    paddingHorizontal: spacing.base,
    gap: spacing.s,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.xs,
  },
  details: {
    gap: spacing.xs,
    padding: spacing.s,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  detailRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailLabel: {
    flex: 1,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  splitsSection: {
    gap: spacing.xs,
  },
  splitsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  splitsCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  splitSeparator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.s,
    backgroundColor: colors.divider,
  },
  createFooter: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.s,
    backgroundColor: colors.background,
  },
  createButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: 28,
    backgroundColor: colors.pinkLight,
  },
  pressed: {
    opacity: 0.75,
  },
  editButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxxs,
    paddingHorizontal: spacing.xxs,
  },
});
