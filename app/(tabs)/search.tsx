// screens/Search.tsx
import { CartModal } from "@/components/cartModal";
import { data } from "@/components/data";
import { SearchInput } from "@/components/form/formInput";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const items = [
  "All",
  "Resturants",
  "Pharmacies",
  "Supermarket",
  "Local Markets",
  "Packages",
  "Lugage",
  "More",
];


const Search = () => {
  const [index, setIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [img, setImg] = useState()
  const [price, setPrice] = useState<number>()

  const  handleModalOpen = (item:any, price:number) =>{
    setImg(item);
    setModalVisible(true)
    setPrice(price)
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <FlatList
          data={data}
          keyExtractor={(item) => item.storeId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 150,
            zIndex:20
          }}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View className="bg-[#F0F0F0]">
              <View style={{ paddingHorizontal: 18, paddingTop: 50, backgroundColor: "white"}}>
                <SearchInput
                  name=""
                  placeHolder=""
                  action={() => {}}
                  label=""
                  value=""
                  error=""
                  icon=""
                  style="py-2 border border-gray-200"
                />
                <FlatList
                  data={items}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 4, paddingVertical: 12,}}
                  renderItem={({ item, index: i }) => (
                    <TouchableOpacity
                      onPress={() => setIndex(i)}
                      className={`px-3 h-[30px] ${
                        index === i ? "bg-black" : ""
                      } rounded-[3px] flex items-center justify-center mr-2`}
                    >
                      <Text
                        className={`${
                          index === i ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "white", 
                  marginTop:4
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "500" }}>
                    25 Results for "Chicken"
                  </Text>
                  <Text style={{ fontSize: 14, color: "#f87171" }}>
                    Clear Search
                  </Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomColor: "gray",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={item.imageUrl}
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                />
              </View>
              <TouchableOpacity
                style={{ flex: 1, marginLeft: 10 }}
                onPress={() => {
                  handleModalOpen(item.imageUrl, item.price);
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  Chicken Republic - {item.name}
                </Text>
                <Text style={{ color: "#555" }}>
                  From N {item.price} | 12m ride
                </Text>
              </TouchableOpacity>
              <MaterialIcons name="favorite-outline" size={20} />
            </View>
          )}
        />
      </SafeAreaView>
      <CartModal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        source={img}
        price={price || 0}
      />
    </>
  );
};

export default Search;
