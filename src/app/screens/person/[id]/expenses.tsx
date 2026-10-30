import AppHeader from "@/components/AppHeader/AppHeader";
import PersonExpenseRow from "@/components/PersonExpenseRow/PersonExpenseRow";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { getExpensesForPerson } from "@/utils/expense";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PersonExpensesScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = usePeopleStore((state) =>
    state.people.find((item) => item.id === id),
  );
  const expenses = useExpensesStore((state) => state.expenses);
  const personExpenses = useMemo(
    () => (person ? getExpensesForPerson(expenses, person.id) : []),
    [expenses, person],
  );

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <AppHeader
          title={person ? `Splits with ${person.name}` : "Person's splits"}
          onBackPress={() => router.back()}
        />
      </View>
      {person ? (
        <FlatList
          data={personExpenses}
          keyExtractor={(expense) => expense.id}
          renderItem={({ item: expense }) => (
            <View style={styles.expenseCard}>
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
          )}
          ListEmptyComponent={
            <Typography
              variant="body"
              color={colors.textSecondary}
              style={styles.empty}
            >
              No splits with {person.name} yet.
            </Typography>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={styles.empty}
        >
          Person not found.
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.s,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing.xs,
  },
  expenseCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  empty: {
    padding: spacing.xl,
    textAlign: "center",
  },
});
