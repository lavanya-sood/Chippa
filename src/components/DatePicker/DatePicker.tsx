import TextField from "@/components/TextField/TextField";
import { Typography } from "@/foundation/Typography";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import Button from "@/components/Button/Button";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@/foundation/spacing";
import { formatDate } from "@/utils/date";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Modal, Platform, Text } from "react-native";

interface DatePickerProps {
  onPickerPress: () => void;
  dateValue: Date;
  show: boolean;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
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
            mode="date"
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
                <Typography variant="h3">Select date</Typography>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close date picker"
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
                mode="date"
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
