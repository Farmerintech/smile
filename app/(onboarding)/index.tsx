import { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/progressBar';
import "../../global.css";
interface User {
  username: string;
}

export default function Index() {
  const [user, setUser] = useState<User>({ username: '' });

  // Retrieve user from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
    //   try {
    //     const userData = await AsyncStorage.getItem('@user_info');
    //     if (userData) {
    //       setUser(JSON.parse(userData));
    //     }
    //   } catch (error) {
    //     console.error('Failed to load user data:', error);
    //   }
    // 
    };

    loadUserData();
  }, []);

  // Redirect if user exists
//   if (user.username !== '') return <Redirect href="/rider" />;
const style = StyleSheet.create({
  TopPageImag: {
      height: "100%",
      width: "100%",
    },
  container:{
    display:'flex',
    justifyContent:"center",
    alignItems:"center"
  }
})
  return (
    <>
      <StatusBar />
      <ScrollView className="bg-white py-[12px] px-[8px]"
        contentContainerClassName='flex-1 items-center justify-center'
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="py-[24px] w-[300px] h-[400px] items-center justify-center">
            <Image
              source={require('@/assets/images/vendor.jpg')}
              style={style.TopPageImag}
            />
          </View>
          <View className="w-full mb-6 px-2">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-3">
              Showcase Your Products, Grow Your Business
            </Text>
            <Text className="text-base text-gray-600 text-lg">
              Easily upload and showcase your products to a wide audience right from your store. Reach more customers and grow your business with reliable in-app delivery support.
            </Text>
          </View>

          <ProgressBar index={1} mylink="/rider" value={25} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
