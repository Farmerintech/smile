import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAppStore } from "../store/useAppStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // if (!loaded) return null;
    const {user} = useAppStore();
    useEffect(()=>{
      if(!user || user.email===''){
        router.push("/(auth)/signin")
      }
    })
const router = useRouter()
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
      
      >
        {/* Account Screen */}
  <Stack.Screen name="trackOrder" 
  options={{
    headerShown: true,
    headerShadowVisible: true,
    headerTitle: "Trcak Order",
    headerLeft: () => (
      <TouchableOpacity  onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
        <MaterialIcons name="chevron-left" size={28} />
      </TouchableOpacity>
    ),
  }}
/> 
  <Stack.Screen name="account" 
  options={{
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: "Account",
    headerLeft: () => (
      <TouchableOpacity  onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
        <MaterialIcons name="chevron-left" size={28} />
      </TouchableOpacity>
    ),
  }}
/> 
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
