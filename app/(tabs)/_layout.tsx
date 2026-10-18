import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { useTheme } from '../../src/hooks/useTheme';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs screenOptions={{ headerShown: false, animation: 'none', tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}