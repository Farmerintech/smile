import { BaseURL } from "@/app/lib/api";
import { useAppStore } from "@/app/store/useAppStore";
import { registerForPushNotificationsAsync } from "@/hooks/notifications";
import { useEffect } from "react";

export default function PushTokenSaver() {
  const { user } = useAppStore();

  useEffect(() => {
    // 1. Only attempt to save if we have a logged-in user
    if (!user?.token) return;

    const saveToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token) return;
        // 2. Logic to prevent redundant API calls (optional but good)
        // If your store already has this token saved, you can skip the fetch

        const res = await fetch(`${BaseURL}/auth/user/save_push_token`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ expoPushToken: token }),
        });
                console.error(token)

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save token");

        console.log("Success: Production Push Token Saved");
      } catch (err: any) {
        console.error("Failed to save push token:", err.message);
      }
    };

    saveToken();
  }, [user?.token]); // 👈 Add user.token here

  return null;
}