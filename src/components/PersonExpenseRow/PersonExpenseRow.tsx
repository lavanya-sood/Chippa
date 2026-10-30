import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { Expense } from "@/types/models";
import { formatDate } from "@/utils/date";
import { getPersonExpenseShare } from "@/utils/expense";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import Avatar from "@/components/Avatar/Avatar";

interface PersonExpenseRowProps {
  expense: Expense;
  personId: string;
  personName: string;
  onPress: () => void;
}

export default function PersonExpenseRow({
  expense,
  personId,
  personName,
  onPress,
}: PersonExpenseRowProps) {
  const date = formatDate(expense.date);
  const share = getPersonExpenseShare(expense, personId);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${expense.name}, ${date}, ${personName}'s share $${share.toFixed(2)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Avatar
        icon={
          <MaterialDesignIcons
            name="receipt-text-outline"
            size={24}
            color={colors.primary}
          />
        }
        avatarColor={colors.primaryLight}
      />
      <View style={styles.details}>
        <Typography variant="h6" numberOfLines={1}>
          {expense.name}
        </Typography>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          {date}
        </Typography>
      </View>
      <View style={styles.share}>
        <Typography variant="h6">${share.toFixed(2)}</Typography>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          {personName}'s share
        </Typography>
      </View>
      <MaterialDesignIcons
        name="chevron-right"
        size={24}
        color={colors.textTertiary}
      />
    </Pressable>
  );
}
