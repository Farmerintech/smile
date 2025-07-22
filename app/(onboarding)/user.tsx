import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/progressBar';

interface User {
  username: string;
}
const style = StyleSheet.create({
  TopPageImag: {
      height: "100%",
      width: "100%",
    },
})
export default function User() {
  const [user, setUser] = useState<User>({ username: '' });
  if (user.username !== '') return <Redirect href="/signup" />;

  return (
    <>
      <StatusBar />
      <ScrollView className="bg-white py-[12px] px-[8px]"
              contentContainerClassName='flex-1 items-center justify-center'
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="py-[24px] w-[300px] h-[400px] items-center justify-center">
            <Image
              source={require('@/assets/images/user.jpg')}
              style={style.TopPageImag}
            />
          </View>

          <View className="w-full mb-6 px-10">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-3">
              Shop Local, Anytime, Fast, Easy Delivery
            </Text>
            <Text className="text-base text-gray-600 text-lg">
              Browse and order from your favorite local stores all in one place.
              Enjoy fast, reliable delivery right to your doorstep with just a few taps.
            </Text>
          </View>

          <ProgressBar index={3} mylink="/signup" value={75} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
