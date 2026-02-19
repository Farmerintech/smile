import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

const Cart = () => {
  const { cart, removeFromCart, user, setOrderState } = useAppStore();
  const isEmpty = cart.length === 0;

  /* ================= ADDRESS ================= */
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  /* ================= LOADING ================= */
  const [loadingStores, setLoadingStores] = useState<Record<string, boolean>>({});

  /* ================= NOTES ================= */
  const [vendorNotes, setVendorNotes] = useState<Record<string, string>>({});
  const [riderNotes, setRiderNotes] = useState<Record<string, string>>({});
  const [showVendorNoteInput, setShowVendorNoteInput] = useState<Record<string, boolean>>({});
  const [showRiderNoteInput, setShowRiderNoteInput] = useState<Record<string, boolean>>({});

  /* ================= LOCATION ================= */
  useEffect(() => {
    let mounted = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        if (!mounted) return;

        setLocation(loc);

        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geo.length && mounted) {
          const place = geo[0];
          setAddress(`${place.street || ""}, ${place.city || ""}`);
          setCity(place.city || "");
        }
      } catch (err) {
        console.log("Location error:", err);
      }
    };

    getLocation();
    return () => {
      mounted = false;
    };
  }, []);

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (id: string) => {
    await removeFromCart(id);
  };

  /* ================= CHECKOUT ================= */
  const checkOutStore = async (storeId: string) => {
    if (loadingStores[storeId]) return;

    setLoadingStores(prev => ({ ...prev, [storeId]: true }));

    const storeItems = cart.filter(item => item.storeId === storeId);
    if (!location) {
      Alert.alert("Error", "Location not available");
      setLoadingStores(prev => ({ ...prev, [storeId]: false }));
      return;
    }

    const totalAmount = storeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const res = await fetch(`${BaseURL}/orders/create_order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          storeId,
          items: storeItems.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
            imageUrl: item.imageUrl,
            vendorNote: vendorNotes[item.id] || "",
            riderNote: riderNotes[item.id] || "",
          })),
          totalAmount,
          deliveryFee: 1000,
          deliveryAddress: {
            street: address,
            city,
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Order created");
        await Promise.all(storeItems.map(item => setOrderState(item.id, data.id, data.status)));
        for (const item of storeItems) await removeFromCart(item.id);
      } else {
        Alert.alert("Error", data.message || "Checkout failed");
      }
    } catch (err) {
      console.log("Checkout error:", err);
      Alert.alert("Error", "Checkout failed");
    }

    setLoadingStores(prev => ({ ...prev, [storeId]: false }));
  };

  /* ================= GROUP STORES ================= */
  const storeGroups: Record<string, number[]> = {};
  cart.forEach((item, index) => {
    if (!storeGroups[item.storeId]) storeGroups[item.storeId] = [];
    storeGroups[item.storeId].push(index);
  });

  /* ================= UI ================= */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 160, paddingHorizontal: 16 }}
      >
        {/* ===== ADDRESS ALWAYS SHOWS ===== */}
        { !isEmpty && <View className="mb-5">
          <AppText className="text-[20px] font-semibold mb-2">Delivery Address</AppText>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />
        </View>}

        {/* ===== EMPTY CART ONLY ===== */}
        {isEmpty ? (
          <View className="h-[250px] flex items-center justify-center h-[100vh]">
            <Ionicons name="cart-outline" size={60} color="#666" />
            <AppText className="mt-4 text-gray-700 text-lg">Your cart is empty</AppText>
          </View>
        ) : (
          // ===== CART ITEMS =====
          cart.map((item, index) => {
            const lastIndexForStore = storeGroups[item.storeId][storeGroups[item.storeId].length - 1];
            const showCheckout = index === lastIndexForStore;
            const storeTotal = storeGroups[item.storeId]
              .map(i => cart[i])
              .reduce((sum, it) => sum + it.price * it.quantity, 0);

            return (
              <View key={item.id} className="mb-4">
                {/* ITEM */}
                <View className="p-4 rounded-[20px] border border-gray-200">
                  <View className="flex-row items-center gap-4">
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: 70, height: 70, borderRadius: 14 }}
                      />
                    )}
                    <View className="flex-1">
                      <AppText className="font-semibold">{item.name}</AppText>
                      <AppText className="text-gray-500">
                        ₦{item.price} × {item.quantity}
                      </AppText>
                    </View>
                    <AppText className="font-bold">₦{item.price * item.quantity}</AppText>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* NOTES BUTTONS */}
                  <View className="flex-row gap-3 mt-3">
                    <TouchableOpacity
                      onPress={() =>
                        setShowVendorNoteInput(p => ({ ...p, [item.id]: !p[item.id] }))
                      }
                      className="bg-orange-500 px-3 py-3 rounded-xl"
                    >
                      <AppText className="text-white">Vendor Note</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setShowRiderNoteInput(p => ({ ...p, [item.id]: !p[item.id] }))
                      }
                      className="bg-orange-500 px-3 py-3 rounded-xl"
                    >
                      <AppText className="text-white">Rider Note</AppText>
                    </TouchableOpacity>
                  </View>

                  {/* NOTE INPUTS */}
                  {showVendorNoteInput[item.id] && (
                    <TextInput
                      placeholder="Vendor note..."
                      value={vendorNotes[item.id] || ""}
                      onChangeText={t => setVendorNotes(p => ({ ...p, [item.id]: t }))}
                      style={noteStyle}
                    />
                  )}
                  {showRiderNoteInput[item.id] && (
                    <TextInput
                      placeholder="Rider note..."
                      value={riderNotes[item.id] || ""}
                      onChangeText={t => setRiderNotes(p => ({ ...p, [item.id]: t }))}
                      style={noteStyle}
                    />
                  )}
                </View>

                {/* CHECKOUT */}
                {showCheckout && (
                  <View className="mt-2">
                    <TouchableOpacity
                      style={checkoutBtn}
                      onPress={() => checkOutStore(item.storeId)}
                      disabled={!!loadingStores[item.storeId]}
                    >
                      {loadingStores[item.storeId] ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <AppText className="text-white font-semibold">
                          Checkout ₦{storeTotal}
                        </AppText>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

/* ================= STYLES ================= */
const noteStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 8,
  marginTop: 6,
};

const checkoutBtn = {
  backgroundColor: "#093131",
  paddingVertical: 12,
  borderRadius: 16,
  alignItems: "center" as const,
};
