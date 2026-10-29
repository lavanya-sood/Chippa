import AppHeader from "@/components/AppHeader/AppHeader";
import Button from "@/components/Button/Button";
import Person from "@/components/Person/Person";
import TextField from "@/components/TextField/TextField";
import { colors, personAvatarColors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state/stores";
import type { Person as PersonModel } from "@/types/models";
import { generateShortId } from "@/utils/id";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPerson() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  const people = usePeopleStore((state) => state.people);
  const addPerson = usePeopleStore((state) => state.addPerson);
  const updatePerson = usePeopleStore((state) => state.updatePerson);
  const existingPerson = people.find((person) => person.id === personId);
  const [newPerson, setNewPerson] = useState(
    () => existingPerson?.name ?? "",
  );
  const [notes, setNotes] = useState(() => existingPerson?.notes ?? "");
  const [avatarColor, setAvatarColor] = useState(
    () => existingPerson?.avatarColor ?? personAvatarColors[0].color,
  );

  const savePerson = () => {
    const personValue = newPerson.trim();

    if (personValue.length === 0) return;

    if (existingPerson) {
      updatePerson(existingPerson.id, {
        name: personValue,
        notes: notes.trim(),
        avatarColor,
      });
    } else {
      const newPersonItem: PersonModel = {
        id: generateShortId(people.length),
        name: personValue,
        expenses: [],
        notes: notes.trim(),
        avatarColor,
      };
      addPerson(newPersonItem);
    }
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
        <AppHeader
          title={existingPerson ? "Edit person" : "Add person"}
          onBackPress={() => router.back()}
        />

        <View style={styles.form}>
          <TextField
            label="Name"
            value={newPerson}
            onChangeValue={setNewPerson}
            placeholder="Enter the name"
          />

          <View>
            <Typography variant="label">Notes (optional)</Typography>
            <TextInput
              accessibilityLabel="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Work friend, roommate, family etc."
              placeholderTextColor={colors.textDisabled}
              multiline
              textAlignVertical="top"
              style={styles.notesInput}
            />
          </View>

          <View style={styles.colorSection}>
            <Typography variant="label">Avatar colour</Typography>
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
          title={existingPerson ? "Save changes" : "Add person"}
          onPress={savePerson}
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
  notesInput: {
    minHeight: 120,
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontFamily: "Fredoka-Regular",
    fontSize: 16,
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
