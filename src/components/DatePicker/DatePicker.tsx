import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { TextInput, Pressable, TextInputProps, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import Button from "@/components/Button/Button";

import { useExpensesStore } from "@/state/stores";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { timeAgo } from "@/utils/date";
import ExpenseTile from "@/components/ExpenseTile/ExpenseTile";

import TextField from "@/components/TextField/TextField";

import { spacing } from "@/foundation/spacing";
import { usePeopleStore } from "@/state/stores";
import { SELF_PERSON_ID } from "@/constants/people";
import { formatDate } from "@/utils/date";
import { Expense } from "@/types/models";
import { generateShortId } from "@/utils/id";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { Alert, Modal, Platform, Text } from "react-native";

interface DatePickerProps {
  onPickerPress: () => void;
  dateValue: Date;
  show: boolean;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  mode: "date" | "time";
  onRequestClose: () => void;
  pickerDate: Date;
  savePickerDate: () => void;
  onPickerClose: () => void;
}

export default function DatePicker({
  onPickerPress,
  dateValue,
  show,
  onChange,
  mode,
  onRequestClose,
  pickerDate,
  savePickerDate,
  onPickerClose,
}: DatePickerProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <>
      <View>
        <Pressable onPress={onPickerPress}>
          <View pointerEvents="none">
            <TextField
              label="Date"
              value={formatDate(dateValue)}
              onChangeValue={() => {}}
              placeholder="Enter the expense name"
              editable={false}
            />
          </View>
        </Pressable>
        {show && Platform.OS === "android" && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateValue}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            display="default"
          />
        )}
      </View>
      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={onRequestClose}
        >
          <View
            style={[
              styles.pickerOverlay,
              {
                paddingTop: safeAreaInsets.top + spacing.s,
                paddingBottom: safeAreaInsets.bottom + spacing.s,
              },
            ]}
          >
            <View style={styles.pickerCard}>
              <View style={styles.pickerHeader}>
                <Typography variant="h3">Select date and time</Typography>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close date and time picker"
                  hitSlop={8}
                  onPress={onPickerClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeLabel}>×</Text>
                </Pressable>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={pickerDate}
                mode="datetime"
                is24Hour={true}
                onChange={onChange}
                display="spinner"
              />
              <Button
                variant="primary"
                fullWidth
                title="Done"
                onPress={savePickerDate}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
