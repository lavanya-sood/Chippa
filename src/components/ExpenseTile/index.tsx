import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { TextInput, Pressable, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface ExpenseTileProps {
  id: string;
  onPress: () => void;
  name: string;
  amount: string;
  date: string;
  people: string[];
}

export default function ExpenseTile({
  id,
  onPress,
  name,
  amount,
  date,
  people,
}: ExpenseTileProps) {
  return (
    <Pressable
      style={styles.expenseTile}
      key={id}
      accessibilityRole="button"
      onPress={onPress}
    >
      <View style={styles.icon}></View>
      <View style={styles.details}>
        <View style={styles.headingDetails}>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="h6">${amount}</Typography>
        </View>
        <Typography variant="bodySmall" style={styles.subtitle}>
          {date} • {people.length} people
        </Typography>
        <View style={styles.footer}>
          <View style={styles.peopleIconList}>
            {people.map((p) => (
              <View key={p} style={styles.personIcon} />
            ))}
          </View>
          <MaterialDesignIcons
            name="chevron-right"
            size={24}
            color={colors.textPrimary}
          />
        </View>
      </View>
    </Pressable>
  );
}
