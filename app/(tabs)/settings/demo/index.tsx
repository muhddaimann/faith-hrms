import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../../../src/hooks/useTheme';

export default function SettingsDemoScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.md }}>
        <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>SETTINGS / DEMO</Text>
        <Text style={{ ...theme.typography.display, color: theme.colors.text }}>Settings demo</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This route is intentionally full-screen and has no floating tab bar.</Text>
      </View>
      <Pressable accessibilityLabel="Return to Settings" accessibilityRole="button" onPress={() => router.replace('/settings')} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}>
        <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Return to Settings</Text>
      </Pressable>
    </View>
  );
}