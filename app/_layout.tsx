import "@/global.css";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, TextProps, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";

import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";

import setupFocusManager from "@/app/lib/focusManager";
import setupOnlineManager from "@/app/lib/onlineManager";
import { queryClient } from "@/app/lib/queryClient";
import { useAppStore } from "@/app/store/useAppStore";

import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

/* ================================
   🔔 NOTIFICATIONS SETUP
================================*/

// Foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // shows the banner (iOS)
    shouldShowList: true,     // adds it to notification center (iOS 14+)
    shouldPlaySound: true,    // plays default sound
    shouldSetBadge: true,     // updates app badge
  }),
});


// Android notification channel
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

// Optional: log notifications in foreground
Notifications.addNotificationReceivedListener(notification => {
  console.log("Foreground notification received:", notification);
});

/* ================================
   🔄 REACT QUERY
================================*/
setupOnlineManager();
setupFocusManager();

/* ================================
   🧠 PUSH HANDLER COMPONENT
================================*/
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

type RootStackParamList = {
  trackOrder: { orderId: string };
};

export function PushNavigationHandler() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data as {
          orderId?: string;
          url?: string;
        };

        if (data.orderId) {
          navigation.navigate("trackOrder", { orderId: data.orderId });
        } else if (data.url) {
          Linking.openURL(data.url);
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  return null;
}

/* ================================
   🚀 ROOT LAYOUT
================================*/
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const user = useAppStore(s => s.user);
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);
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
      <View style={styles.loadingContainer}>
        {/* <Text style={styles.loadingText}>Loading...</Text> */}
      </View>
    );
  }

  const screenOptions = {
    headerShown: false,
    headerShadowVisible: false,
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={screenOptions}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
            <PushNavigationHandler />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/* ================================
   ✍️ GLOBAL TEXT COMPONENTS
================================*/
export const AppText: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_500Medium" }, style]} />
);

export const AppTextBold: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_700Bold" }, style]} />
);

/* ================================
   🖌 STYLES
================================*/
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#093131",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
