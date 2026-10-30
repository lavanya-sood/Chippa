import AppHeader from "@/components/AppHeader/AppHeader";
import Button from "@/components/Button/Button";
import PersonExpenseRow from "@/components/PersonExpenseRow/PersonExpenseRow";
import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import { getExpensesForPerson } from "@/utils/expense";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles/style";
import { generateInitials } from "@/utils/people";
export default function PersonProfileScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = usePeopleStore((state) =>
    state.people.find((item) => item.id === id),
  );
  const expenses = useExpensesStore((state) => state.expenses);
  const removePerson = usePeopleStore((state) => state.removePerson);

  const usedInExpenses = person
    ? getExpensesForPerson(expenses, person.id)
    : [];

  const confirmDelete = () => {
    if (!person) return;

    Alert.alert(
      "Delete person?",
      `This will remove ${person.name} from your people list.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removePerson(person.id);
            router.back();
          },
        },
      ],
    );
  };

  if (!person) {
    return (
      <View
        style={[
          styles.screen,
          styles.missingPerson,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        <Typography variant="h5">Person not found</Typography>
        <Button
          title="Back to people"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: safeAreaInsets.top,
        },
      ]}
    >
      <AppHeader
        title=""
        onBackPress={() => router.back()}
        rightIcon={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit expense"
            onPress={() =>
              router.push({
                pathname: "/screens/addPerson",
                params: { personId: person.id },
              })
            }
            style={styles.editButton}
          >
            <MaterialDesignIcons
              name="pencil-outline"
              size={28}
              color={colors.black}
            />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={[styles.content]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: person.avatarColor ?? colors.avatarPink },
            ]}
          >
            <Typography
              variant="h1"
              color={getPersonAvatarTextColor(person.avatarColor)}
            >
              {generateInitials(person.name)}
            </Typography>
          </View>
          <Typography variant="h2" style={styles.name}>
            {person.name}
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {person.notes?.trim() || "No notes yet"}
          </Typography>
        </View>

        <View style={styles.splitsSection}>
          <View style={styles.splitsHeading}>
            <Typography variant="h4">Splits with {person.name}</Typography>
            {usedInExpenses.length > 3 && (
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/screens/expenses",
                    params: { personId: person.id },
                  })
                }
                style={({ pressed }) => [
                  styles.seeAllButton,
                  pressed && styles.pressed,
                ]}
              >
                <Typography variant="bodySmall" color={colors.primary}>
                  See all
                </Typography>
              </Pressable>
            )}
          </View>
          {usedInExpenses.length > 0 ? (
            <View style={styles.splitsCard}>
              {usedInExpenses.slice(0, 3).map((expense, index) => (
                <View key={expense.id}>
                  {index > 0 && <View style={styles.splitSeparator} />}
                  <PersonExpenseRow
                    expense={expense}
                    personId={person.id}
                    personName={person.name}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/expense/[id]",
                        params: { id: expense.id },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          ) : (
            <Typography variant="body" color={colors.textSecondary}>
              No splits with {person.name} yet.
            </Typography>
          )}
        </View>
      </ScrollView>
      <View
        style={[
          styles.createFooter,
          { paddingBottom: safeAreaInsets.bottom + spacing.base },
        ]}
      >
        <Button
          variant="secondary"
          title={`Create a new split with ${person.name}`}
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </View>
    </View>
  );
}
