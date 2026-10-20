import { colors } from "@/foundation/colors";
import { useExpensesStore } from "@/state/index";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { expenses } = useExpensesStore();

  console.log(expenses);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontFamily: "Fredoka", fontSize: 28, fontWeight: "600" }}>
        Home
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/screens/addExpense")}
      >
        <Text> Create expenses</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: "pink",
    padding: 12,
    marginTop: 12,
  },
});
