import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";
import { OrderTabs } from "./trackOrder";

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl?: string;
  vendorNote?: string;
  riderNote?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  orderStatus:
    | "pending"
    | "preparing"
    | "ready"
    | "picked_up"
    | "delivered"
    | "cancelled";
  createdAt: string;
  imageUrl?: string;
};

export default function OrderStatus() {
  const { user } = useAppStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"ongoing" | "completed" | "cancelled">(
    "ongoing"
  );

  // ================= FETCH ORDERS =================
  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BaseURL}/orders/get_user_orders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data.data);

          // default tab = ongoing
          const ongoingOrders = data.data.filter(
            (order: Order) =>
              order.orderStatus !== "delivered" &&
              order.orderStatus !== "cancelled"
          );
          setDisplayedOrders(ongoingOrders);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // ================= TAB CLICK HANDLER =================
  const handleTabChange = (tab: "ongoing" | "completed" | "cancelled") => {
    setActiveTab(tab);

    if (tab === "completed") {
      setDisplayedOrders(
        orders.filter(order => order.orderStatus === "delivered")
      );
      return;
    }

    if (tab === "cancelled") {
      setDisplayedOrders(
        orders.filter(order => order.orderStatus === "cancelled")
      );
      return;
    }

    // ongoing = everything else
    setDisplayedOrders(
      orders.filter(
        order =>
          order.orderStatus !== "delivered" &&
          order.orderStatus !== "cancelled"
      )
    );
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#093131" />
      </View>
    );
  }

  // ================= EMPTY =================
  if (!displayedOrders.length) {
    return (
      <View style={styles.center}>
        <OrderTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <AppText style={{ marginTop: 20 }}>
          No {activeTab} orders found.
        </AppText>
      </View>
    );
  }

  // ================= RENDER =================
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <OrderTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {displayedOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            {order.imageUrl && (
              <Image source={{ uri: order.imageUrl }} style={styles.image} />
            )}

            <AppText style={styles.orderId}>Order ID: {order.id}</AppText>
            <AppText>
              Status: {order?.orderStatus?.replace("_", " ").toUpperCase()}
            </AppText>

            {/* ================= ITEMS ================= */}
            <View style={{ marginTop: 8 }}>
              {order.items.map(item => (
                <View key={item.productId} style={styles.itemRow}>
                  {/* Image on left */}
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  )}

                  {/* Details on right */}
                  <View style={styles.itemDetails}>
                    <AppText style={styles.itemName}>
                      {item.name} × {item.quantity}
                    </AppText>
                    <AppText style={styles.itemPrice}>₦{item.totalPrice}</AppText>

                    {item.vendorNote ? (
                      <AppText style={styles.itemNote}>
                        Vendor: {item.vendorNote}
                      </AppText>
                    ) : null}

                    {item.riderNote ? (
                      <AppText style={styles.itemNote}>
                        Rider: {item.riderNote}
                      </AppText>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>

            <AppText style={styles.total}>
              Total: ₦{order.totalAmount + order.deliveryFee}
            </AppText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  orderId: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    gap: 12, // space between image and details
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "500",
    fontSize: 16,
  },
  itemPrice: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 2,
  },
  itemNote: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
