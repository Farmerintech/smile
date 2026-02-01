import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
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
/* Order Status Config */
/* ---------------------------- */
const STATUS_FLOW = [
  "pending",
  "preparing",
  "ready",
  "picked-up",
  "delivered",
] as const;

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "picked-up"
  | "delivered"
  | "canceled";

const STATUS_ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  pending: "time-outline",
  preparing: "restaurant-outline",
  ready: "cube-outline",
  "picked-up": "bicycle-outline",
  delivered: "checkmark",
  canceled: "close",
};

const orderSteps = [
  { key: "pending", title: "Order pending" },
  { key: "preparing", title: "Preparing order" },
  { key: "ready", title: "Ready for pickup" },
  { key: "picked-up", title: "Picked up by rider" },
  { key: "delivered", title: "Delivered" },
] as const;

/* ---------------------------- */
/* Types */
/* ---------------------------- */
type RootStackParamList = {
  trackOrder: { orderId: string };
};

type TrackOrderRouteProp = RouteProp<RootStackParamList, "trackOrder">;

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: { street: string };
  orderStatusUser: OrderStatus;
};

/* ---------------------------- */
/* Helpers */
/* ---------------------------- */
const buildTrack = (status: OrderStatus) => {
  if (status === "canceled") {
    return Object.fromEntries(STATUS_FLOW.map(s => [s, false])) as Record<
      typeof STATUS_FLOW[number],
      boolean
    >;
  }

  const track: any = {};
  for (const step of STATUS_FLOW) {
    track[step] = true;
    if (step === status) break;
  }
  return track;
};

/* ---------------------------- */
/* Component */
/* ---------------------------- */
export default function TrackOrder() {
  const route = useRoute<TrackOrderRouteProp>();
  const { orderId } = route.params;
  const { user } = useAppStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [track, setTrack] = useState(buildTrack("pending"));
  const [loading, setLoading] = useState(true);

  const progressValue =
    status === "canceled"
      ? 0
      : ((STATUS_FLOW.indexOf(status as any) + 1) /
          STATUS_FLOW.length) *
        100;

  /* ---------------------------- */
  /* Fetch Order */
  /* ---------------------------- */
  const fetchOrder = async () => {
    try {
      const res = await fetch(`${BaseURL}/orders/get_order/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const json = await res.json();
      const data = json.data;

      if (!res.ok) throw new Error("Failed to fetch order");

      setOrder(data);
      setStatus(data.orderStatusUser);
      setTrack(buildTrack(data.orderStatusUser));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------------------- */
  /* Loading */
  /* ---------------------------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1EBA8D" />
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------------------- */
  /* Render */
  /* ---------------------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ORDER CARD */}
        <View style={styles.card}>
          {order?.items.map(item => (
            <View key={item.productId} style={styles.itemRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={{ flex: 1, flexDirection:"row", justifyContent:"space-between"}}>
                <AppText>{item.name} × {item.quantity}</AppText>
                <AppText>₦{item.price}</AppText>
              </View>
            </View>
          ))}
          {/* <AppTextBold style={{ marginTop: 8 }}>
            Total: ₦{order!.totalAmount + order!.deliveryFee}
          </AppTextBold> */}
          <AppText>Delivery: {order?.deliveryAddress.street}</AppText>
        </View>

        {/* CIRCULAR PROGRESS */}
        <View style={styles.progressWrapper}>
          <CircularProgress
            radius={55}
            value={progressValue}
            maxValue={100}
            duration={700}
            showProgressValue={false}
            activeStrokeColor={
              status === "canceled" ? "#EF4444" : "#1EBA8D"
            }
            inActiveStrokeColor="#E5E7EB"
            inActiveStrokeOpacity={0.3}
            activeStrokeWidth={8}
            inActiveStrokeWidth={8}
          />

          <View
            style={[
              styles.progressCenter,
              status === "canceled" && { backgroundColor: "#EF4444" },
            ]}
          >
            <Ionicons
              name={STATUS_ICONS[status]}
              size={26}
              color="#fff"
            />
          </View>
        </View>

        {/* TIMELINE */}
        <View style={styles.card}>


        <FlatList
          data={orderSteps}
          keyExtractor={i => i.key}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const isActive = track[item.key];
            const isLast = index === orderSteps.length - 1;

            return (
              <View style={styles.row}>
                <View style={styles.timeline}>
                  <View
                    style={[
                      styles.dot,
                      isActive ? styles.dotActive : styles.dotInactive,
                    ]}
                  >
                    {isActive && (
                      <Ionicons name="checkmark" size={14} color="#1EBA8D" />
                    )}
                  </View>
                  {!isLast && <View style={styles.connector} />}
                </View>

                <AppTextBold
                  style={[
                    styles.title,
                    isActive && { color: "#111827" },
                  ]}
                >
                  {item.title}
                </AppTextBold>
              </View>
            );
          }}
        />
                </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------------- */
/* Styles */
/* ---------------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1,  paddingBottom:50 },
  container: { padding: 16, paddingBottom: 40, backgroundColor:"#ffffffaf" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#ffffffaf",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemRow: { flexDirection: "row", marginBottom: 10 },
  image: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },

  progressWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical:10,
    backgroundColor: "#ffffffaf",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  progressCenter: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1EBA8D",
    alignItems: "center",
    justifyContent: "center",
  },

  row: { flexDirection: "row", marginBottom: 12 },
  timeline: { width: 30, alignItems: "center" },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  dotActive: { borderColor: "#1EBA8D", backgroundColor: "#ECFDF5" },
  dotInactive: { borderColor: "#D1D5DB" },
  connector: {
    height: 40,
    width: 2,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
  },
  title: { fontSize: 15, color: "#6B7280", paddingLeft: 12 },
});
