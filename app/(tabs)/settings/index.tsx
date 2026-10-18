import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { ThemeToggle } from '../../../src/components/theme/themeToggle';
import { useTheme } from '../../../src/hooks/useTheme';

export default function SettingsScreen() {
  const { mode, selectedMode, theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>FAITH HRMS</Text>
            <Text style={{ ...theme.typography.display, color: theme.colors.text }}>Settings</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Review the active app foundation and session preferences.</Text>
          </View>
          <ThemeToggle />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
          <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primarySoft }}>
            <Ionicons color={theme.colors.icon} name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'} size={24} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Theme mode: {mode}</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{selectedMode === null ? 'Following device appearance.' : 'Manual session selection is active.'}</Text>
          </View>
        </View>

        <Pressable accessibilityLabel="Open Settings demo" accessibilityRole="button" onPress={() => router.push('/settings/demo')} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}>
          <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Open Settings demo</Text>
        </Pressable>
      </View>
      <BottomBar />
    </View>
  );
}