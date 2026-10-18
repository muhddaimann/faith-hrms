import { Stack } from 'expo-router';

import { useTheme } from '../../../src/hooks/useTheme';

export default function SettingsLayout() {
  const { theme } = useTheme();

  return <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: theme.colors.background } }} />;
}