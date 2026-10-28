import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { TextInput, Pressable, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface AppHeaderProps {
  title: string;
  onBackPress: () => void;
}

export default function AppHeader({ title, onBackPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress}>
        <MaterialDesignIcons name="chevron-left" size={40} color="black" />
      </Pressable>
      <Typography variant="h3">{title}</Typography>
      <View></View>
    </View>
  );
}
