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
================================*/
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/* ================================
   📢 ANDROID CHANNEL
================================*/
export async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

/* ================================
   📲 REGISTER FOR PUSH
================================*/
export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    if (req.status !== "granted") return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) return null;

  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;

  return token;
}

/* ================================
   🧭 HANDLE NOTIFICATION TAP
================================*/
export function handleNotificationNavigation(
  data: PushNavigationData,
  navigateToOrder: (orderId: string) => void
) {
  if (data.orderId) {
    navigateToOrder(data.orderId);
    return;
  }

  if (data.url) {
    Linking.openURL(data.url);
  }
}
