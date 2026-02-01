import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

type RootStackParamList = {
  trackOrder: { orderId: string };
};

export function PushNavigationHandler() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data as { orderId?: string; url?: string };
        if (data.orderId) {
          navigation.navigate("trackOrder", { orderId: data.orderId });
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);

  return null;
}
