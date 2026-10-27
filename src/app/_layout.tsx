import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    "Fredoka-Regular": require("../../assets/fonts/Fredoka/static/Fredoka-Regular.ttf"),
    "Fredoka-Medium": require("../../assets/fonts/Fredoka/static/Fredoka-Medium.ttf"),
    "Fredoka-SemiBold": require("../../assets/fonts/Fredoka/static/Fredoka-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/addExpense" options={{ title: "Add Expense" }} />
        <Stack.Screen
          name="screens/addPerson"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
            gestureEnabled: false,
            title: "Add Person",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
