import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";

export type PushNavigationData = {
  orderId?: string;
  url?: string;
};

/* ================================
   🔔 FOREGROUND HANDLER
   - Android uses shouldShowAlert
   - iOS needs banner/list flags for typing
================================*/
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,     // ✅ ANDROID POPUP
      shouldPlaySound: true,
      shouldSetBadge: true,

      // iOS-only, but REQUIRED for TS
      shouldShowBanner: true,
      shouldShowList: true
    }),
  });
}

/* ================================
   📢 ANDROID CHANNEL
   - SINGLE source of truth
   - MAX importance = heads-up popup
================================*/
export async function setupAndroidChannel() {
  if (Platform.OS !== "android") return;

 await Notifications.setNotificationChannelAsync("default", {
  name: "default",
  importance: Notifications.AndroidImportance.MAX,
  sound: "default",
  vibrationPattern: [0, 250, 250, 250],
  lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  enableVibrate: true
});
}

/* ================================
   📲 REGISTER FOR PUSH
================================*/
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return null;
  }

  // 1. Android 13+ specific permission check
  if (Platform.OS === 'android') {
    await setupAndroidChannel(); // Ensure channel exists before requesting permission
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }

  // 2. Fetch the token with the ProjectID
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
  } catch (e) {
    console.error("Error fetching push token", e);
    return null;
  }
}/* ================================
   🧭 HANDLE NOTIFICATION TAP
   - Prevents Expo Go hijacking
================================*/
export function handleNotificationNavigation(
  data: PushNavigationData,
  navigateToOrder: (orderId: string) => void
) {
  if (data.orderId) {
    navigateToOrder(data.orderId);
    return;
  }

  // Only allow YOUR scheme
  if (data.url?.startsWith("smile://")) {
    Linking.openURL(data.url);
  }
}
