import { useRouter } from "expo-router";
import { FlatList, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/Button";

import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { useTheme } from "@/hooks/use-theme";
import { usePeopleStore } from "@/state";

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { people } = usePeopleStore();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
  });

  return (
    <FlatList
      data={people}
      keyExtractor={(item, index) => `${index}-${item.name}`}
      renderItem={({ item }) => (
        <Typography variant="h4">{item.name}</Typography>
      )}
      ListHeaderComponent={<Typography variant="h1">People</Typography>}
      ListFooterComponent={
        <Button
          variant="primary"
          fullWidth
          title="Add people"
          onPress={() => router.push("/screens/addPerson")}
        />
      }
      contentContainerStyle={[
        styles.contentContainer,
        contentPlatformStyle,
        { paddingTop: insets.top },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.s,
    gap: spacing.s,
  },
});
