import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from './context/reducer';

export const SplashScreen = () => {
  const { user, loading } = useAppContext();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!loading) {
      if (user.isLoggedIn) {
        navigation.replace('index');
      } else {
        navigation.replace('index');
      }
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌟 MyApp</Text>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});