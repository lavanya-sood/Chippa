import { useExpensesStore } from "@/state/index";
import { Expense, Person } from "@/types/index";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddExpense() {
  const router = useRouter();

  const [expenseName, setExpenseName] = useState("");
  const safeAreaInsets = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState<boolean>(false);

  const [newPerson, setNewPerson] = useState("");
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [isAddingPerson, setIsAddingPerson] = useState(false);

  const { expenses, addExpense } = useExpensesStore();
  // const addExpense = useExpensesStore((state) => state.addExpense);

  console.log("peopleList", peopleList);
  console.log(isAddingPerson);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // On Android, dismissing the picker returns an 'dismissed' event
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    const currentDate = selectedDate || date;

    // For iOS, the unified modal handles everything or inline selections persist.
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
    } else {
      setDate(currentDate);
    }
  };

  const showPicker = (currentMode: "date" | "time") => {
    setShow(true);
    setMode(currentMode);
  };

  // Format date output into a localized readable string
  const formatDateTime = (dateTime: Date) => {
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const addNewPersonDone = () => {
    console.log("running this");
    const personValue = newPerson.trim();

    if (personValue.length === 0) return;

    const personId = generateShortId(peopleList.length);

    setPeopleList((prev) => [
      ...prev,
      { id: personId, name: personValue, expenses: [] },
    ]);
    setNewPerson("");
    setIsAddingPerson(false);
  };

  const addPerson = () => {
    setIsAddingPerson(true);
  };

  const generateShortId = (index: number) => {
    // Generates something like: "0-k4z2"
    return `${index}-${Math.random().toString(36).substring(2, 6)}`;
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
    <View style={[styles.container, { marginTop: safeAreaInsets.top }]}>
      <Text> Add Expense </Text>
      <View>
        <Text> Expense name </Text>
        <TextInput
          style={styles.input}
          onChangeText={setExpenseName}
          value={expenseName}
          placeholder="name your expense"
        />
      </View>
      <View>
        <Text> Date </Text>
        {/* Pressable wrapper acts as the tap trigger over the input */}
        <Pressable onPress={() => showPicker("date")}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              value={formatDateTime(date)}
              editable={false}
              placeholder="Select date and time"
            />
          </View>
        </Pressable>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            // Use 'datetime' on iOS for single workflow, fallback to sequential mode on Android
            mode={Platform.OS === "ios" ? "datetime" : mode}
            is24Hour={true}
            onChange={onChange}
            display={Platform.OS === "ios" ? "spinner" : "default"}
          />
        )}
      </View>
      <View>
        <Text> People</Text>
        <FlatList
          data={peopleList}
          keyExtractor={(item, index) => `${index}-${item}`}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
        {isAddingPerson ? (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={setNewPerson}
              value={newPerson}
              placeholder="useless placeholder"
            />
            <Pressable onPress={addNewPersonDone}>
              <Text> Done </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={addPerson}>
            <Text> Add people </Text>
          </Pressable>
        )}
      </View>
      <Pressable onPress={createExpense}>
        <Text> Create expense</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "row",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
