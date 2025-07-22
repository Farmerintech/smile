import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter()
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
  
    const [index, setIndex] = useState(0);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: 'black',
        headerShown: false,

        tabBarBackground: () => (
          <View
            className="bg-white border-t border-gray-200 shadow-md shadow-black/10"
            style={{
              flex: 1,
              borderTopWidth: Platform.OS === 'android' ? 1 : 0,
            }}
          />
        ),

        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 90 + insets.bottom,
          paddingTop:20,
          paddingBottom: insets.bottom,
          elevation: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0,
          },
          headerTitle: () => (
            <View className="flex flex-row justify-between items-center px-[5px] w-full">
              <View className="flex flex-col">
                {/* <Text className="font-semibold text-[14px] text-gray-700">Deliver to</Text> */}
                <View className="flex flex-row items-center space-x-2">
                   <MaterialIcons
                    name="place"
                    size={15}
                    color="#22AD5C"
                  />
                  <TouchableOpacity>
                    <Text className="text-[14px] font-[600] text-black" style={{fontFamily:"Roboto_400Regular "}}>Select Your Location...</Text>
                  </TouchableOpacity>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color="#22AD5C"
                  />
                </View>
              </View>
              <View
                className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center"
                style={{
                  shadowColor: 'rgba(13, 10, 44, 0.06)',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons
                  name="shopping-outline"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          ),
          headerTitleAlign: 'left',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={30}
              color={focused ? '#FF6347' : 'black'}
            />
          ),
        }}
      />
<Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search-outline"
              size={26}
              color={focused ? '#FF6347' : 'black'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Order',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="cart-outline"
              size={26}
              color={focused ? '#FF6347' : 'black'}
            />
          ),
        }}
      />
         <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-outline"
              size={26}
              color={focused ? '#FF6347' : 'black'}
            />
          ),
        }}
      />
   

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          headerShadowVisible:true,
          // headerStyle: {
          //   backgroundColor: 'white',
          //   elevation: 0,
          // },
          
          headerTitle: () => (
            <View className="flex flex-row justify-start gap-[16px] items-center px-[5px] w-full">
              <TouchableOpacity onPress={()=>router.back()} className='items-center justify-center flex'>
              <MaterialIcons
              name="chevron-left"
              size={26}
              color={'black'}
            />
              </TouchableOpacity>
              <Text className='font-[600] text-[16px]'>Profile</Text>
            </View>    
          ),   

          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={26}
              color={focused ? '#FF6347' : 'black'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
