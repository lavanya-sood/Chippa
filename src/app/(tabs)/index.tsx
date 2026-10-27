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

export default function HomeScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { expenses } = useExpensesStore();
  const recentExpenses = expenses.slice(-3);

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.container,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <Typography variant="h1">Home</Typography>

        <Button
          variant="primary"
          fullWidth
          title={"Create Expense"}
          onPress={() => router.push("/screens/addExpense")}
        />

        <Typography variant="h2">Recent expenses</Typography>
        {recentExpenses.map((expense) => (
          <Pressable
            key={expense.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/screens/expense/[id]",
                params: { id: expense.id },
              })
            }
          >
            <Typography variant="h4">{expense.name}</Typography>
            <Typography variant="body">
              Total: ${expense.total.toFixed(2)}
            </Typography>
            <Typography variant="bodySmall">{timeAgo(expense.date)}</Typography>
          </Pressable>
        ))}
      </ScrollView>
    </>
    // <FlatList
    //   data={expenses}
    //   keyExtractor={(item, index) => `${index}-${item.name}`}
    //   renderItem={({ item }) => (
    //     <Typography variant="h4">{item.name}</Typography>
    //   )}
    //   ListHeaderComponent={<Typography variant="h1">Expenses</Typography>}
    //   ListFooterComponent={
    //     <Button
    //       variant="primary"
    //       fullWidth
    //       title="Add expense"
    //       onPress={() => router.push("/screens/addExpense")}
    //     />
    //   }
    //   contentContainerStyle={[
    //     styles.contentContainer,
    //     contentPlatformStyle,
    //     { paddingTop: insets.top },
    //   ]}
    // />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    gap: spacing.s,
  },
  contentContainer: {
    // flexDirection: "row",
    // justifyContent: "center",
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.s,
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
