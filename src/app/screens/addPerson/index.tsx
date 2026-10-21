import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { usePeopleStore } from "@/state";
import { generateShortId } from "@/utils/id";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddExpense() {
  const router = useRouter();

  const safeAreaInsets = useSafeAreaInsets();

  const { people, addPerson } = usePeopleStore();

  const [newPerson, setNewPerson] = useState("");

  const addNewPerson = () => {
    console.log("running this");
    const personValue = newPerson.trim();

    if (personValue.length === 0) return;

    const personId = generateShortId(people.length);

    const newPersonItem = {
      id: personId,
      name: personValue,
      expenses: [],
    };
    addPerson(newPersonItem);
    setNewPerson("");

    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <Text> Add People </Text>
      <View>
        <Text> Name </Text>
        <TextInput
          style={styles.input}
          onChangeText={setNewPerson}
          value={newPerson}
          placeholder="name your expense"
        />
      </View>

      {/* <Pressable onPress={addNewPerson}>
        <Text> Add person </Text>
      </Pressable> */}
      <Button
        variant="primary"
        fullWidth
        title={"Add people"}
        onPress={addNewPerson}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "row",
    backgroundColor: colors.background,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
