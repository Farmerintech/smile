import { CartModal } from "@/components/cartModal";
import { data } from "@/components/data";
import { SearchInput } from "@/components/form/formInput";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const items = [
  "Resturants",
  "Pharmacies",
  "Supermarket",
  "Local Markets",
  "Packages",
  "Lugage",
  "More",
];
const Home = () => {
 const [isModalVisible, setModalVisible] = useState(false);
  const [img, setImg] = useState()
  const [price, setPrice] = useState<number>()
  const  handleModalOpen = (item:any, price:number,) =>{
    setImg(item);
    setModalVisible(true)
    setPrice(price)
  }
  return (
    <>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={"#093131"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 200 }}
      >
        <View className="py-2 bg-[#093131]" style={{ paddingHorizontal: 16 }}>
          <View className="w-full rounded-[12px] h-[72px] px-[12px] font-[600] bg-[#093131]"></View>
          <View className="py-4">
            <SearchInput
              name=""
              placeHolder=""
              action={() => {}}
              value=""
              error=""
              icon={""}
              style={''}
            />
          </View>
          <View className=" w-full p-0">
            <Text className="text-[24px]">Explore</Text>
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
              className=" pt-5 pb-3"
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {}}>
                  <Text className="text-[16px] " style={{fontFamily:"Noto Sans, sans-serif"}}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View className="py-5 bg-white px-5 mt-2 ">
          <View className=" w-full p-0">
            <Text className="text-[24px] mb-2">Most Popular</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.storeId.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 16,
              paddingTop: 20,
              paddingBottom: 12,
            }}
            renderItem={({ item }) => (
              <View>
                <View className="w-[250px] h-[160px] items-center justify-center">
                  <Image
                    source={item.imageUrl}
                    style={{ width: 250, height: 150, resizeMode: "cover" }}
                    className="rounded-[12px] mb-10"
                  />
                </View>
                <TouchableOpacity onPress={() => {handleModalOpen(item.imageUrl, item.price)}}>
                  <View className="flex flex-row justify-between">
                    <Text className="text-[16px]">{item.name}</Text>
                    <MaterialIcons name="favorite-outline" size={20} />
                  </View>

                  <Text>From N {item.price}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View className="py-5 bg-white px-5 mt-2 ">
          <View className=" w-full p-0">
            <Text className="text-[24px] mb-2">Handpicked For You</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.storeId.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 16,
              paddingTop: 20,
              paddingBottom: 12,
            }}
            renderItem={({ item }) => (
              <View>
                <View className="w-[250px] h-[160px] items-center justify-center">
                  <Image
                    source={item.imageUrl}
                    style={{ width: 250, height: 150, resizeMode: "cover" }}
                    className="rounded-[12px] mb-10"
                  />
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <View className="flex flex-row justify-between">
                    <Text className="text-[16px]">{item.name}</Text>
                    <MaterialIcons name="favorite-outline" size={20} />
                  </View>

                  <Text>From N {item.price}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View className="py-5 bg-white px-5 mt-2 ">
          <View className=" w-full p-0">
            {/* <Text className="text-[24px] mb-2">Handpicked For You</Text> */}
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.storeId.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 16,
              paddingTop: 20,
              paddingBottom: 12,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {}} className="mb-2 mt-4">
                <View className="w-full h-[160px] items-center justify-center ">
                  <Image
                    source={item.imageUrl}
                    style={{ width: "100%", height: 150, resizeMode: "cover" }}
                    className="rounded-[12px] "
                  />
                </View>
                <View className="px-[8px]">
                  <View className="flex flex-row justify-between">
                    <Text className="text-[16px]">{item.name}</Text>
                    <MaterialIcons name="favorite-outline" size={20} />
                  </View>

                  <Text>From N {item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
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

export default Home;
