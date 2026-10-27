import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore, useExpensesStore } from "@/state";
import { timeAgo, formatDate } from "@/utils/date";
import { Expense } from "@/types/index";
import { generateShortId } from "@/utils/id";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddExpense() {
  const router = useRouter();

  const [expenseName, setExpenseName] = useState("");
  const safeAreaInsets = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(new Date());
  const [pickerDate, setPickerDate] = useState<Date>(date);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState<boolean>(false);
  const [peopleList, setPeopleList] = useState<string[]>([]);

  const { expenses, addExpense } = useExpensesStore();
  const { people } = usePeopleStore();

  console.log("peopleList", peopleList);

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
    setPeopleList((prev) =>
      prev.includes(id)
        ? prev.filter((personId) => personId !== id)
        : [...prev, id],
    );
  };

  const createExpense = () => {
    console.log("CREAT EXPENSE WITH");

    const index = expenses.length;

    const expenseItem: Expense = {
      id: generateShortId(index),
      name: expenseName,
      date: date.toString(),
      people: peopleList,
      paidBy: "123",
      items: [],
    };

    console.log(expenseItem);

    addExpense(expenseItem);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <Typography variant="h2">Create new expense</Typography>

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
        <Text> People</Text>
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => selectPerson(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: peopleList.includes(item.id) }}
            >
              <Text
                style={
                  peopleList.includes(item.id)
                    ? styles.selectedPerson
                    : undefined
                }
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <Button
        variant="primary"
        fullWidth
        title="Create expense"
        onPress={createExpense}
      />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  selectedPerson: {
    color: colors.error,
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
