import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/progressBar';
import "../../global.css";

interface User {
  username: string;
}
const style = StyleSheet.create({
  TopPageImag: {
      height: '100%',
      width: "100%",
    },
})
export default function Rider() {
  const [user, setUser] = useState<User>({ username: '' });

  if (user.username !== '') return <Redirect href="/user" />;

  return (
    <>
      <StatusBar />
      <ScrollView className="bg-white py-[12px] px-[8px]"
              contentContainerClassName='flex-1 items-center justify-center'
      >
        <SafeAreaView className="flex justify-center items-center">
          <View className="py-[24px] w-[300px] h-[400px] items-center justify-center">
            <Image
              source={require('@/assets/images/image-2.png')}
              style={style.TopPageImag}
            />
          </View>
          <View className="w-full mb-6 px-10">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-3">
              Earn on Your Schedule, Navigate with Ease
            </Text>
            <Text className="text-base text-gray-600 text-lg">
              Earn money by delivering orders from nearby stores to customers.
              Get real-time delivery requests and navigate easily with in-app directions.
            </Text>
          </View>

          <ProgressBar index={2} mylink="/user" value={50} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
