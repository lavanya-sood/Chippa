import AppHeader from "@/components/AppHeader/AppHeader";
import ExpenseTile from "@/components/ExpenseTile/ExpenseTile";
import SearchBox from "@/components/SearchBox/SearchBox";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { timeAgo } from "@/utils/date";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const expenses = useExpensesStore((state) => state.expenses);
  const people = usePeopleStore((state) => state.people);
  const [search, setSearch] = useState("");

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return expenses;

    return expenses.filter((expense) => {
      const participantNames = expense.people.map((personId) =>
        personId === SELF_PERSON_ID
          ? "You"
          : (people.find((person) => person.id === personId)?.name ?? ""),
      );

      return [expense.name, ...participantNames]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query);
    });
  }, [expenses, people, search]);

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
        <AppHeader title="All expenses" onBackPress={() => router.back()} />
        <SearchBox
          searchValue={search}
          onChange={setSearch}
          placeholder="Search expenses"
          accessibilityLabel="Search expenses"
        />
      </View>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(expense) => expense.id}
        renderItem={({ item: expense }) => (
          <ExpenseTile
            id={expense.id}
            onPress={() =>
              router.push({
                pathname: "/screens/expense/[id]",
                params: { id: expense.id },
              })
            }
            name={expense.name}
            amount={expense.total.toFixed(2)}
            date={timeAgo(expense.date)}
            people={[
              ...(expense.people.includes(SELF_PERSON_ID)
                ? [{ id: SELF_PERSON_ID, name: "You" }]
                : []),
              ...people.filter((person) =>
                expense.people.includes(person.id),
              ),
            ]}
            peopleCount={expense.people.length}
          />
        )}
        ListEmptyComponent={
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.empty}
          >
            {search.trim()
              ? "No expenses match your search."
              : "No expenses yet. Create one to get started."}
          </Typography>
        }
        contentContainerStyle={styles.listContent}
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
  header: {
    gap: spacing.s,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.s,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing.xs,
  },
  empty: {
    paddingVertical: spacing.xl,
    textAlign: "center",
  },
});
