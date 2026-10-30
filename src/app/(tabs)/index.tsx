import Button from "@/components/Button/Button";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { timeAgo } from "@/utils/date";
import ExpenseTile from "@/components/ExpenseTile/ExpenseTile";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { expenses } = useExpensesStore();
  const people = usePeopleStore((state) => state.people);
  const recentExpenses = expenses.slice(-3);

  const safeAreaInsets = useSafeAreaInsets();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      paddingBottom: safeAreaInsets.bottom,
    },
  });

  const name = "Hannah";

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.container,
          contentPlatformStyle,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <Typography variant="h2">Welcome, {name}!</Typography>

        <Button
          variant="primary"
          fullWidth
          title={"Create Expense"}
          onPress={() => router.push("/screens/addExpense")}
        />

        <View style={styles.expensesHeading}>
          <Typography variant="h3">Recent expenses</Typography>

          <Button
            variant="text"
            title={"See all"}
            onPress={() => router.push("/screens/expenses")}
          />
        </View>
        {recentExpenses.map((expense) => (
          <ExpenseTile
            id={expense.id}
            key={expense.id}
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
              ...people.filter((person) => expense.people.includes(person.id)),
            ]}
            peopleCount={expense.people.length}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,

    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    gap: spacing.s,
  },

  button: {
    backgroundColor: "pink",
    padding: 12,
    marginTop: 12,
  },
  expensesHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllButton: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonGroup: {
    width: "100%",
    paddingHorizontal: spacing.l,
    alignItems: "center",
    gap: 8,
    flexDirection: "column",
  },
});
