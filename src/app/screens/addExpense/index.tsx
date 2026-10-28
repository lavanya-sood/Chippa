import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore, useExpensesStore } from "@/state";
import { SELF_PERSON_ID } from "@/constants/people";
import { formatDate } from "@/utils/date";
import { Expense } from "@/types/index";
import { generateShortId } from "@/utils/id";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "./styles";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import AppHeader from "@/components/AppHeader";
import DatePicker from "@/components/DatePicker";
import Person from "@/components/Person";

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
  const [isPayerMenuOpen, setIsPayerMenuOpen] = useState(false);
  const { people } = usePeopleStore();
  const availablePayers = people.filter((person) =>
    peopleList.includes(person.id),
  );
  const selectedPayer =
    paidBy === SELF_PERSON_ID
      ? { name: "You" }
      : availablePayers.find((person) => person.id === paidBy);

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

  const selectPayer = (id?: string) => {
    setPaidBy(id);
    setIsPayerMenuOpen(false);
  };

  const saveExpense = () => {
    const name = expenseName.trim();
    if (!name) return;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        name,
        date: date.toString(),
        people: [...new Set([SELF_PERSON_ID, ...peopleList])],
        paidBy,
      });
    } else {
      const expenseItem: Expense = {
        id: generateShortId(expenses.length),
        name,
        date: date.toString(),
        total: 0,
        people: [...new Set([SELF_PERSON_ID, ...peopleList])],
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
    <View style={[styles.screen, { paddingTop: safeAreaInsets.top }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <AppHeader
          title={editingExpense ? "Edit expense" : "New expense"}
          onBackPress={goBack}
        />

        <View style={styles.form}>
          <TextField
            label="Expense name"
            value={expenseName}
            onChangeValue={setExpenseName}
            placeholder="Enter the expense name"
          />

          <DatePicker
            onPickerPress={() => showPicker("date")}
            dateValue={date}
            show={show}
            onChange={onChange}
            mode={mode}
            onRequestClose={() => setShow(false)}
            pickerDate={pickerDate}
            savePickerDate={savePickerDate}
            onPickerClose={() => setShow(false)}
          />

          <View>
            <Typography variant="label">People</Typography>
            <View>
              <ScrollView
                horizontal
                style={styles.peopleList}
                contentContainerStyle={styles.peopleListContent}
              >
                <Person name={"You"} selected={true} />
                {people.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => selectPerson(item.id)}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: peopleList.includes(item.id),
                    }}
                  >
                    <Person
                      name={item.name}
                      avatarColor={item.avatarColor}
                      selected={peopleList.includes(item.id)}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.payerSection}>
            <Typography variant="label">Who paid? (optional)</Typography>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                selectedPayer
                  ? `Payer: ${selectedPayer.name}`
                  : "Select a payer"
              }
              accessibilityState={{ expanded: isPayerMenuOpen }}
              onPress={() => setIsPayerMenuOpen((isOpen) => !isOpen)}
              style={styles.payerDropdown}
            >
              <View style={styles.payerAvatar}>
                <MaterialDesignIcons
                  name="account"
                  size={24}
                  color={colors.textPrimary}
                />
              </View>
              <View style={styles.payerDropdownText}>
                <Typography variant="body">
                  {selectedPayer?.name ?? "Select a payer"}
                </Typography>
                <Typography variant="bodySmall" color={colors.textSecondary}>
                  {selectedPayer
                    ? "Paid for this expense"
                    : "No payer selected"}
                </Typography>
              </View>
              <MaterialDesignIcons
                name={isPayerMenuOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color={colors.textSecondary}
              />
            </Pressable>
            {isPayerMenuOpen && (
              <View style={styles.payerOptions}>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityLabel="No payer selected"
                  accessibilityState={{ selected: paidBy === undefined }}
                  onPress={() => selectPayer(undefined)}
                  style={styles.payerOption}
                >
                  <View style={styles.payerAvatar}>
                    <MaterialDesignIcons
                      name="account-off-outline"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </View>
                  <Typography variant="body">No payer</Typography>
                </Pressable>
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: paidBy === SELF_PERSON_ID }}
                  onPress={() => selectPayer(SELF_PERSON_ID)}
                  style={[
                    styles.payerOption,
                    paidBy === SELF_PERSON_ID && styles.payerOptionSelected,
                  ]}
                >
                  <View style={styles.payerAvatar}>
                    <MaterialDesignIcons
                      name="account"
                      size={24}
                      color={colors.textPrimary}
                    />
                  </View>
                  <Typography variant="body">You</Typography>
                </Pressable>
                {availablePayers.map((person) => (
                  <Pressable
                    key={person.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: paidBy === person.id }}
                    onPress={() => selectPayer(person.id)}
                    style={[
                      styles.payerOption,
                      paidBy === person.id && styles.payerOptionSelected,
                    ]}
                  >
                    <View style={styles.payerAvatar}>
                      <MaterialDesignIcons
                        name="account"
                        size={24}
                        color={colors.textPrimary}
                      />
                    </View>
                    <Typography variant="body">{person.name}</Typography>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: safeAreaInsets.bottom + spacing.base },
        ]}
      >
        <Button
          variant="primary"
          fullWidth
          title={editingExpense ? "Save changes" : "Create expense"}
          onPress={saveExpense}
          disabled={!expenseName.trim()}
        />
        {editingExpense && (
          <Button
            variant="delete"
            fullWidth
            title={"Delete expense"}
            onPress={confirmDeleteExpense}
          />
        )}
      </View>
    </View>
  );
}
