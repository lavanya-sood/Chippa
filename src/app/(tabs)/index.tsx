import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore } from "@/state/index";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { expenses } = useExpensesStore();

  console.log(expenses);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Typography variant="h1">Home</Typography>

      <View style={styles.buttonGroup}>
        <Button
          variant="primary"
          fullWidth
          title={"Create Expense"}
          onPress={() => router.push("/screens/addExpense")}
        />
      </View>
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
  buttonGroup: {
    width: "100%",
    paddingHorizontal: spacing.l,
    alignItems: "center",
    gap: 8,
    flexDirection: "column",
  },
});
