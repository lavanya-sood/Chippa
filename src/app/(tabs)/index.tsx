import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useExpensesStore from "@/state/index";

export default function HomeScreen() {
  const router = useRouter();
  const { expenses } = useExpensesStore();

  console.log(expenses);

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "Fredoka", fontSize: 24, fontWeight: "600" }}>
        Home
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/screens/addExpense")}
      >
        <Text> Create expenses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "pink",
    padding: 12,
    marginTop: 12,
  },
});
