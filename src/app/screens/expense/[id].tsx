import AppHeader from "@/components/AppHeader/AppHeader";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import type { PersonBalance } from "@/types/models";
import { formatDate } from "@/utils/date";
import { getExpenseDebts } from "@/utils/expense";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar/Avatar";
import Tabs from "@/components/Tabs/tabs";
import ItemsTab from "@/app/screens/expense/tabs/items";
import SummaryTab from "@/app/screens/expense/tabs/summary";
import PeopleTab from "@/app/screens/expense/tabs/people";
type ExpenseTab = "Items" | "Summary" | "People";

const tabs: ExpenseTab[] = ["Items", "Summary", "People"];

export default function ExpenseDetails() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expense = useExpensesStore((state) =>
    state.expenses.find((item) => item.id === id),
  );
  const people = usePeopleStore((state) => state.people);
  const [activeTab, setActiveTab] = useState<ExpenseTab>("Items");

  if (!expense) {
    return (
      <View
        style={[
          styles.container,
          styles.notFound,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <AppHeader title={""} onBackPress={() => router.back()} />

        <Typography variant="h3">Expense not found</Typography>
      </View>
    );
  }

  const personIds = new Set([SELF_PERSON_ID, ...expense.people]);
  const balanceByPerson = new Map<
    string,
    { paidCents: number; owesCents: number }
  >();

  for (const item of expense.items) {
    const itemTotalCents = Math.round(item.amount * item.quantity * 100);
    const payerId = item.paidBy === undefined ? expense.paidBy : item.paidBy;

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

  const participantIds = [...personIds];
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
          : (people.find((person) => person.id === personId)?.name ?? personId),
      paid,
      owes,
      balance: paid - owes,
    };
  });

  const getPersonName = (personId: string) =>
    personId === SELF_PERSON_ID
      ? "You"
      : (people.find((person) => person.id === personId)?.name ?? personId);

  const getPersonColor = (personId: string) =>
    people.find((person) => person.id === personId)?.avatarColor ??
    colors.avatarPeach;
  const personDebts = getExpenseDebts(expense);

  const goToAddItem = (itemId?: string) =>
    router.push({
      pathname: "/screens/addItem",
      params: { id: expense.id, ...(itemId ? { itemId } : {}) },
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
      <AppHeader
        title={""}
        onBackPress={() => router.back()}
        rightIcon={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit expense"
            onPress={() =>
              router.push({
                pathname: "/screens/addExpense",
                params: { id: expense.id },
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

      <View style={styles.header}>
        <Avatar
          icon={(color, size) => (
            <MaterialDesignIcons
              name="receipt-text-outline"
              size={size}
              color={color}
            />
          )}
          avatarColor={colors.avatarLavender}
          size="large"
        />
        <View style={styles.detailsHeader}>
          <Typography variant="h2" style={styles.expenseName}>
            {expense.name}
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {formatDate(expense.date)} • {participantIds.length} people
          </Typography>
        </View>
      </View>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView
        key={activeTab}
        style={styles.tabContent}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Items" && (
          <ItemsTab
            addItem={goToAddItem}
            items={expense.items}
            total={expense.total.toFixed(2)}
          />
        )}

        {activeTab === "Summary" && (
          <SummaryTab
            total={expense.total}
            personBalances={personBalances}
            getPersonColor={getPersonColor}
          />
        )}

        {activeTab === "People" && (
          <PeopleTab
            personBalances={personBalances}
            personDebts={personDebts}
            participantIds={participantIds}
            getPersonColor={getPersonColor}
            getPersonName={getPersonName}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsHeader: {
    gap: spacing.xxxs,
  },

  notFound: {
    padding: spacing.base,
    gap: spacing.s,
  },
  header: {
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.s,
    flexDirection: "row",
    gap: spacing.s,
  },
  editButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxxs,
    paddingHorizontal: spacing.xxs,
  },
  expenseName: {
    marginTop: spacing.xxxs,
    color: colors.textPrimary,
  },

  tabContent: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.s,
    paddingBottom: spacing.base,
  },
});
