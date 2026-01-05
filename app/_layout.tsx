import { setupFocusManager } from "@/app/lib/focusManager";
import { setupOnlineManager } from "@/app/lib/onlineManager";
import { queryClient } from "@/app/lib/queryClient";
import { useAppStore } from "@/app/store/useAppStore";
import { useColorScheme } from "@/hooks/useColorScheme";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";
import { Text, TextProps } from "react-native";

/* ================================
   🔔 NOTIFICATIONS (GLOBAL)
================================ */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/* ================================
   🔄 REACT QUERY MANAGERS
================================ */

setupOnlineManager();
setupFocusManager();

/* ================================
   🚀 SPLASH SCREEN
================================ */

SplashScreen.preventAutoHideAsync();

/* ================================
   🎨 CONSTANTS
================================ */

const GREEN = "#093131";

/* ================================
   🧠 ROOT LAYOUT
================================ */

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrate = useAppStore((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Zustand hydration
  useEffect(() => {
    hydrate();
  }, []);

  // Hide splash screen when app is ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Keep splash screen visible until fonts load
  if (!fontsLoaded) {
    return null;
  }

  const screenOptions = {
    headerShown: false,
    headerShadowVisible: false,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={screenOptions} />
          <Stack.Screen name="(auth)" options={screenOptions} />
          <Stack.Screen name="splash" options={screenOptions} />
          <Stack.Screen name="(tabs)" options={screenOptions} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/* ================================
   ✍️ GLOBAL TEXT COMPONENTS
================================ */

export const AppText: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Inter_500Medium" }, style]}
    />
  );
};

export const AppTextBold: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Inter_700Bold" }, style]}
    />
  );
};
