import { colors, getPersonAvatarTextColor } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import type { Person } from "@/types/models";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

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
              <View
                key={person.id}
                style={[
                  styles.personIcon,
                  {
                    backgroundColor: person.avatarColor ?? colors.avatarPink,
                  },
                ]}
              >
                <Typography
                  variant="h7"
                  color={getPersonAvatarTextColor(person.avatarColor)}
                >
                  {person.name.trim().charAt(0).toUpperCase()}
                </Typography>
              </View>
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
