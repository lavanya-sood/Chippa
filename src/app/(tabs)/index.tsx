import Button from "@/components/Button";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore } from "@/state/index";
import { useRouter } from "expo-router";
import { FlatList, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { expenses } = useExpensesStore();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });

  console.log(expenses);

  return (
    // <ScrollView contentContainerStyle={styles.container}>
    //   <Typography variant="h1">Home</Typography>

    //   <View style={styles.buttonGroup}>
    //     <Button
    //       variant="primary"
    //       fullWidth
    //       title={"Create Expense"}
    //       onPress={() => router.push("/screens/addExpense")}
    //     />
    //   </View>

    // </ScrollView>
    <FlatList
      data={expenses}
      keyExtractor={(item, index) => `${index}-${item.name}`}
      renderItem={({ item }) => (
        <Typography variant="h4">{item.name}</Typography>
      )}
      ListHeaderComponent={<Typography variant="h1">Expenses</Typography>}
      ListFooterComponent={
        <Button
          variant="primary"
          fullWidth
          title="Add expense"
          onPress={() => router.push("/screens/addExpense")}
        />
      }
      contentContainerStyle={[
        styles.contentContainer,
        contentPlatformStyle,
        { paddingTop: insets.top },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: colors.background,
  // },
  contentContainer: {
    // flexDirection: "row",
    // justifyContent: "center",
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.s,
    gap: spacing.s,
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
