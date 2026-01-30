import setupFocusManager from "@/app/lib/focusManager";
import setupOnlineManager from "@/app/lib/onlineManager";
import { queryClient } from "@/app/lib/queryClient";
import { useAppStore } from "@/app/store/useAppStore";
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";

import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";

/* ================================
   🔔 NOTIFICATIONS
================================ */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});



// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notifications!");
//       return;
//     }

//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }

// useEffect(() => {
//   registerForPushNotificationsAsync().then(token => {
//     // Send this token to your backend to save it with the user
//     Alert.alert(token||"")
//   });
// }, []);

/* ================================
   🔄 REACT QUERY
================================ */

setupOnlineManager();
setupFocusManager();

/* ================================
   🚀 SPLASH
================================ */

SplashScreen.preventAutoHideAsync();

/* ================================
   🧠 ROOT
================================ */

export default function RootLayout() {
  const colorScheme = useColorScheme();
const user = useAppStore((state) => state.user);
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

  // Hide splash only when EVERYTHING is ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle initial routing (BEST PRACTICE)
  useEffect(() => {
    if (!fontsLoaded) return;

    if (!hasCompletedOnboarding) {
      console.log(hasCompletedOnboarding)
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
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={screenOptions}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

/* ================================
   ✍️ GLOBAL TEXT
================================ */

export const AppText: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_500Medium" }, style]} />
);

export const AppTextBold: React.FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[{ fontFamily: "Inter_700Bold" }, style]} />
);


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#093131", // bright green background
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
