import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore, useExpensesStore } from "@/state/stores";
import { SELF_PERSON_ID } from "@/constants/people";
import Dropdown, { type DropdownOption } from "@/components/Dropdown/Dropdown";
import { formatDate } from "@/utils/date";
import { Expense } from "@/types/models";
import { generateShortId } from "@/utils/id";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "./styles/style";

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
import AppHeader from "@/components/AppHeader/AppHeader";
import DatePicker from "@/components/DatePicker/DatePicker";
import Person from "@/components/Person/Person";

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
  const [paidBy, setPaidBy] = useState(() => editingExpense?.paidBy ?? "");
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
      setPaidBy("");
    }
  };

  const payerIcon = (
    avatarColor: string,
    iconName: "account" | "account-off-outline" = "account",
  ) => (
    <View style={[styles.payerAvatar, { backgroundColor: avatarColor }]}>
      <MaterialDesignIcons
        name={iconName}
        size={24}
        color={
          iconName === "account-off-outline"
            ? colors.textSecondary
            : colors.textPrimary
        }
      />
    </View>
  );

  const payerOptions: DropdownOption[] = [
    {
      value: "",
      label: "No payer assigned",
      description: "No individual selected",
      icon: payerIcon(colors.surface, "account-off-outline"),
    },
    {
      value: SELF_PERSON_ID,
      label: "You",
      description: "Paid for this expense",
      icon: payerIcon(colors.avatarPink),
    },
    ...availablePayers.map((person) => ({
      value: person.id,
      label: person.name,
      description: "Paid for this expense",
      icon: payerIcon(person.avatarColor ?? colors.avatarPink),
    })),
  ];

  const saveExpense = () => {
    const name = expenseName.trim();
    if (!name) return;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        name,
        date: date.toString(),
        people: [...new Set([SELF_PERSON_ID, ...peopleList])],
        paidBy: paidBy || undefined,
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
            <Typography variant="h4">People</Typography>
            <Typography variant="bodySmall" color={colors.textSecondary}>
              Select who was part of the expense
            </Typography>
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

          <Dropdown
            label="Who paid? (optional)"
            value={paidBy}
            options={payerOptions}
            onChange={setPaidBy}
            placeholder="Nothing selected"
            subheading="Select who paid for the expense"
          />
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
