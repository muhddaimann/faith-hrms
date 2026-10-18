import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';

import { AppScreen } from '../../../src/components/shared/appScreen';
import { LongList } from '../../../src/components/shared/longList';
import { OptionPicker } from '../../../src/components/shared/optionPicker';
import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { ThemeToggle } from '../../../src/components/theme/themeToggle';
import { useTheme } from '../../../src/hooks/useTheme';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useAuth } from '../../../src/hooks/useAuth';
import { authFeedback } from '../../../src/constants/auth';

export default function SettingsScreen() {
  const { mode, selectedMode, theme } = useTheme();
  const router = useRouter();
  const { bottomSheet, destructiveConfirm, dismiss, showLoader, toast } = useOverlay();
  const { completeSignOut, prepareSignOut } = useAuth();
  const [preference, setPreference] = useState('default');

  const openPreferences = () => {
    bottomSheet({
      render: () => <OptionPicker mode="preference" onSelect={(value) => { setPreference(value); dismiss(); }} options={[{ value: 'default', label: 'System default', description: 'Keep the standard session setup.' }, { value: 'compact', label: 'Compact updates', description: 'A session-only settings specimen.' }]} selectedValue={preference} title="Display preference" />,
    });
  };

  const requestLogout = () => {
    destructiveConfirm({
      title: 'Sign out of Faith?',
      message: 'Your secure local session will be removed from this device.',
      confirmLabel: 'Sign out',
      onConfirm: () => {
        void prepareSignOut().then((didSignOut) => {
          if (didSignOut) {
            showLoader({
              duration: authFeedback.minimumLoaderDurationMs,
              label: 'Signing you out…',
              onComplete: () => {
                completeSignOut();
                router.replace('/');
              },
            });
            return;
          }

          toast({ tone: 'danger', title: 'Could not sign out', message: 'Your secure session could not be cleared. Please try again.' });
        });
      },
    });
  };

  return (
    <>
      <AppScreen eyebrow="FAITH HRMS" reserveFloatingControls rightSlot={<ThemeToggle />} subtitle="Review the active app foundation and session preferences." title="Settings">
        <View style={{ gap: theme.spacing.lg }}>
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
          <Pressable accessibilityLabel="Choose display preference" accessibilityRole="button" onPress={openPreferences} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Display preference: {preference === 'default' ? 'System default' : 'Compact updates'}</Text>
          </Pressable>
          <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={requestLogout} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.danger, borderRadius: theme.radius.md, backgroundColor: theme.colors.dangerSoft, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.danger }}>Sign out</Text>
          </Pressable>
          <LongList label="Settings foundation item" />
        </View>
      </AppScreen>
      <BottomBar />
    </>
  );
}