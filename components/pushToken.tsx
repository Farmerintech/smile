import { BaseURL } from "@/app/lib/api";
import { useAppStore } from "@/app/store/useAppStore";
import { registerForPushNotificationsAsync } from "@/hooks/notifications";
import { useEffect } from "react";

export default function PushTokenSaver() {
  const { user } = useAppStore();

  useEffect(() => {
    const saveToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token) return;

        console.log("Expo Push Token:", token);

        // Send token to backend
        const res = await fetch(`${BaseURL}/users/save_push_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ expoPushToken: token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save token");

        console.log("Push token saved:", data);
      } catch (err: any) {
        console.error("Failed to save push token:", err.message);
      }
    };

    saveToken();
  }, []);
}




export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: { type: "order_update" }, // optional extra info
    }),
  });
}
