import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import Person from "@/components/Person";
import TextField from "@/components/TextField";
import { colors, personAvatarColors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state";
import type { Person as PersonModel } from "@/types";
import { generateShortId } from "@/utils/id";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPerson() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { people, addPerson } = usePeopleStore();
  const [newPerson, setNewPerson] = useState("");
  const [avatarColor, setAvatarColor] = useState(
    personAvatarColors[0].color,
  );

  const addNewPerson = () => {
    const personValue = newPerson.trim();

    if (personValue.length === 0) return;

    const newPersonItem: PersonModel = {
      id: generateShortId(people.length),
      name: personValue,
      expenses: [],
      avatarColor,
    };
    addPerson(newPersonItem);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, { paddingTop: safeAreaInsets.top }]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Add person" onBackPress={() => router.back()} />

        <View style={styles.form}>
          <TextField
            label="Name"
            value={newPerson}
            onChangeValue={setNewPerson}
            placeholder="Enter the name"
          />

          <View style={styles.colorSection}>
            <Typography variant="label">Icon colour</Typography>
            <View style={styles.preview}>
              <Person
                name={newPerson.trim() || "Preview"}
                avatarColor={avatarColor}
                selected
              />
            </View>
            <View style={styles.colorOptions}>
              {personAvatarColors.map(({ name, color }) => {
                const isSelected = avatarColor === color;
                return (
                  <Pressable
                    key={color}
                    accessibilityRole="radio"
                    accessibilityLabel={`${name} avatar colour`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setAvatarColor(color)}
                    style={[
                      styles.colorOption,
                      isSelected && styles.colorOptionSelected,
                    ]}
                  >
                    <View
                      style={[styles.colorSwatch, { backgroundColor: color }]}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: safeAreaInsets.bottom + spacing.base },
        ]}
      >
        <Button
          variant="primary"
          fullWidth
          title="Add person"
          onPress={addNewPerson}
          disabled={!newPerson.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  form: {
    marginTop: spacing.base,
    gap: spacing.l,
  },
  colorSection: {
    gap: spacing.s,
  },
  preview: {
    alignItems: "flex-start",
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.s,
  },
  colorOption: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: colors.primary,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.s,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
