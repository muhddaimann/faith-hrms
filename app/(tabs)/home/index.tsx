import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppScreen } from '../../../src/components/shared/appScreen';
import { LongList } from '../../../src/components/shared/longList';
import { OptionPicker } from '../../../src/components/shared/optionPicker';
import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { useTheme } from '../../../src/hooks/useTheme';
import { useOverlay } from '../../../src/hooks/useOverlay';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { customModal, dismiss } = useOverlay();

  const openActions = () => {
    customModal({
      render: () => (
        <OptionPicker
          mode="action"
            onSelect={(value) => dismiss(() => router.push(value as '/home/newsflash'))}
            options={[{ value: '/home/newsflash', label: 'Open Newsflash', description: 'Review company updates after the modal finishes closing.' }]}
          title="Home actions"
        />
      ),
    });
  };

  return (
    <>
      <AppScreen eyebrow="FAITH HRMS" reserveFloatingControls rightSlot={<HeaderAction onPress={openActions} />} subtitle="Your workplace companion for the updates that matter at work." title="Home">
        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, gap: theme.spacing.sm, ...theme.shadow.card }}>
            <Ionicons color={theme.colors.icon} name="briefcase-outline" size={28} />
            <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Your workday, organized</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Review company Newsflash updates alongside the workplace tools that support your day.</Text>
          </View>

          <ScreenAction label="Open Newsflash" onPress={() => router.push('/home/newsflash')} />
          <ScreenAction label="Return to Faith landing" secondary onPress={() => router.replace('/')} />
          <LongList label="Home foundation item" />
        </View>
      </AppScreen>
      <BottomBar />
    </>
  );
}

function HeaderAction({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return <Pressable accessibilityLabel="Open Home actions" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface })}><Ionicons color={theme.colors.icon} name="options-outline" size={22} /></Pressable>;
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