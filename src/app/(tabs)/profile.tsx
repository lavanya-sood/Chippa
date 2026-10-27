import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state";

export default function ProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const people = usePeopleStore((state) => state.people);
  const clearPeople = usePeopleStore((state) => state.clearPeople);
  const expenses = useExpensesStore((state) => state.expenses);
  const clearExpenses = useExpensesStore((state) => state.clearExpenses);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: safeAreaInsets.top + spacing.base,
          paddingBottom: safeAreaInsets.bottom + spacing.base,
        },
      ]}
    >
      <Typography variant="h1">Profile</Typography>
      {__DEV__ && (
        <View style={styles.debugMenu}>
          <Typography variant="h3">Developer debug menu</Typography>
          <Typography variant="body">
            People stored: {people.length}
          </Typography>
          <Button
            title="Clear people"
            variant="outline"
            fullWidth
            onPress={clearPeople}
          />
          <Button
            title="Log people"
            variant="secondary"
            fullWidth
            onPress={() => console.log("People:", people)}
          />
          <Typography variant="body">
            Expenses stored: {expenses.length}
          </Typography>
          <Button
            title="Clear expenses"
            variant="outline"
            fullWidth
            onPress={clearExpenses}
          />
          <Button
            title="Log expenses"
            variant="secondary"
            fullWidth
            onPress={() => console.log("Expenses:", expenses)}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  debugMenu: {
    gap: spacing.s,
    padding: spacing.base,
    borderRadius: spacing.base,
    backgroundColor: colors.surface,
  },
});
