import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
    // #093131
    // #328264
    // #083232
    // #c6D7Cf
    // #34A979
    //bg-[#1EBA8D]/20

// Details
// #1EBA8D
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
      <ScrollView 
        contentContainerClassName=' py-[12px]  flex-1 items-center justify-center bg-[#093131]'
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="py-[32px]  w-[300px] rounded-[24px]  items-center justify-between">
  
  {/* Asset Placeholder */}
  <View className="w-[120px] h-[120px] rounded-full bg-[#1EBA8D]/20 items-center justify-center mb-[20px]">
    {/* Replace later with Image or SVG */}
    <Ionicons name="cart-outline" size={62} color="#1EBA8D" />


  </View>

  {/* Text Content */}
  <View className="items-center">
    <Text className="text-white text-[26px] font-bold text-center mb-[12px]">
      Shop Local, Anytime, Fast, Easy Delivery
    </Text>
    <Text className="text-[#CFEDEA] text-[16px] text-center ">
      Browse and order from your favorite local stores all in one place.
      
    </Text>
  
  </View>

  {/* Helper Text */}

</View>


          <ProgressBar index={1} mylink="/app" value={50} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
