import Button from "@/components/Button/Button";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { timeAgo } from "@/utils/date";
import ExpenseTile from "@/components/ExpenseTile/ExpenseTile";

import { useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import SearchBox from "@/components/SearchBox/SearchBox";
import PersonTile from "@/components/PersonTile/PersonTile";

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
  buttonGroup: {
    width: "100%",
    paddingHorizontal: spacing.l,
    alignItems: "center",
    gap: 8,
    flexDirection: "column",
  },
});
