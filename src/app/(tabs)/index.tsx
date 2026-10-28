import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore } from "@/state/index";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { timeAgo } from "@/utils/date";
import ExpenseTile from "@/components/ExpenseTile";

export default function HomeScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { expenses } = useExpensesStore();
  const recentExpenses = expenses.slice(-3);

  const name = "Hannah";

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.container]}
      >
        <Typography variant="h2">Welcome, {name}!</Typography>

        <Button
          variant="primary"
          fullWidth
          title={"Create Expense"}
          onPress={() => router.push("/screens/addExpense")}
        />

        <Typography variant="h3">Recent expenses</Typography>
        {recentExpenses.map((expense) => (
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
            people={expense.people}
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
  buttonGroup: {
    width: "100%",
    paddingHorizontal: spacing.l,
    alignItems: "center",
    gap: 8,
    flexDirection: "column",
  },
});
