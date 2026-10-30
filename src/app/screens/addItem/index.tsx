import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { SELF_PERSON_ID } from "@/constants/people";
import { Item } from "@/types/models";
import { generateShortId } from "@/utils/id";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddExpenseItem() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId?: string }>();
  const expense = useExpensesStore((state) =>
    state.expenses.find((item) => item.id === id),
  );
  const addItemToExpense = useExpensesStore((state) => state.addItemToExpense);
  const updateItemInExpense = useExpensesStore(
    (state) => state.updateItemInExpense,
  );
  const removeItemFromExpense = useExpensesStore(
    (state) => state.removeItemFromExpense,
  );
  const people = usePeopleStore((state) => state.people);
  const editingItem = expense?.items.find((item) => item.id === itemId);
  const [name, setName] = useState(() => editingItem?.name ?? "");
  const [price, setPrice] = useState(() =>
    editingItem ? String(editingItem.amount) : "",
  );
  const [quantity, setQuantity] = useState(() =>
    editingItem ? String(editingItem.quantity) : "1",
  );
  const [sharedBy, setSharedBy] = useState<string[]>(
    () => editingItem?.sharedBy ?? [],
  );
  const [paidBy, setPaidBy] = useState<string | null | undefined>(
    () =>
      editingItem && "paidBy" in editingItem
        ? editingItem.paidBy
        : expense?.paidBy,
  );

  const expensePeople =
    expense?.people
      .map((personId) => people.find((person) => person.id === personId))
      .filter((person) => person !== undefined) ?? [];
  const amount = Number(price);
  const itemQuantity = Number(quantity);
  const canSave =
    name.trim().length > 0 &&
    price.trim().length > 0 &&
    Number.isFinite(amount) &&
    amount > 0 &&
    Number.isInteger(itemQuantity) &&
    itemQuantity > 0 &&
    sharedBy.length > 0;

  const togglePerson = (personId: string) => {
    setSharedBy((current) =>
      current.includes(personId)
        ? current.filter((id) => id !== personId)
        : [...current, personId],
    );
  };

  const saveItem = () => {
    if (!expense || !canSave) return;

    const item: Item = {
      id: editingItem?.id ?? generateShortId(expense.items.length),
      name: name.trim(),
      amount,
      quantity: itemQuantity,
      sharedBy,
      ...(paidBy !== undefined ? { paidBy } : {}),
    };

    if (editingItem) {
      updateItemInExpense(expense.id, item);
    } else {
      addItemToExpense(expense.id, item);
    }
    router.back();
  };

  const confirmDeleteItem = () => {
    if (!expense || !editingItem) return;

    Alert.alert("Delete item?", "This will remove the item from the expense.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeItemFromExpense(expense.id, editingItem.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
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

      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Typography variant="h2">
          {editingItem ? "Edit item" : "Add item"}
        </Typography>

        {!expense ? (
          <Typography variant="body">Expense not found</Typography>
        ) : (
          <>
            <TextField
              label="Item name"
              value={name}
              onChangeValue={setName}
              placeholder="Enter item name"
            />
            <TextField
              label="Price per item"
              value={price}
              onChangeValue={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            <TextField
              label="Quantity"
              value={quantity}
              onChangeValue={setQuantity}
              placeholder="1"
              keyboardType="number-pad"
            />

            <View style={styles.peopleSection}>
              <Typography variant="h3">Who had this item?</Typography>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: sharedBy.includes(SELF_PERSON_ID),
                }}
                onPress={() => togglePerson(SELF_PERSON_ID)}
                style={[
                  styles.personOption,
                  sharedBy.includes(SELF_PERSON_ID) &&
                    styles.personOptionSelected,
                ]}
              >
                <Typography
                  variant="body"
                  color={
                    sharedBy.includes(SELF_PERSON_ID)
                      ? colors.error
                      : colors.textPrimary
                  }
                >
                  You
                </Typography>
                {sharedBy.includes(SELF_PERSON_ID) && (
                  <MaterialDesignIcons
                    name="check"
                    size={20}
                    color={colors.error}
                  />
                )}
              </Pressable>
              {expensePeople.map((person) => {
                const isSelected = sharedBy.includes(person.id);
                return (
                  <Pressable
                    key={person.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    onPress={() => togglePerson(person.id)}
                    style={[
                      styles.personOption,
                      isSelected && styles.personOptionSelected,
                    ]}
                  >
                    <Typography
                      variant="body"
                      color={isSelected ? colors.error : colors.textPrimary}
                    >
                      {person.name}
                    </Typography>
                    {isSelected && (
                      <MaterialDesignIcons
                        name="check"
                        size={20}
                        color={colors.error}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.peopleSection}>
              <Typography variant="h3">Who paid? (optional)</Typography>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: paidBy == null }}
                onPress={() => setPaidBy(null)}
                style={[
                  styles.personOption,
                  paidBy == null && styles.payerOptionSelected,
                ]}
              >
                <Typography variant="body" color={colors.textPrimary}>
                  No payer
                </Typography>
                {paidBy == null && (
                  <MaterialDesignIcons
                    name="check"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </Pressable>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: paidBy === SELF_PERSON_ID }}
                onPress={() => setPaidBy(SELF_PERSON_ID)}
                style={[
                  styles.personOption,
                  paidBy === SELF_PERSON_ID && styles.payerOptionSelected,
                ]}
              >
                <Typography variant="body" color={colors.textPrimary}>
                  You
                </Typography>
                {paidBy === SELF_PERSON_ID && (
                  <MaterialDesignIcons
                    name="check"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </Pressable>
              {expensePeople.map((person) => {
                const isSelected = paidBy === person.id;
                return (
                  <Pressable
                    key={person.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setPaidBy(person.id)}
                    style={[
                      styles.personOption,
                      isSelected && styles.payerOptionSelected,
                    ]}
                  >
                    <Typography variant="body" color={colors.textPrimary}>
                      {person.name}
                    </Typography>
                    {isSelected && (
                      <MaterialDesignIcons
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Typography variant="bodySmall">
              Total: ${(amount * itemQuantity || 0).toFixed(2)}
            </Typography>
          </>
        )}
      </ScrollView>
      {expense && (
        <View
          style={[
            styles.footer,
            { paddingBottom: safeAreaInsets.bottom + spacing.base },
          ]}
        >
          <Button
            variant="primary"
            fullWidth
            title={editingItem ? "Save changes" : "Add item"}
            onPress={saveItem}
            disabled={!canSave}
          />
          {editingItem && (
            <Button
              variant="delete"
              fullWidth
              title="Delete item"
              onPress={confirmDeleteItem}
            />
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
  },
  scrollView: {
    flex: 1,
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
  footer: {
    gap: spacing.s,
    paddingTop: spacing.s,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  peopleSection: {
    gap: spacing.xxs,
  },
  personOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xxs,
    backgroundColor: colors.surface,
  },
  personOptionSelected: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  payerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
});
