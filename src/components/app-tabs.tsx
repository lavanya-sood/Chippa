import { NativeTabs } from "expo-router/unstable-native-tabs";

import { colors } from "@/foundation/colors";

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.primary}
      tintColor={colors.primary}
      labelStyle={{ selected: { color: colors.textPrimary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home_filled" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="people">
        <NativeTabs.Trigger.Label>People</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.3", selected: "person.3.fill" }}
          md={{ default: "group", selected: "groups" }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md={{ default: "person", selected: "person" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
