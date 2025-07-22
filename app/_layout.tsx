import { useFonts } from "@expo-google-fonts/roboto";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar'; // ✅ Import this
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    NunitoSans: require('../assets/fonts/NunitoSans-V.ttf'),
  });

  // ✅ Set navigation bar background + icon style
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000'); // Black background
      NavigationBar.setButtonStyleAsync('light');        // White icons
      NavigationBar.setPositionAsync('relative');        // Keeps nav bar fixed
    }
  }, []);

  if (!loaded) return null;

  const options = { headerShown: false, headerShadowVisible: false };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack >
        <Stack.Screen name="splash" options={options} />
        <Stack.Screen name="(tabs)" options={options} />
        <Stack.Screen name="(onboarding)" options={options} />
        <Stack.Screen name="(auth)" options={options} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
