import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { useTheme } from '../../../src/hooks/useTheme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>FAITH HRMS</Text>
          <Text style={{ ...theme.typography.display, color: theme.colors.text }}>Home</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Your workplace companion is ready for its first product modules.</Text>
        </View>

        <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, gap: theme.spacing.sm, ...theme.shadow.card }}>
          <Ionicons color={theme.colors.icon} name="briefcase-outline" size={28} />
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Your workday, organized</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This foundation is ready for attendance, leave, payslip, and profile modules.</Text>
        </View>

        <ScreenAction label="Open Home demo" onPress={() => router.push('/home/demo')} />
        <ScreenAction label="Return to Faith landing" secondary onPress={() => router.replace('/')} />
      </View>
      <BottomBar />
    </View>
  );
}

function ScreenAction({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: secondary ? 1 : 0,
        borderColor: theme.colors.borderStrong,
        borderRadius: theme.radius.md,
        backgroundColor: secondary ? theme.colors.surface : theme.colors.primary,
        opacity: pressed ? theme.opacity.pressed : 1,
        paddingHorizontal: theme.spacing.md,
      })}
    >
      <Text style={{ ...theme.typography.label, color: secondary ? theme.colors.text : theme.colors.textInverse }}>{label}</Text>
    </Pressable>
  );
}