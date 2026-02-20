import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

/* ================= TYPES ================= */

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
  orderStatusUser: string;
  createdAt: string;
  imageUrl?: string;
  deliveryAddress: any;
  orderStatusVendor: string;
};

type RootStackParamList = {
  trackOrder: { orderId: string };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "trackOrder"
>;

/* ================= COMPONENT ================= */

export default function OngoingOrder() {
  const { user } = useAppStore();
  const navigation = useNavigation<NavigationProp>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!user?.id) return;

    fetchOrders();
  }, [user?.id]);

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
        // ONLY ONGOING
        const ongoing = data.data.filter(
          (order: Order) =>
            order.orderStatusUser !== "delivered" &&
            order.orderStatusUser !== "cancelled"
        );

        setOrders(ongoing);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLER ================= */

  const openOrder = (orderId: string) => {
  router.push(`/(screens)/trackOrder?orderId=${orderId}`);
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#093131" />
      </View>
    );
  }

  /* ================= EMPTY ================= */

  if (!orders.length) {
    return (
      <View style={styles.center}>
        <AppText>No ongoing orders</AppText>
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {orders.map(order => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() => openOrder(order.id)}
          >
            {order.imageUrl && (
              <Image
                source={{ uri: order.imageUrl }}
                style={styles.image}
              />
            )}

            <AppText>
              Status:{" "}
              {order.orderStatusVendor
                ?.replace("-", " ")
                .toUpperCase()}
            </AppText>

            <View style={{ marginTop: 8 }}>
              {order.items.map(item => (
                <View key={item.productId} style={styles.itemRow}>

                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                    />
                  )}

                  <View style={styles.itemDetails}>
                    <AppText style={styles.itemName}>
                      {item.name} × {item.quantity}
                    </AppText>

                    <AppText style={styles.itemPrice}>
                      ₦{item.totalPrice}
                    </AppText>

                    {item.vendorNote && (
                      <AppText style={styles.itemNote}>
                        Vendor: {item.vendorNote}
                      </AppText>
                    )}

                    {item.riderNote && (
                      <AppText style={styles.itemNote}>
                        Rider: {item.riderNote}
                      </AppText>
                    )}
                  </View>

                </View>
              ))}
            </View>

            <AppText>
              Delivery: {order.deliveryAddress?.street}
            </AppText>

            <AppText style={styles.total}>
              Total: ₦{order.totalAmount + order.deliveryFee}
            </AppText>

          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },

  container: {
    padding: 16,
    paddingBottom: 80,
  },

  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  itemRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 6,
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },

  itemPrice: {
    fontWeight: "bold",
  },

  itemNote: {
    fontSize: 12,
    color: "#555",
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
  },
});
