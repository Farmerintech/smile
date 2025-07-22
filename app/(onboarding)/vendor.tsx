import { useState } from 'react';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../../components/progressBar';

interface User {
  username: string;
}

export default function Thirdscreen() {
  const [user, setUser] = useState<User>({ username: '' });


  return (
    <>
      <StatusBar />
      <ScrollView className="bg-white px-6 pt-12" 
                    contentContainerClassName='flex-1 items-center justify-center'
      >
        <SafeAreaView className="flex-1 justify-center items-center"        >
          <View className="w-full mb-6">
            <Image
              source={require('@/assets/images/image9.jpg')}
              className="w-full h-64 rounded-xl"
              resizeMode="cover"
            />
          </View>

          <View className="w-full mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              Shop Local, Anytime, Fast, Easy Delivery
            </Text>
            <Text className="text-base text-gray-600">
              Browse and order from your favorite local stores all in one place.
              Enjoy fast, reliable delivery right to your doorstep with just a few taps.
            </Text>
          </View>

          <ProgressBar index={3} mylink="/screenfour" value={75} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
