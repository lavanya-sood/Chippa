import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state";
import { SELF_PERSON_ID } from "@/constants/people";
import { PersonBalance } from "@/types";
import { formatDate } from "@/utils/date";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpenseDetails() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expense = useExpensesStore((state) =>
    state.expenses.find((item) => item.id === id),
  );
  const people = usePeopleStore((state) => state.people);
  const [isEditingItems, setIsEditingItems] = useState(false);

  if (!expense) {
    return (
      <View
        style={[
          styles.container,
          styles.notFound,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialDesignIcons
            name="chevron-left"
            size={24}
            color={colors.textPrimary}
          />
          <Typography variant="body">Back</Typography>
        </Pressable>
        <Typography variant="h3">Expense not found</Typography>
      </View>
    );
  }

  const balanceByPerson = new Map<
    string,
    { paidCents: number; owesCents: number }
  >();
  const participantIds = [...new Set([SELF_PERSON_ID, ...expense.people])];
  const personIds = new Set(participantIds);

  for (const item of expense.items) {
    const itemTotalCents = Math.round(item.amount * item.quantity * 100);
    const payerId =
      item.paidBy === undefined ? expense.paidBy : item.paidBy;

    if (payerId) {
      personIds.add(payerId);
      const payerBalance = balanceByPerson.get(payerId) ?? {
        paidCents: 0,
        owesCents: 0,
      };
      payerBalance.paidCents += itemTotalCents;
      balanceByPerson.set(payerId, payerBalance);
    }

    const sharedBy = [...new Set(item.sharedBy)];
    sharedBy.forEach((personId) => personIds.add(personId));
    if (sharedBy.length === 0) continue;

    const shareCents = Math.floor(itemTotalCents / sharedBy.length);
    const remainingCents = itemTotalCents % sharedBy.length;

    sharedBy.forEach((personId, index) => {
      const personBalance = balanceByPerson.get(personId) ?? {
        paidCents: 0,
        owesCents: 0,
      };
      personBalance.owesCents += shareCents + (index < remainingCents ? 1 : 0);
      balanceByPerson.set(personId, personBalance);
    });
  }

  const personBalances: PersonBalance[] = [...personIds].map((personId) => {
    const { paidCents = 0, owesCents = 0 } =
      balanceByPerson.get(personId) ?? {};
    const paid = paidCents / 100;
    const owes = owesCents / 100;

    return {
      personId,
      personName:
        personId === SELF_PERSON_ID
          ? "You"
          : people.find((person) => person.id === personId)?.name ?? personId,
      paid,
      owes,
      balance: paid - owes,
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <MaterialDesignIcons
          name="chevron-left"
          size={24}
          color={colors.textPrimary}
        />
        <Typography variant="body">Back</Typography>
      </Pressable>

      <Button
        variant="outline"
        size="small"
        title="Edit expense"
        onPress={() =>
          router.push({
            pathname: "/screens/addExpense",
            params: { id: expense.id },
          })
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.expenseHeading}>
          <Typography variant="h1" style={styles.expenseName}>
            {expense.name}
          </Typography>
          <Typography variant="h3">${expense.total.toFixed(2)}</Typography>
        </View>
        <Typography variant="bodySmall">{formatDate(expense.date)}</Typography>

        <View style={styles.section}>
          <Typography variant="h3">People</Typography>
          {participantIds.map((personId) => {
            if (personId === SELF_PERSON_ID) {
              return (
                <Typography key={personId} variant="body">
                  You
                </Typography>
              );
            }
            const person = people.find((entry) => entry.id === personId);
            return person ? (
              <Typography key={person.id} variant="body">
                {person.name}
              </Typography>
            ) : null;
          })}
        </View>

        <View style={styles.section}>
          <Typography variant="h3">Summary</Typography>
          {personBalances.map((personBalance) => (
            <View key={personBalance.personId} style={styles.balanceRow}>
              <Typography variant="body">{personBalance.personName}</Typography>
              <Typography variant="body">
                owes ${personBalance.owes.toFixed(2)}
              </Typography>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Typography variant="h3">Items</Typography>
            <Button
              variant="outline"
              size="small"
              title={isEditingItems ? "Done" : "Edit items"}
              onPress={() => setIsEditingItems((editing) => !editing)}
            />
          </View>
          {expense.items.length ? (
            expense.items.map((item) => {
              const itemContent = (
                <>
                <View style={styles.itemDetails}>
                  <Typography variant="body">{item.name}</Typography>
                  <Typography variant="bodySmall">
                    {item.quantity} × ${item.amount.toFixed(2)}
                  </Typography>
                </View>
                <Typography variant="body">
                  ${(item.amount * item.quantity).toFixed(2)}
                </Typography>
                </>
              );

              return isEditingItems ? (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/addItem",
                      params: { id: expense.id, itemId: item.id },
                    })
                  }
                  style={styles.itemRow}
                >
                  {itemContent}
                </Pressable>
              ) : (
                <View key={item.id} style={styles.itemRow}>
                  {itemContent}
                </View>
              );
            })
          ) : (
            <Typography variant="bodySmall">No items yet</Typography>
          )}
        </View>

        <Button
          variant="primary"
          fullWidth
          title="Add new item"
          onPress={() =>
            router.push({
              pathname: "/screens/addItem",
              params: { id: expense.id },
            })
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    gap: spacing.s,
  },
  notFound: {
    padding: spacing.base,
  },
  backButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xxs,
  },
  content: {
    flexGrow: 1,
    gap: spacing.s,
    paddingBottom: spacing.base,
  },
  expenseHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.s,
  },
  expenseName: {
    flex: 1,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.s,
  },
  section: {
    gap: spacing.xxs,
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.s,
  },
  itemDetails: {
    gap: spacing.xxxs,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.s,
  },
});
