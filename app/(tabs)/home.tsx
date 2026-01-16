import { CartModal } from "@/components/cartModal";
import { data } from "@/components/data";
import LoginGuard from "@/components/loginGuard";
import { registerForPushNotificationsAsync } from "@/hooks/notifications";
import { useStatusBar } from "@/hooks/statusBar";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import "../../global.css";

import { router, useFocusEffect, usePathname } from "expo-router";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { AppTextBold } from "../_layout";
import { useAppStore } from "../store/useAppStore";

const items = [
  {
    label: "Restaurants",
    icon: "restaurant-outline",
    bgColor: "#FF6B35",
  },
  {
    label: "Pharmacies",
    icon: "medkit-outline",
    bgColor: "#2E8B6D",
  },
  {
    label: "Supermarket",
    icon: "cart-outline",
    bgColor: "#3B82F6",
  },
  {
    label: "Local Markets",
    icon: "basket-outline",
    bgColor: "#4FB38A",
  },
  {
    label: "Packages",
    icon: "cube-outline",
    bgColor: "#FF8F66",
  },
  {
    label: "Luggage",
    icon: "briefcase-outline",
    bgColor: "#1F6F58",
  },
  {
    label: "More",
    icon: "ellipsis-horizontal-outline",
    bgColor: "#6B7280",
  },
]
const Home = () => {
const { addToCart } = useAppStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

  const openModal = (item: any) => {
    setSelectedItem(item);

    setItemCounts((prev) => ({
      ...prev,
      [item.storeId]: prev[item.storeId] ?? 1,
    }));

    setModalVisible(true);
  };

  const add = () => {
    if (!selectedItem) return;

    setItemCounts((prev) => ({
      ...prev,
      [selectedItem.storeId]: prev[selectedItem.storeId] + 1,
    }));
  };

  const reduce = () => {
    if (!selectedItem) return;

    setItemCounts((prev) => ({
      ...prev,
      [selectedItem.storeId]: Math.max(
        1,
        prev[selectedItem.storeId] - 1
      ),
    }));
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addToCart({
      id: selectedItem.storeId.toString(),
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.imageUrl,
      quantity: itemCounts[selectedItem.storeId],
    });

    setModalVisible(false);
    sendTestNotification()

  };
  
   const {user} = useAppStore();
    useEffect(()=>{
      if(!user || user.email===''){
        router.replace("/(auth)/signin")
      }
    })

useEffect(() => {
  (async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("TOKEN FROM SCREEN:", token);
      }
    } catch (err) {
      console.log("Push registration failed:", err);
    }
  })();
}, []);


  async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Cart Updated`,
      body: `${selectedItem.name} added to cart`,
      sound: "default",
      //    data: {
      //   url: `/order` // deep link to a route in your app
      // },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
}
  const { width } = Dimensions.get("window");

  const cardWidth = width * 0.45;
 useStatusBar("white", "dark-content");
 const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const onBackPress = () => {
        // If we're on the home tab root
        if (pathname === "/(tabs)/home") {
          BackHandler.exitApp(); // minimizes the app
          return true; // prevent default navigation
        }

        // return false; // allow normal back behavior
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => sub.remove();
    }, [pathname])
  );

 


  return (
    <LoginGuard>
     <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
  <ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ paddingBottom: 0 }}
  contentInsetAdjustmentBehavior="automatic"
>

          {/* <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/> */}
          <View className="w-full p-4 ">
            <View
              className="flex-row items-center shadow rounded-[20px] px-4 py-3 mb-4"
              style={{
                backgroundColor: "#F1F5F9", // inputBackground
              }}
            >
              {/* Search Icon */}
              <Ionicons
                name="search-outline"
                size={20}
                color="#6B7280" // textSecondary
              />

              {/* Input */}
              <TextInput
                className="flex-1 mx-3 text-[15px]"
                placeholder="Search vendors around you..."
                placeholderTextColor="#9CA3AF" // textMuted
                onChangeText={() => { }}
                value=""
                style={{
                  color: "#1A1A1A", // textPrimary
                }}
              />

              {/* Filter Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FF6B35", // primaryOrange
                }}
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.label}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + 16}
              decelerationRate="fast"
              contentContainerStyle={{ paddingRight: 16 }}
              ItemSeparatorComponent={() => <View className="w-4" />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="rounded-[16px] flex flex-row px-4 py-1 items-center justify-between"
                  style={{
                    width: cardWidth,
                    backgroundColor: item.bgColor,
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 4,
                  }}
                >
                  <View className="rounded-full bg-white/20 p-3">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <Text className="text-white text-[18px] font-semibold text-center">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

          </View>


          <View className="px-5 py-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <AppTextBold
                className="text-[20px] font-bold"
                style={{ color: "#1A1A1A" }}
              >
                Popular Vendors
              </AppTextBold>

              <TouchableOpacity className="flex flex-row gap-1 items-center justify-center">
                <AppTextBold
                  className="text-[14px] font-semibold"
                  style={{ color: "#FF6B35" }}
                >
                  See all
                </AppTextBold>
                <Ionicons name="chevron-forward"  color= "#FF6B35" size={20} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item.storeId.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingVertical: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
               onPress={() => openModal(item)}
                  activeOpacity={0.9}
                  className="rounded-[20px]"
                  style={{
                    width: 260,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 4,
                  }}
                >
                  {/* Image */}
                  <View className="relative">
                    <Image
                      source={item.imageUrl}
                      style={{
                        width: "100%",
                        height: 140,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    />

                    {/* Favorite */}
                    <TouchableOpacity
                      className="absolute top-3 right-3 h-9 w-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      <MaterialIcons
                        name="favorite"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Content */}
                  <View className="px-4 py-3">
                    <Text
                      numberOfLines={1}
                      className="text-[16px] font-semibold mb-1"
                      style={{ color: "#1A1A1A" }}
                    >
                      {item.name}
                    </Text>

                    {/* Rating row */}
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Text className="text-[13px] ml-1 mr-2" style={{ color: "#1A1A1A" }}>
                        4.9
                      </Text>

                      <Text className="text-[13px]" style={{ color: "#6B7280" }}>
                        25–35 min · Italian
                      </Text>
                    </View>

                    {/* Chips */}
                    <View className="flex-row items-center gap-2">
                      <View className="flex-row items-center px-2 py-1 rounded-full" style={{ backgroundColor: "#FFE7DC" }}>
                        <Ionicons name="restaurant" size={12} color="#FF6B35" />
                        <Text className="ml-1 text-[12px]" style={{ color: "#FF6B35" }}>
                          Meals
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons name="bicycle" size={14} color="#2E8B6D" />
                        <Text className="ml-1 text-[12px]" style={{ color: "#2E8B6D" }}>
                          1.3 km
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View className="px-5 py-4">
            <Text
              className="text-[20px] font-bold mb-3"
              style={{ color: "#1A1A1A" }}
            >
              Vendors Near You
            </Text>

            {data.map((item) => (
              <TouchableOpacity
             onPress={() => openModal(item)}
                key={item.storeId}
                activeOpacity={0.9}
                className="mb-5"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 4,
                }}
              >
                {/* Image */}
                <View className="relative">
                  <Image
                    source={item.imageUrl}
                    style={{
                      width: "100%",
                      height: 180,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  />

                  <TouchableOpacity
                    className="absolute top-3 right-3 h-9 w-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <MaterialIcons name="favorite" size={18} color="#2E8B6D" />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-4 py-3">
                  <Text
                    className="text-[16px] font-semibold mb-1"
                    style={{ color: "#1A1A1A" }}
                  >
                    {item.name}
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={14} color="#FACC15" />
                    <Text className="ml-1 mr-2 text-[13px]" style={{ color: "#1A1A1A" }}>
                      4.8
                    </Text>

                    <Text className="text-[13px]" style={{ color: "#6B7280" }}>
                      1.1 km · Grill · BBQ
                    </Text>
                  </View>

                  {/* Footer row */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="bicycle" size={16} color="#2E8B6D" />
                      <Text className="ml-1 text-[13px]" style={{ color: "#2E8B6D" }}>
                        FREE DELIVERY
                      </Text>
                    </View>

                    <Text className="text-[14px] font-semibold" style={{ color: "#1A1A1A" }}>
                      $$
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

      </View>
      {/* ✅ CART MODAL */}
         {selectedItem && (
        <CartModal
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          source={selectedItem.imageUrl}
          price={selectedItem.price}
          count={itemCounts[selectedItem.storeId]}
          onAdd={add}
          onReduce={reduce}
          onAddToCart={handleAddToCart}
        />
      )}
    </LoginGuard>
  );
};

export default Home;
