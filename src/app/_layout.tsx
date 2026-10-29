import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import { useExpensesStore, usePeopleStore } from "@/state/stores";
import {
  getHydrationError,
  subscribeToHydrationError,
} from "@/state/persistence";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [storesHydrated, setStoresHydrated] = useState(false);
  const [hydrationError, setHydrationError] = useState<unknown>(null);
  const [fontsLoaded, fontError] = useFonts({
    "Fredoka-Regular": require("../../assets/fonts/Fredoka/static/Fredoka-Regular.ttf"),
    "Fredoka-Medium": require("../../assets/fonts/Fredoka/static/Fredoka-Medium.ttf"),
    "Fredoka-SemiBold": require("../../assets/fonts/Fredoka/static/Fredoka-SemiBold.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded && storesHydrated) || fontError || hydrationError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, storesHydrated, hydrationError]);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeToHydrationError((error) => {
      if (active) {
        setHydrationError(error);
      }
    });

    const hydrateStores = async () => {
      try {
        await Promise.all([
          usePeopleStore.persist.rehydrate(),
          useExpensesStore.persist.rehydrate(),
        ]);
        const error = getHydrationError();

        if (active) {
          if (error) {
            setHydrationError(error);
          } else {
            setStoresHydrated(true);
          }
        }
      } catch (error) {
        if (active) {
          setHydrationError(error);
        }
      }
    };

    void hydrateStores();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (fontError) {
    throw fontError;
  }

  if (hydrationError) {
    const message =
      hydrationError instanceof Error
        ? hydrationError.message
        : String(hydrationError);

    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>Could not load saved app data: {message}</Text>
      </View>
    );
  }

  if (!fontsLoaded || !storesHydrated) {
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
            title: "Add Person",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
