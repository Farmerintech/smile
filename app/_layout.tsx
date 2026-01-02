import { useFonts } from '@expo-google-fonts/roboto';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { setupFocusManager } from '@/app/lib/focusManager';
import { setupOnlineManager } from '@/app/lib/onlineManager';
import { queryClient } from '@/app/lib/queryClient';
import { useAppStore } from '@/app/store/useAppStore';
import { useColorScheme } from '@/hooks/useColorScheme';

// 🔌 Setup React Query managers ONCE
setupOnlineManager();
setupFocusManager();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrate = useAppStore((s) => s.hydrate);

  const [loaded] = useFonts({
    NunitoSans: require('../assets/fonts/NunitoSans-V.ttf'),
  });

  // 🔄 Hydrate Zustand store from SecureStore
  useEffect(() => {
    hydrate();
  }, []);

  // 🎨 Android navigation bar styling
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setPositionAsync('relative');
    }
  }, []);

  if (!loaded) return null;

  const screenOptions = {
    headerShown: false,
    headerShadowVisible: false,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="splash" options={screenOptions} />
          <Stack.Screen name="(tabs)" options={screenOptions} />
          <Stack.Screen name="(onboarding)" options={screenOptions} />
          <Stack.Screen name="(auth)" options={screenOptions} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
