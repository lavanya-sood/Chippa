import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore, useExpensesStore } from "@/state";
import { formatDate } from "@/utils/date";
import { Expense } from "@/types/index";
import { generateShortId } from "@/utils/id";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

const SELF_ID = "000";

export default function AddExpense() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { expenses, addExpense, updateExpense, removeExpense } =
    useExpensesStore();
  const editingExpense = expenses.find((expense) => expense.id === id);
  const [expenseName, setExpenseName] = useState(
    () => editingExpense?.name ?? "",
  );
  const [date, setDate] = useState(() =>
    editingExpense ? new Date(editingExpense.date) : new Date(),
  );
  const [pickerDate, setPickerDate] = useState(date);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState<boolean>(false);
  const [peopleList, setPeopleList] = useState<string[]>(
    () => editingExpense?.people ?? [],
  );
  const [paidBy, setPaidBy] = useState<string | undefined>(
    () => editingExpense?.paidBy,
  );
  const { people } = usePeopleStore();
  const availablePayers = people.filter((person) =>
    peopleList.includes(person.id),
  );

  const goBack = () => {
    router.back();
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // On Android, dismissing the picker returns an 'dismissed' event
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    const currentDate = selectedDate || date;

    // For Android, we cycle from Date Picker -> Time Picker to collect both values.
    if (Platform.OS === "android") {
      setShow(false); // Hide the completed picker mode
      if (mode === "date") {
        setDate(currentDate);
        setMode("time");
        // Small timeout allows the UI thread to smoothly transition between dialogs
        setTimeout(() => setShow(true), 100);
      } else {
        setDate(currentDate);
        setMode("date"); // Reset back to date for next opening
      }
    } else if (selectedDate) {
      setPickerDate(selectedDate);
    }
  };

  const showPicker = (currentMode: "date" | "time") => {
    if (Platform.OS === "ios") {
      setPickerDate(date);
    }
    setShow(true);
    setMode(currentMode);
  };

  const savePickerDate = () => {
    setDate(pickerDate);
    setShow(false);
  };

  const selectPerson = (id: string) => {
    const isSelected = peopleList.includes(id);
    setPeopleList((prev) =>
      isSelected ? prev.filter((personId) => personId !== id) : [...prev, id],
    );
    if (isSelected && paidBy === id) {
      setPaidBy(undefined);
    }
  };

  const selectPayer = (id: string) => {
    setPaidBy(id);
  };

  const saveExpense = () => {
    const name = expenseName.trim();
    if (!name) return;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        name,
        date: date.toString(),
        people: peopleList,
        paidBy,
      });
    } else {
      const expenseItem: Expense = {
        id: generateShortId(expenses.length),
        name,
        date: date.toString(),
        total: 0,
        people: peopleList,
        ...(paidBy ? { paidBy } : {}),
        items: [],
      };
      addExpense(expenseItem);
    }

    router.back();
  };

  const confirmDeleteExpense = () => {
    if (!editingExpense) return;

    Alert.alert(
      "Delete expense?",
      "This will permanently delete this expense and its items.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeExpense(editingExpense.id);
            router.replace("/(tabs)");
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={[
        styles.container,
        { paddingTop: safeAreaInsets.top },
      ]}
    >
      <Pressable onPress={goBack}>
        <MaterialDesignIcons name="chevron-left" size={24} color="black" />
      </Pressable>
      <Typography variant="h2">
        {editingExpense ? "Edit expense" : "Create new expense"}
      </Typography>

      <TextField
        label="Expense name"
        value={expenseName}
        onChangeValue={setExpenseName}
        placeholder="Enter the expense name"
      />

      <View>
        <Pressable onPress={() => showPicker("date")}>
          <View pointerEvents="none">
            <TextField
              label="Date"
              value={formatDate(date)}
              onChangeValue={() => {}}
              placeholder="Enter the expense name"
              editable={false}
            />
          </View>
        </Pressable>
        {show && Platform.OS === "android" && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            display="default"
          />
        )}
      </View>
      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={() => setShow(false)}
        >
          <View
            style={[
              styles.pickerOverlay,
              {
                paddingTop: safeAreaInsets.top + spacing.s,
                paddingBottom: safeAreaInsets.bottom + spacing.s,
              },
            ]}
          >
            <View style={styles.pickerCard}>
              <View style={styles.pickerHeader}>
                <Typography variant="h3">Select date and time</Typography>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close date and time picker"
                  hitSlop={8}
                  onPress={() => setShow(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeLabel}>×</Text>
                </Pressable>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={pickerDate}
                mode="datetime"
                is24Hour={true}
                onChange={onChange}
                display="spinner"
              />
              <Button
                variant="primary"
                fullWidth
                title="Done"
                onPress={savePickerDate}
              />
            </View>
          </View>
        </Modal>
      )}
      <View>
        <Typography variant="h3">People</Typography>
        {people.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => selectPerson(item.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: peopleList.includes(item.id) }}
          >
            <Text
              style={
                peopleList.includes(item.id) ? styles.selectedPerson : undefined
              }
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.payerSection}>
        <Typography variant="h3">Who paid? (optional)</Typography>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: !paidBy }}
          onPress={() => setPaidBy(undefined)}
          style={[styles.payerOption, !paidBy && styles.payerOptionSelected]}
        >
          <Typography variant="body" color={colors.textPrimary}>
            No individual payer
          </Typography>
          {!paidBy && (
            <MaterialDesignIcons
              name="check"
              size={20}
              color={colors.primary}
            />
          )}
        </Pressable>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: paidBy === SELF_ID }}
          onPress={() => selectPayer(SELF_ID)}
          style={[
            styles.payerOption,
            paidBy === SELF_ID && styles.payerOptionSelected,
          ]}
        >
          <Typography variant="body" color={colors.textPrimary}>
            You
          </Typography>
          {paidBy === SELF_ID && (
            <MaterialDesignIcons
              name="check"
              size={20}
              color={colors.primary}
            />
          )}
        </Pressable>
        {availablePayers.map((person) => {
          const isSelected = paidBy === person.id;
          return (
            <Pressable
              key={person.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => selectPayer(person.id)}
              style={[
                styles.payerOption,
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

      <Button
        variant="primary"
        fullWidth
        title={editingExpense ? "Save changes" : "Create expense"}
        onPress={saveExpense}
        disabled={!expenseName.trim()}
      />
      {editingExpense && (
        <Pressable
          accessibilityRole="button"
          onPress={confirmDeleteExpense}
          style={styles.deleteButton}
        >
          <Typography variant="label" color={colors.error}>
            Delete expense
          </Typography>
        </Pressable>
      )}
    </ScrollView>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  selectedPerson: {
    color: colors.error,
  },
  payerSection: {
    gap: spacing.xxs,
  },
  payerOption: {
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
  payerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  deleteButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: spacing.s,
  },
  pickerOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: spacing.s,
  },
  pickerCard: {
    width: "100%",
    maxWidth: 400,
    padding: spacing.l,
    gap: spacing.l,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  closeLabel: {
    color: colors.textSecondary,
    fontSize: 26,
    lineHeight: 30,
  },
});
