import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

import { AppText, AppTextBold } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* ---------------------------- */
/* Order Steps & Status Config */
/* ---------------------------- */
const orderSteps = [
  { key: "pending", title: "Order pending" },
  { key: "preparing", title: "Preparing order" },
  { key: "ready", title: "Ready for pickup" },
  { key: "picked-up", title: "Picked up by rider" },
  { key: "delivered", title: "Delivered" },
] as const;

type OrderStatus = "pending" | "preparing" | "ready" | "picked-up" | "delivered";
const STATUS_FLOW: OrderStatus[] = ["pending", "preparing", "ready", "picked-up", "delivered"];

function buildTrack(status: OrderStatus) {
  const track: Record<OrderStatus, boolean> = {
    pending: false,
    preparing: false,
    ready: false,
    "picked-up": false,
    delivered: false,
  };
  for (const step of STATUS_FLOW) {
    track[step] = true;
    if (step === status) break;
  }
  return track;
}

/* ---------------------------- */
/* Types for route params & order */
/* ---------------------------- */
type RootStackParamList = {
  OrderStatus: undefined;
  trackOrder: { orderId: string };
};
type TrackOrderRouteProp = RouteProp<RootStackParamList, "trackOrder">;

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
  vendorNote?: string;
  riderNote?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: { street: string; city: string; lat: string; lng: string };
  orderStatusUser: OrderStatus;
};

/* ---------------------------- */
/* Main Component */
/* ---------------------------- */
export default function TrackOrder() {
  const route = useRoute<TrackOrderRouteProp>();
  const { orderId } = route.params;
  const { user } = useAppStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [track, setTrack] = useState(buildTrack("pending"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState<OrderStatus | null>(null);

  /* ---------------------------- */
  /* Fetch order data & status */
  /* ---------------------------- */
  const fetchOrderStatus = async () => {
    if (!orderId) return;

    try {
      const res = await fetch(`${BaseURL}/orders/get_order/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const json = await res.json();
      const data = json.data; // backend sends order directly inside data

      if (json.message) setMessage(json.message);

      if (!res.ok) throw new Error(json.message || "Failed to fetch order");

      const newStatus = data.orderStatusUser as OrderStatus;

      if (!order || status !== newStatus) {
        setOrder(data);
        setStatus(newStatus);
        setTrack(buildTrack(newStatus));
      }

      setError(null);
    } catch (err: any) {
      console.log("Fetch error:", err);
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [orderId]);

  /* ---------------------------- */
  /* Push Notifications */
  /* ---------------------------- */
  useEffect(() => {
    if (!status || status === lastNotifiedStatus) return;

    const messages: Record<OrderStatus, { title: string; body: string }> = {
      pending: { title: "Order pending", body: "Your order has been placed" },
      preparing: { title: "Preparing order", body: "Vendor is preparing your order" },
      ready: { title: "Order ready", body: "Your order is ready for pickup" },
      "picked-up": { title: "Picked up", body: "Your order is on the way" },
      delivered: { title: "Delivered 🎉", body: "You have received your order" },
    };

    const msg = messages[status];
    Notifications.scheduleNotificationAsync({ content: msg, trigger: null });
    setLastNotifiedStatus(status);
  }, [status]);

  /* ---------------------------- */
  /* Loading & Error */
  /* ---------------------------- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#093131" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <AppText>{error}</AppText>
      </View>
    );

  /* ---------------------------- */
  /* Render */
  /* ---------------------------- */
  return (
        <SafeAreaView style={styles.safeArea}>
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== MESSAGE ===== */}
      {message && (
        <View style={styles.messageBox}>
          <AppText>{message}</AppText>
        </View>
      )}

      {/* ===== ORDER CARD ===== */}
      <View style={styles.orderCard}>
        {/* <AppTextBold>Order ID: {order?.id}</AppTextBold> */}
        {order?.items?.map(item => (
          <View key={item.productId} style={styles.itemRow}>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />}
            <View style={styles.itemDetails}>
              <AppText>{item.name} × {item.quantity}</AppText>
              <AppText>₦{item.price}</AppText>
            </View>
          </View>
        ))}
        <AppText style={{ marginTop: 8 }}>Total: ₦{(order?.totalAmount || 0) + (order?.deliveryFee || 0)}</AppText>
        <AppText>Delivery: {order?.deliveryAddress?.street}</AppText>
        <AppText>Status: {order?.orderStatusUser?.toUpperCase()}</AppText>
      </View>

      {/* ===== CIRCULAR PROGRESS ===== */}
      <View style={styles.circularWrapper}>
        <CircularProgress
          radius={50}
          value={(STATUS_FLOW.indexOf(status!) + 1) * (100 / STATUS_FLOW.length)}
          duration={800}
          activeStrokeColor="#1EBA8D"
          inActiveStrokeColor="#E5E7EB"
          inActiveStrokeWidth={8}
          activeStrokeWidth={8}
          progressValueColor="black"
          maxValue={100}
        />
      </View>

      {/* ===== VERTICAL TIMELINE ===== */}
      <FlatList
        data={orderSteps}
        keyExtractor={item => item.key}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const isLast = index === orderSteps.length - 1;
          const isActive = track[item.key];
          const next = orderSteps[index + 1];
          const connectorActive = isActive || (next && track[next.key]);

          return (
            <View style={styles.row}>
              <View style={styles.timeline}>
                <View style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}>
                  {isActive && <Ionicons name="checkmark" size={14} color="#093131" />}
                </View>
                {!isLast && <View style={[styles.connector, connectorActive && styles.connectorActive]} />}
              </View>

              <View style={styles.content}>
                <AppTextBold style={[styles.title, isActive && styles.titleActive]}>
                  {item.title}
                </AppTextBold>
              </View>
            </View>
          );
        }}
      />
    </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------------- */
/* Styles */
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "white" },
  container: { padding: 16, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  messageBox: { backgroundColor: "#FEF3C7", padding: 12, borderRadius: 12, marginBottom: 16 },
  orderCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  itemRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1 },

  circularWrapper: { alignItems: "center", marginVertical: 24 },

  row: { flexDirection: "row", marginBottom: 8 },
  timeline: { width: 30, alignItems: "center" },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dotActive: { borderColor: "#093131", borderWidth: 2, backgroundColor: "#E6F2F2" },
  dotInactive: { borderColor: "#D1D5DB", borderWidth: 2 },
  connector: { width: 2, height: 40, borderWidth: 1, borderStyle: "dashed", borderColor: "#D1D5DB", marginTop: 6 },
  connectorActive: { borderColor: "#093131" },
  content: { flex: 1, paddingLeft: 12 },
  title: { fontSize: 15, color: "#6B7280" },
  titleActive: { fontWeight: "500", color: "#111827" },
});
