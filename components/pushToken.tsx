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

        console.error("Expo Push Token:", token);

        // Send token to backend
        const res = await fetch(`${BaseURL}/auth/user/save_push_token`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ expoPushToken: token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save token");

        console.error("Push token saved:", data);
      } catch (err: any) {
        console.error("Failed to save push token:", err.message);
      }
    };

    saveToken();
  }, []);
    return null; // 👈 important
}




