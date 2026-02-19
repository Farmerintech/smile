import { Ionicons } from "@expo/vector-icons";
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

import { useLocalSearchParams } from "expo-router";
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
  { key: "picked-up", title: "Picked up" },
  { key: "delivered", title: "Delivered" },
] as const;

/* ---------------------------- */
/* Types */
/* ---------------------------- */

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
    return Object.fromEntries(
      STATUS_FLOW.map(s => [s, false])
    ) as Record<typeof STATUS_FLOW[number], boolean>;
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
  const { orderId } = useLocalSearchParams();
  const { user } = useAppStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [track, setTrack] = useState(buildTrack("pending"));
  const [loading, setLoading] = useState(true);

  /* ---------------------------- */
  /* Status Color */
  /* ---------------------------- */

  const getStatusBgColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "#FBBF24";
      case "preparing":
        return "#3B82F6";
      case "ready":
        return "#F97316";
      case "picked-up":
        return "#6366F1";
      case "delivered":
        return "#10B981";
      case "canceled":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  /* ---------------------------- */
  /* Progress */
  /* ---------------------------- */

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
      const res = await fetch(
        `${BaseURL}/orders/get_order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) throw new Error("Fetch failed");

      const data = json.data;

      setOrder(data);
      setStatus(data.orderStatusUser);
      setTrack(buildTrack(data.orderStatusUser));
    } catch (err) {
      console.log(err);
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

        {/* ================= ORDER CARD ================= */}
        <View style={styles.card}>

          {order?.items.map(item => (
            <View key={item.productId} style={styles.itemRow}>

              {/* Image */}
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />

              {/* Info */}
              <View style={styles.itemInfo}>
                <AppTextBold>{item.name}</AppTextBold>
                <AppText>Qty: {item.quantity}</AppText>
                <AppText>₦{item.price}</AppText>
                <AppText numberOfLines={1}>
                  📍 {order?.deliveryAddress.street}
                </AppText>
              </View>

              {/* Progress */}
              <View style={styles.progressBox}>
                <CircularProgress
                  radius={26}
                  value={progressValue}
                  maxValue={100}
                  showProgressValue={false}
                  activeStrokeColor={getStatusBgColor(status)}
                  inActiveStrokeColor="#E5E7EB"
                  activeStrokeWidth={6}
                  inActiveStrokeWidth={6}
                />

                <View
                  style={[
                    styles.progressCenter,
                    { backgroundColor: getStatusBgColor(status) },
                  ]}
                >
                  <Ionicons
                    name={STATUS_ICONS[status]}
                    size={16}
                    color="#fff"
                  />
                </View>
              </View>

            </View>
          ))}

        </View>

        {/* ================= STATUS + HORIZONTAL TIMELINE ================= */}
        <View style={styles.statusCard}>

          {/* Header */}
          <View style={styles.statusHeader}>
            <Ionicons
              name={STATUS_ICONS[status]}
              size={24}
              color={getStatusBgColor(status)}
            />

            <View style={{ marginLeft: 10 }}>
              <AppTextBold style={styles.statusText}>
                {status.replace("-", " ")}
              </AppTextBold>

              <AppText style={styles.statusSubText}>
                Your order is currently {status}
              </AppText>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.horizontalTimeline}>

            {orderSteps.map((step, index) => {
              const isActive = track[step.key];
              const isCurrent = status === step.key;

              const color = isActive
                ? getStatusBgColor(step.key as OrderStatus)
                : "#D1D5DB";

              return (
                <View key={step.key} style={styles.hStep}>

                  {index !== 0 && (
                    <View
                      style={[
                        styles.hLine,
                        { backgroundColor: color },
                      ]}
                    />
                  )}

                  <View
                    style={[
                      styles.hDot,
                      {
                        backgroundColor: isActive ? color : "#fff",
                        borderColor: color,
                      },
                    ]}
                  >
                    {isActive && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#fff"
                      />
                    )}
                  </View>

                  <AppText
                    style={[
                      styles.hLabel,
                      isCurrent && { fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {step.title.split(" ")[0]}
                  </AppText>

                </View>
              );
            })}

          </View>

        </View>

        {/* ================= VERTICAL TIMELINE ================= */}
        <View style={styles.card}>

<FlatList
  data={orderSteps}
  keyExtractor={i => i.key}
  scrollEnabled={false}
  renderItem={({ item, index }) => {
    const isActive = track[item.key];
    const isCurrent = status === item.key;
    const isLast = index === orderSteps.length - 1;

    const color = isActive
      ? getStatusBgColor(item.key as OrderStatus)
      : "#D1D5DB";

    return (
      <View style={styles.vRow}>

        {/* LEFT LINE */}
        <View style={styles.vLineBox}>

          {/* Top line */}
          {index !== 0 && (
            <View
              style={[
                styles.vLine,
                { backgroundColor: color },
              ]}
            />
          )}

          {/* Dot */}
          <View
            style={[
              styles.vDot,
              {
                backgroundColor: isActive ? color : "#fff",
                borderColor: color,
              },
            ]}
          >
            {isActive && (
              <Ionicons
                name="checkmark"
                size={14}
                color="#fff"
              />
            )}
          </View>

          {/* Bottom line */}
          {!isLast && (
            <View
              style={[
                styles.vLine,
                { backgroundColor: color },
              ]}
            />
          )}

        </View>

        {/* RIGHT CONTENT */}
        <View style={styles.vContent}>

          <AppTextBold
            style={[
              styles.vTitle,
              isActive && { color: "#111827" },
              isCurrent && { fontSize: 16 },
            ]}
          >
            {item.title}
          </AppTextBold>

          {isCurrent && (
            <AppText style={styles.vSub}>
              In progress...
            </AppText>
          )}

        </View>

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
  safeArea: {
    flex: 1,
    paddingBottom: 40,
  },

  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  /* Order Card */

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  progressBox: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  progressCenter: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Status Card */

  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
/* ===============================
   Vertical Timeline (Fixed)
================================*/

vRow: {
  flexDirection: "row",
  minHeight: 70,
},

vLineBox: {
  width: 32,
  alignItems: "center",
},

vLine: {
  flex: 1,
  width: 2,
},

vDot: {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 2,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
},

vContent: {
  flex: 1,
  paddingBottom: 10,
},

vTitle: {
  fontSize: 15,
  color: "#6B7280",
},

vSub: {
  fontSize: 12,
  color: "#9CA3AF",
  marginTop: 2,
},

  statusText: {
    fontSize: 16,
    textTransform: "capitalize",
  },

  statusSubText: {
    fontSize: 12,
    color: "#6B7280",
  },

  /* Horizontal Timeline */

  horizontalTimeline: {
    flexDirection: "row",
    alignItems: "center",
  },

  hStep: {
    flex: 1,
    alignItems: "center",
  },

  hLine: {
    position: "absolute",
    height: 2,
    width: "100%",
    left: "-50%",
    top: 10,
  },

  hDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 2,
  },

  hLabel: {
    fontSize: 10,
    marginTop: 6,
    color: "#6B7280",
  },

  /* Vertical Timeline */

  row: {
    flexDirection: "row",
    marginBottom: 14,
  },

  timeline: {
    width: 30,
    alignItems: "center",
  },

  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  connector: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },

  title: {
    fontSize: 15,
    color: "#6B7280",
    paddingLeft: 12,
  },

  currentText: {
    fontSize: 12,
    color: "#6B7280",
    paddingLeft: 12,
  },
});
