import AppHeader from "@/components/AppHeader/AppHeader";
import Button from "@/components/Button/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PersonProfileScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = usePeopleStore((state) =>
    state.people.find((item) => item.id === id),
  );
  const expenses = useExpensesStore((state) => state.expenses);
  const removePerson = usePeopleStore((state) => state.removePerson);
  const [showUsedInExpenses, setShowUsedInExpenses] = useState(false);

  const usedInExpenses = person
    ? expenses.filter(
        (expense) =>
          expense.people.includes(person.id) ||
          expense.items.some((item) => item.sharedBy.includes(person.id)),
      )
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom + spacing.base,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader title="Person profile" onBackPress={() => router.back()} />

      <View style={styles.hero}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: person.avatarColor ?? colors.avatarPink },
          ]}
        >
          <MaterialDesignIcons
            name="account"
            size={76}
            color={colors.textPrimary}
          />
        </View>
        <Typography variant="h2" style={styles.name}>
          {person.name}
        </Typography>
        <Typography variant="body" color={colors.textSecondary}>
          {person.notes?.trim() || "No notes yet"}
        </Typography>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit person"
          variant="primary"
          fullWidth
          onPress={() =>
            router.push({
              pathname: "/screens/addPerson",
              params: { personId: person.id },
            })
          }
        />
        <Button
          title="Change avatar colour"
          variant="outline"
          fullWidth
          onPress={() =>
            router.push({
              pathname: "/screens/addPerson",
              params: { personId: person.id },
            })
          }
        />
        <Button
          title="Delete person"
          variant="delete"
          fullWidth
          onPress={confirmDelete}
        />
      </View>

      <View style={styles.details}>
        <Typography variant="h5">Details</Typography>
        <View style={styles.detailRow}>
          <MaterialDesignIcons
            name="account-outline"
            size={22}
            color={colors.primary}
          />
          <Typography variant="body" style={styles.detailLabel}>
            Name
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {person.name}
          </Typography>
        </View>
        <View style={styles.detailRow}>
          <MaterialDesignIcons
            name="text-box-outline"
            size={22}
            color={colors.primary}
          />
          <Typography variant="body" style={styles.detailLabel}>
            Notes
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            numberOfLines={2}
          >
            {person.notes?.trim() || "None"}
          </Typography>
        </View>
        <View style={styles.detailRow}>
          <MaterialDesignIcons
            name="palette-outline"
            size={22}
            color={colors.primary}
          />
          <Typography variant="body" style={styles.detailLabel}>
            Avatar colour
          </Typography>
          <View
            accessibilityLabel="Avatar colour"
            style={[
              styles.colorSwatch,
              { backgroundColor: person.avatarColor ?? colors.avatarPink },
            ]}
          />
        </View>
      </View>

      <View style={styles.usedIn}>
        <Typography variant="h5">Used in</Typography>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: usedInExpenses.length === 0,
            expanded: showUsedInExpenses,
          }}
          disabled={usedInExpenses.length === 0}
          onPress={() => setShowUsedInExpenses((isShown) => !isShown)}
          style={({ pressed }) => [
            styles.usedInSummary,
            pressed && styles.pressed,
            usedInExpenses.length === 0 && styles.usedInDisabled,
          ]}
        >
          <View style={styles.usedInIcon}>
            <MaterialDesignIcons
              name="receipt-text-outline"
              size={22}
              color={colors.primary}
            />
          </View>
          <Typography variant="body" style={styles.usedInCount}>
            {usedInExpenses.length}{" "}
            {usedInExpenses.length === 1 ? "split" : "splits"}
          </Typography>
          <MaterialDesignIcons
            name={showUsedInExpenses ? "chevron-up" : "chevron-right"}
            size={24}
            color={colors.textTertiary}
          />
        </Pressable>
        {showUsedInExpenses &&
          usedInExpenses.map((expense) => (
            <Pressable
              key={expense.id}
              accessibilityRole="button"
              accessibilityLabel={`View ${expense.name}, ${formatDate(expense.date)}`}
              onPress={() =>
                router.push({
                  pathname: "/screens/expense/[id]",
                  params: { id: expense.id },
                })
              }
              style={({ pressed }) => [
                styles.usedInExpense,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.usedInIcon}>
                <MaterialDesignIcons
                  name="receipt-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.usedInExpenseDetails}>
                <Typography variant="body">{expense.name}</Typography>
                <Typography variant="bodySmall" color={colors.textSecondary}>
                  {formatDate(expense.date)}
                </Typography>
              </View>
              <MaterialDesignIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </Pressable>
          ))}
      </View>
    </ScrollView>
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
    width: 144,
    height: 144,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 72,
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
  usedIn: {
    gap: spacing.xs,
  },
  usedInSummary: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  usedInIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  usedInCount: {
    flex: 1,
  },
  usedInExpense: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  usedInExpenseDetails: {
    flex: 1,
  },
  usedInDisabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.75,
  },
});
