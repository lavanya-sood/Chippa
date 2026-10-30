import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { Person } from "@/types/models";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { generateInitials } from "@/utils/people";
import Avatar from "@/components/Avatar/Avatar";

type ExpenseParticipant = Pick<Person, "id" | "name" | "avatarColor">;

interface ExpenseTileProps {
  id: string;
  onPress: () => void;
  name: string;
  amount: string;
  date: string;
  people: ExpenseParticipant[];
  peopleCount: number;
}

export default function ExpenseTile({
  id,
  onPress,
  name,
  amount,
  date,
  people,
  peopleCount,
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
          {date} • {peopleCount} people
        </Typography>
        <View style={styles.footer}>
          <View style={styles.peopleIconList}>
            {people.map((person) => (
              <Avatar
                key={person.id}
                avatarColor={person.avatarColor}
                name={person.name}
                size="small"
              />
            ))}
          </View>

          <MaterialDesignIcons
            name="chevron-right"
            size={24}
            color={colors.textTertiary}
          />
        </View>
      </View>
    </Pressable>
  );
}
