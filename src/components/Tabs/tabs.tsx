import { Pressable, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { colors } from "@/foundation/colors";
import { styles } from "./styles/styles";

import { Typography } from "@/foundation/Typography";

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
}

export default function Tabs<T extends string>({
  tabs,
  activeTab,
  setActiveTab,
}: TabsProps<T>) {
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, isSelected && styles.selectedTab]}
          >
            <Typography
              variant="h5"
              color={isSelected ? colors.textPrimary : colors.textSecondary}
              style={isSelected ? styles.selectedTabLabel : undefined}
            >
              {tab}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
