import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";
import { OrderTabs } from "./orderTabs";

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl?: string;
  vendorNote?: string;
  riderNote?: string;
  deliveryAddress: any;
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
  deliveryAddress: any;
  orderStatusVendor: string;
};

type RootStackParamList = {
  OrderStatus: undefined;
  trackOrder: { orderId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OrderStatus">;

export default function OrderStatus() {
  const { user } = useAppStore();
  const navigation = useNavigation<NavigationProp>();

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
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data.data);
          handleTabChange(activeTab, data.data);
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
  const handleTabChange = (
    tab: "ongoing" | "completed" | "cancelled",
    ordersList: Order[] = orders
  ) => {
    setActiveTab(tab);

    let filteredOrders = [];
    if (tab === "completed") {
      filteredOrders = ordersList.filter(order => order.orderStatus === "delivered");
    } else if (tab === "cancelled") {
      filteredOrders = ordersList.filter(order => order.orderStatus === "cancelled");
    } else {
      filteredOrders = ordersList.filter(
        order => order.orderStatus !== "delivered" && order.orderStatus !== "cancelled"
      );
    }
    setDisplayedOrders(filteredOrders);
  };

  const handleItemPress = (orderId: string) => {
    navigation.navigate("trackOrder", { orderId });
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
      <SafeAreaView style={styles.safeArea}>
        <OrderTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <View style={styles.center}>
          <AppText style={{ marginTop: 20 }}>
            No {activeTab} orders found.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  // ================= RENDER =================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <OrderTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {displayedOrders.map(order => (
          <Pressable key={order.id} style={styles.orderCard}                   
          onPress={() => handleItemPress(order.id)}
>
            {order.imageUrl && (
              <Image source={{ uri: order.imageUrl }} style={styles.image} />
            )}

            <AppText className="flex text-right">
              Status: {order?.orderStatusVendor?.replace("-", " ").toLocaleUpperCase()}
            </AppText>

            <View style={{ marginTop: 8 }}>
              {order.items.map(item => (
                <Pressable
                  key={item.productId}
                  style={styles.itemRow}
                >
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  )}
                  <View style={styles.itemDetails}>
                    <AppText style={styles.itemName}>
                      {item.name} × {item.quantity}
                    </AppText>
                    <AppText style={styles.itemPrice}>₦{item.totalPrice}</AppText>
                    {item.vendorNote && (
                      <AppText style={styles.itemNote}>Vendor: {item.vendorNote}</AppText>
                    )}
                    {item.riderNote && (
                      <AppText style={styles.itemNote}>Rider: {item.riderNote}</AppText>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
            <AppText>Delivery Location: {order.deliveryAddress.street}</AppText>
            <AppText style={styles.total}>
              Total: ₦{order.totalAmount + order.deliveryFee}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white", paddingBottom:50 },
  container: { padding: 16, paddingBottom: 80 }, // ensure content doesn't overlap nav bar
  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    gap: 12,
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
  itemName: { fontWeight: "500", fontSize: 16 },
  itemPrice: { fontWeight: "bold", fontSize: 14, marginTop: 2 },
  itemNote: { fontSize: 12, color: "#555", marginTop: 2 },
  total: { marginTop: 10, fontWeight: "bold" },
  image: { width: 70, height: 70, borderRadius: 14, marginBottom: 10 },
  center: { flex: 1, justifyContent: "flex-start", alignItems: "center", padding: 16 },
});
