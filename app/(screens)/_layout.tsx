import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;
const router = useRouter()
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
      
      >
        {/* Account Screen */}
        <Stack.Screen name="errandDetails" 
  options={{
    headerShown: true,
    headerShadowVisible: false,
    headerTitle: "Account",
    headerLeft: () => (
      <TouchableOpacity  onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
        <Ionicons name="chevron-back" size={28} />
      </TouchableOpacity>
    ),
  }}
/> 

        {/* App Screen */}
        <Stack.Screen
          name="app"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
