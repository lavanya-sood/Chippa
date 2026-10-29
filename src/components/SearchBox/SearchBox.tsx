import { TextInput, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { colors } from "@/foundation/colors";
import { styles } from "./styles/styles";

interface SearchBoxProps {
  searchValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

export default function SearchBox({
  searchValue,
  onChange,
  placeholder = "Search people",
  accessibilityLabel = "Search people",
}: SearchBoxProps) {
  return (
    <View style={styles.searchBox}>
      <MaterialDesignIcons
        name="magnify"
        size={22}
        color={colors.textSecondary}
      />
      <TextInput
        accessibilityLabel={accessibilityLabel}
        value={searchValue}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        style={styles.searchInput}
      />
    </View>
  );
}
