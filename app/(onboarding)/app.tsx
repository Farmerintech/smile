import { useAppStore } from "@/app/store/useAppStore";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/progressBar';
import "../../global.css";


export default function App() {

  // Retrieve user from AsyncStorage
 const completeOnboarding = useAppStore(s => s.completeOnboarding);
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);

  // Complete onboarding only once
 useEffect(() => {
  return () => {
    // This runs when the user LEAVES the onboarding page
    if (!hasCompletedOnboarding) {
      completeOnboarding();
    }
  };
}, [hasCompletedOnboarding]);




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
      <ScrollView 
        contentContainerClassName=' py-[12px]  flex-1 items-center justify-center bg-[#093131]'
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="py-[32px]  w-[300px] rounded-[24px]  items-center justify-between">
  
  {/* Asset Placeholder */}
  <View className="w-[120px] h-[120px] rounded-full bg-[#1EBA8D]/20 items-center justify-center mb-[20px]">
    {/* Replace later with Image or SVG */}
    <Ionicons name="cube-outline" size={62} color="#1EBA8D" />


  </View>

  {/* Text Content */}
  <View className="items-center">
    <Text className="text-white text-[26px] font-bold text-center mb-[12px]">
                  Delivery Right at Your Door Step

    </Text>
    <Text className="text-[#CFEDEA] text-[16px] text-center ">
                  Enjoy fast, reliable delivery right to your doorstep with just a few taps.

      
    </Text>
  
  </View>

  {/* Helper Text */}

</View>


          <ProgressBar index={2} mylink="/(auth)/signin" value={100} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
