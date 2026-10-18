import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';

import { useTheme } from '../../src/hooks/useTheme';
import { useAuth } from '../../src/hooks/useAuth';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { isAuthenticated, status } = useAuth();

  if (status !== 'authenticated' || !isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs screenOptions={{ headerShown: false, animation: 'none', tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}