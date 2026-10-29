import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { Pressable, View } from "react-native";
import { styles } from "./styles/styles";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

interface AppHeaderProps {
  title: string;
  onBackPress: () => void;
  rightIcon?: React.ReactNode;
}

const BACK_ICON_SIZE = 40;

export default function AppHeader({
  title,
  onBackPress,
  rightIcon,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress}>
        <MaterialDesignIcons
          name="chevron-left"
          size={BACK_ICON_SIZE}
          color={colors.black}
        />
      </Pressable>
      <Typography variant="h3">{title}</Typography>
      <View>{rightIcon}</View>
    </View>
  );
}
