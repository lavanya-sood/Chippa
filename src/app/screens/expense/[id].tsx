import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state";
import type { PersonBalance } from "@/types";
import { formatDate } from "@/utils/date";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        <View style={styles.headerView}>
          <AppHeader title={""} onBackPress={() => router.back()} />
        </View>
        <Typography variant="h3">Expense not found</Typography>
      </View>
    );
  }

  const participantIds = [...new Set([SELF_PERSON_ID, ...expense.people])];
  const balanceByPerson = new Map<
    string,
    { paidCents: number; owesCents: number }
  >();
  const personIds = new Set(participantIds);

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

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

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
      <View style={styles.headerView}>
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
      </View>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.expenseName}>
          {expense.name}
        </Typography>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          {formatDate(expense.date)}
        </Typography>

        <View style={styles.avatarRow}>
          {participantIds.map((personId) => {
            const name = getPersonName(personId);
            return (
              <View
                key={personId}
                accessibilityLabel={name}
                style={[
                  styles.headerAvatar,
                  { backgroundColor: getPersonColor(personId) },
                ]}
              >
                <Typography variant="caption" color={colors.textPrimary}>
                  {getInitials(name)}
                </Typography>
              </View>
            );
          })}
          <Typography variant="bodySmall" color={colors.textSecondary}>
            {participantIds.length} people
          </Typography>
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, isSelected && styles.selectedTab]}
            >
              <Typography
                variant="bodySmall"
                color={isSelected ? colors.textPrimary : colors.textSecondary}
                style={isSelected ? styles.selectedTabLabel : undefined}
              >
                {tab}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        key={activeTab}
        style={styles.tabContent}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Items" && (
          <>
            <View style={styles.sectionHeading}>
              <Typography variant="h5">Items</Typography>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsEditingItems((editing) => !editing)}
                hitSlop={8}
              >
                <Typography variant="bodySmall" color={colors.primary}>
                  {isEditingItems ? "Done" : "Edit"}
                </Typography>
              </Pressable>
            </View>

            {expense.items.length ? (
              expense.items.map((item, index) => {
                const sharedNames = [...new Set(item.sharedBy)]
                  .map(getPersonName)
                  .join(" · ");
                const iconBackgrounds = [
                  colors.peachLight,
                  colors.sageLight,
                  colors.yellowLight,
                  colors.pinkLight,
                ];

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.name}`}
                    onPress={() => isEditingItems && goToAddItem(item.id)}
                    disabled={!isEditingItems}
                    style={styles.itemCard}
                  >
                    <View
                      style={[
                        styles.itemIcon,
                        {
                          backgroundColor:
                            iconBackgrounds[index % iconBackgrounds.length],
                        },
                      ]}
                    >
                      <MaterialDesignIcons
                        name="food-outline"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.itemDetails}>
                      <Typography variant="h7" numberOfLines={1}>
                        {item.name}
                      </Typography>
                      <Typography variant="bodySmall">
                        ${(item.amount * item.quantity).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                        numberOfLines={1}
                      >
                        {sharedNames || "No one assigned"}
                      </Typography>
                    </View>
                    <View style={styles.itemRight}>
                      <Typography
                        variant="caption"
                        color={colors.textSecondary}
                      >
                        {item.sharedBy.length
                          ? `$${(
                              (item.amount * item.quantity) /
                              new Set(item.sharedBy).size
                            ).toFixed(2)} each`
                          : ""}
                      </Typography>
                      <MaterialDesignIcons
                        name="chevron-right"
                        size={22}
                        color={colors.textSecondary}
                      />
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Typography variant="bodySmall" color={colors.textSecondary}>
                  No items yet. Add the first item to split this expense.
                </Typography>
              </View>
            )}

            <Button
              variant="primary"
              fullWidth
              title="+  Add item"
              onPress={() => goToAddItem()}
            />

            <View style={styles.subtotalCard}>
              <Typography variant="bodySmall" color={colors.textSecondary}>
                Subtotal
              </Typography>
              <Typography variant="h6">${expense.total.toFixed(2)}</Typography>
            </View>
          </>
        )}

        {activeTab === "Summary" && (
          <>
            <Typography variant="h5">Expense summary</Typography>
            <View style={styles.totalCard}>
              <Typography variant="bodySmall" color={colors.textSecondary}>
                Total expense
              </Typography>
              <Typography variant="h3">${expense.total.toFixed(2)}</Typography>
            </View>
            <View style={styles.sectionHeading}>
              <Typography variant="h5">Balances</Typography>
            </View>
            {personBalances.map((personBalance) => (
              <View key={personBalance.personId} style={styles.balanceCard}>
                <View style={styles.balanceHeading}>
                  <View
                    style={[
                      styles.personAvatar,
                      {
                        backgroundColor: getPersonColor(personBalance.personId),
                      },
                    ]}
                  >
                    <Typography variant="caption" color={colors.textPrimary}>
                      {getInitials(personBalance.personName)}
                    </Typography>
                  </View>
                  <Typography variant="h7" style={styles.balanceName}>
                    {personBalance.personName}
                  </Typography>
                  <Typography variant="h7">
                    {personBalance.balance < 0 ? "Owes" : "Gets back"} $
                    {Math.abs(personBalance.balance).toFixed(2)}
                  </Typography>
                </View>
                <View style={styles.balanceDetails}>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Paid ${personBalance.paid.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Share ${personBalance.owes.toFixed(2)}
                  </Typography>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === "People" && (
          <>
            <View style={styles.sectionHeading}>
              <Typography variant="h5">People</Typography>
              <Typography variant="bodySmall" color={colors.textSecondary}>
                {participantIds.length} total
              </Typography>
            </View>
            {participantIds.map((personId) => {
              const balance = personBalances.find(
                (person) => person.personId === personId,
              );
              const name = getPersonName(personId);
              return (
                <View key={personId} style={styles.personCard}>
                  <View
                    style={[
                      styles.personAvatar,
                      { backgroundColor: getPersonColor(personId) },
                    ]}
                  >
                    <Typography variant="caption" color={colors.textPrimary}>
                      {getInitials(name)}
                    </Typography>
                  </View>
                  <View style={styles.personDetails}>
                    <Typography variant="h7">{name}</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      Paid ${balance?.paid.toFixed(2) ?? "0.00"} · Share $
                      {balance?.owes.toFixed(2) ?? "0.00"}
                    </Typography>
                  </View>
                  <Typography variant="h7">
                    ${balance?.owes.toFixed(2) ?? "0.00"}
                  </Typography>
                </View>
              );
            })}
          </>
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
  headerView: {
    paddingHorizontal: spacing.base,
  },
  notFound: {
    padding: spacing.base,
    gap: spacing.s,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.s,
  },
  headerTopRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginLeft: -spacing.xs,
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
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: spacing.xxs,
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -spacing.xxs,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedTab: {
    borderBottomColor: colors.primary,
  },
  selectedTabLabel: {
    fontFamily: "Fredoka-Medium",
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
  sectionHeading: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxxs,
  },
  itemCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
    gap: 1,
  },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: spacing.xxxs,
  },
  emptyState: {
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  subtotalCard: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  totalCard: {
    gap: spacing.xxxs,
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.primaryPale,
  },
  balanceCard: {
    gap: spacing.xxs,
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  balanceName: {
    flex: 1,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 40,
  },
  personCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  personAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  personDetails: {
    flex: 1,
    gap: spacing.xxxs,
  },
});
