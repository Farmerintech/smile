import "@/global.css";
import { useEffect } from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

import setupFocusManager from "@/app/lib/focusManager";
import setupOnlineManager from "@/app/lib/onlineManager";
import { queryClient } from "@/app/lib/queryClient";
import { useAppStore } from "@/app/store/useAppStore";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import {
  handleNotificationNavigation,
  registerForPushNotifications,
  setupAndroidChannel,
  setupNotificationHandler,
} from "@/app/lib/pushNotifications";

import PushTokenSaver from "@/components/pushToken";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

/* ================================
   🔔 ONE-TIME PUSH SETUP
================================*/
setupNotificationHandler();
setupAndroidChannel();

/* ================================
   🔄 REACT QUERY
================================*/
setupOnlineManager();
setupFocusManager();

/* ================================
   🧠 PUSH NAVIGATION HANDLER
================================*/
type RootStackParamList = {
  trackOrder: { orderId: string };
};

function PushNavigationHandler() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data =
          response.notification.request.content.data ?? {};

        handleNotificationNavigation(data, orderId => {
          navigation.navigate("trackOrder", { orderId });
        });
      });

    // Cold start (app killed)
    Notifications.getLastNotificationResponseAsync().then(response => {
      const data =
        response?.notification.request.content.data ?? {};

      handleNotificationNavigation(data, orderId => {
        navigation.navigate("trackOrder", { orderId });
      });
    });

    return () => subscription.remove();
  }, [navigation]);

  return null;
}
useEffect(() => {
  registerForPushNotifications();
}, []);

/* ================================
   🚀 ROOT LAYOUT
================================*/
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const user = useAppStore(s => s.user);
  const hasCompletedOnboarding = useAppStore(
    s => s.hasCompletedOnboarding
  );
  const hydrate = useAppStore(s => s.hydrate);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Hydrate Zustand
  useEffect(() => {
    hydrate();
  }, []);

  // Hide splash only when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Initial routing logic
  useEffect(() => {
    if (!fontsLoaded) return;

    if (!hasCompletedOnboarding) {
      router.replace("/(onboarding)");
      return;
    }

    if (!user || !user.email) {
      router.replace("/(auth)/signin");
      return;
    }

    router.replace("/(tabs)/home");
  }, [fontsLoaded, hasCompletedOnboarding, user]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer} />
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={
            colorScheme === "dark" ? DarkTheme : DefaultTheme
          }
        >
          <Stack
            screenOptions={{
              headerShown: false,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
          </Stack>
          <PushTokenSaver/>
          {/* 🔔 Push listener lives once at root */}
          <PushNavigationHandler />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/* ================================
   ✍️ GLOBAL TEXT COMPONENTS
================================*/
export const AppText: React.FC<TextProps> = ({
  style,
  ...props
}) => (
  <Text
    {...props}
    style={[{ fontFamily: "Inter_500Medium" }, style]}
  />
);

export const AppTextBold: React.FC<TextProps> = ({
  style,
  ...props
}) => (
  <Text
    {...props}
    style={[{ fontFamily: "Inter_700Bold" }, style]}
  />
);

/* ================================
   🖌 STYLES
================================*/
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#093131",
  },
});
