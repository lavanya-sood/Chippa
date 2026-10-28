import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { TextInput, Pressable, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface PersonProps {
  name: string;
  icon?: string;
  selected: boolean;
}

export default function Person({ name, icon, selected }: PersonProps) {
  return (
    <View style={styles.person}>
      <View
        style={[
          styles.selectedIcon,
          { borderColor: selected ? colors.primary : colors.background },
        ]}
      >
        <View style={styles.personIcon} />
      </View>
      <Typography
        variant={selected ? "h5" : "body"}
        style={[styles.personName]}
      >
        {name}
      </Typography>
    </View>
  );
}
