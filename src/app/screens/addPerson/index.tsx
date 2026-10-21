import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state";
import { generateShortId } from "@/utils/id";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPerson() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { people, addPerson } = usePeopleStore();
  const [newPerson, setNewPerson] = useState("");

  const addNewPerson = () => {
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
    <View
      style={[
        styles.overlay,
        {
          paddingTop: safeAreaInsets.top + spacing.s,
          paddingBottom: safeAreaInsets.bottom + spacing.s,
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Typography variant="h3">Add Person</Typography>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Text style={styles.closeLabel}>×</Text>
          </Pressable>
        </View>

        <TextField
          label="Name"
          value={newPerson}
          onChangeValue={setNewPerson}
          placeholder="Enter the name"
        />

        <Button
          variant="primary"
          fullWidth
          title="Add person"
          onPress={addNewPerson}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: spacing.s,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: spacing.l,
    gap: spacing.l,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  header: {
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
