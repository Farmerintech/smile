import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
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
import "../../global.css";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";

const Order = () => {
  const { cart, removeFromCart, user, setOrderState } = useAppStore();
  const isEmpty = cart.length === 0;

  // ------------------------- General Delivery Address -------------------------
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState(""); // human-readable address input
  const [city, setCity] = useState("");

  // ------------------------- Loading state per store -------------------------
  const [loadingStores, setLoadingStores] = useState<Record<string, boolean>>({});

  // ------------------------- Notes per item -------------------------
  const [vendorNotes, setVendorNotes] = useState<Record<string, string>>({});
  const [riderNotes, setRiderNotes] = useState<Record<string, string>>({});
  const [showVendorNoteInput, setShowVendorNoteInput] = useState<Record<string, boolean>>({});
  const [showRiderNoteInput, setShowRiderNoteInput] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Reverse geocode to get readable address
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo.length > 0) {
        const place = geo[0];
        const formatted = `${place.street || ""}, ${place.city || ""}, ${place.region || ""}, ${place.country || ""}`;
        setAddress(formatted);
        setCity(`${place?.city}`);
      }
    };

    getLocation();
  }, []);

  // ------------------------- Remove item -------------------------
  const removeItem = async (id: string) => {
    await removeFromCart(id);
  };

  // ------------------------- Checkout per store -------------------------
  const checkOutStore = async (storeId: string) => {
    if (loadingStores[storeId]) return; // prevent double click
    setLoadingStores(prev => ({ ...prev, [storeId]: true }));

    const storeItems = cart.filter(item => item.storeId === storeId);
    if (!location) {
      Alert.alert("Error", "Cannot checkout without coordinates");
      setLoadingStores(prev => ({ ...prev, [storeId]: false }));
      return;
    }

    const totalAmount = storeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    Alert.alert(city);
    try {
      const res = await fetch(`${BaseURL}/orders/create_order`, {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          storeId: storeId,
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
            city: city,
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Order created successfully");
        router.push("/(screens)/orderStatus");

        // Set order state for each item
        await Promise.all(
          storeItems.map(item => setOrderState(item.id, data.id, data.status))
        );

        // Remove items from cart
        for (const item of storeItems) {
          await removeFromCart(item.id);
        }
      } else {
        Alert.alert("Error", data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout failed for store:", storeId, error);
      Alert.alert("Error", "Checkout failed, please try again.");
    }

    setLoadingStores(prev => ({ ...prev, [storeId]: false }));
  };

  // ------------------------- Group items by store -------------------------
  const storeGroups: Record<string, number[]> = {};
  cart.forEach((item, index) => {
    if (!storeGroups[item.storeId]) storeGroups[item.storeId] = [];
    storeGroups[item.storeId].push(index);
  });

  // ------------------------- Render -------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white",}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 160,
          paddingHorizontal: 16,
        }}
      >
        {/* ================= Delivery Address Input ================= */}
        <View className="mb-5">
          <AppText className="text-black text-[20px] font-semibold mb-2">
            Delivery Address
          </AppText>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="Enter your delivery address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View className="">
          <TouchableOpacity
            onPress={() => router.push("/(screens)/orderStatus")}
            className="flex flex-row gap-5 text-white items-center justify-end"
          >
            <AppText>Track Orders</AppText>
            <Ionicons name="chevron-forward" />
          </TouchableOpacity>
        </View>

        {/* ================= CART ================= */}
        <View className="mb-5">
          <AppText className="text-black text-[24px] font-bold mb-3">Orders</AppText>

          {isEmpty ? (
            <View className="w-full h-[200px] flex items-center justify-center rounded-[25px] border border-gray-200">
              <Ionicons name="cart-outline" size={50} />
              <AppText>Your cart is currently empty</AppText>
            </View>
          ) : (
            <View className="gap-4">
              {cart.map((item, index) => {
                const lastIndexForStore =
                  storeGroups[item.storeId][storeGroups[item.storeId].length - 1];
                const showCheckoutButton = index === lastIndexForStore;

                const storeTotal = storeGroups[item.storeId]
                  .map(i => cart[i])
                  .reduce((sum, it) => sum + it.price * it.quantity, 0);

                return (
                  <View key={item.id}>
                    {/* Individual Cart Item */}
                    <View className="p-4 rounded-[20px] border border-gray-200">
                    <View className="flex-row items-center gap-4 ">
                      {item.imageUrl && (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={{ width: 70, height: 70, borderRadius: 14 }}
                        />
                      )}
                      <View className="flex-1">
                        <AppText className="text-[16px] font-semibold text-black">
                          {item.name}
                        </AppText>
                        <AppText className="text-gray-500 text-[14px]">
                          ₦{item.price} × {item.quantity}
                        </AppText>
                       
                      </View>
                      <AppText className="text-black font-bold">
                        ₦{item.price * item.quantity}
                      </AppText>
                      <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>

                      </View>
                                          <View className="flex-row gap-3 mt-2">
                      <TouchableOpacity
                        onPress={() =>
                          setShowVendorNoteInput(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="bg-orange-500 text-white px-3 py-3 rounded-xl my-5"
                      >
                        <AppText className="text-white">Add Vendor Note</AppText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          setShowRiderNoteInput(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="bg-orange-500 text-white px-3 py-3 rounded-xl my-5"
                      >
                        <AppText className="text-white">Add Rider Note</AppText>
                      </TouchableOpacity>
                    </View>

                    {showVendorNoteInput[item.id] && (
                      <TextInput
                        placeholder="Write a note for vendor..."
                        value={vendorNotes[item.id] || ""}
                        onChangeText={text =>
                          setVendorNotes(prev => ({ ...prev, [item.id]: text }))
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 5,
                        }}
                      />
                    )}
                    {showRiderNoteInput[item.id] && (
                      <TextInput
                        placeholder="Write a note for rider..."
                        value={riderNotes[item.id] || ""}
                        onChangeText={text =>
                          setRiderNotes(prev => ({ ...prev, [item.id]: text }))
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 5,
                        }}
                      />
                    )}

                    </View>

                    {/* ================= Notes Section ================= */}

                    {/* Checkout Button for this Store */}
                    {showCheckoutButton && (
                      <View className="mt-2 mb-4">
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#093131",
                            paddingVertical: 12,
                            borderRadius: 16,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                          onPress={() => checkOutStore(item.storeId)}
                          disabled={!!loadingStores[item.storeId]}
                        >
                          {loadingStores[item.storeId] ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <AppText className="text-white font-semibold text-[16px]">
                              Checkout ₦{storeTotal}
                            </AppText>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Order;
