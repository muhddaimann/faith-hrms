import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppScreen } from '../../../src/components/shared/appScreen';
import { TintedSurface } from '../../../src/components/shared/tintedSurface';
import { Avatar } from '../../../src/components/tabs/avatar';
import { SettingsRow } from '../../../src/components/tabs/settingsRow';
import { ThemeToggle } from '../../../src/components/theme/themeToggle';
import { about } from '../../../src/constants/about';
import { authFeedback } from '../../../src/constants/auth';
import { profileModuleIdentity } from '../../../src/constants/profile';
import { supportModuleIdentity } from '../../../src/constants/support';
import { useAuth } from '../../../src/hooks/useAuth';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useProfile } from '../../../src/hooks/useProfile';
import { useSupport } from '../../../src/hooks/useSupport';
import { useTheme } from '../../../src/hooks/useTheme';

export default function SettingsScreen() {
  const { mode, selectedMode, theme } = useTheme();
  const router = useRouter();
  const { destructiveConfirm, showLoader, toast } = useOverlay();
  const { completeSignOut, prepareSignOut } = useAuth();
  const { profile } = useProfile();
  const { enquiries } = useSupport();
  const openEnquiries = enquiries.filter((enquiry) => enquiry.status !== 'resolved').length;

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
    <AppScreen eyebrow="FAITH HRMS" reserveFloatingControls rightSlot={<ThemeToggle />} subtitle="Your account and app preferences." title="Settings">
      <View style={{ gap: theme.spacing.lg }}>
        <Pressable accessibilityHint="Views and updates your work profile." accessibilityLabel="Open my profile" accessibilityRole="button" onPress={() => router.push('/settings/profile')} style={({ pressed }) => ({ borderRadius: theme.radius.xl, opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card })}>
          <TintedSurface contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg }} tone={profileModuleIdentity.tone}>
            <Avatar fullName={profile.fullName} size={56} />
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{profile.preferredName}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{profile.jobTitle}</Text>
              <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{profile.department} · {profile.workEmail}</Text>
            </View>
          </TintedSurface>
        </Pressable>

        <TintedSurface contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg }} tone="primary">
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>Appearance</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{mode === 'dark' ? 'Dark' : 'Light'} · {selectedMode === null ? 'following device appearance' : 'manual session selection'}</Text>
          </View>
          <Ionicons color={theme.colors.primary} name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'} size={30} />
        </TintedSurface>

        <SettingsRow accessibilityLabel={`Open support, ${openEnquiries} open ${openEnquiries === 1 ? 'enquiry' : 'enquiries'}`} detail={`${openEnquiries} open ${openEnquiries === 1 ? 'enquiry' : 'enquiries'}`} icon={supportModuleIdentity.icon} onPress={() => router.push('/settings/support')} title="Support" tone={supportModuleIdentity.tone} />

        <View style={{ gap: theme.spacing.xxs, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
          <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Faith {about.version}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>A local, non-production HR preview. Records reset when the app restarts.</Text>
        </View>

        <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={requestLogout} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.danger, borderRadius: theme.radius.md, backgroundColor: theme.colors.dangerSoft, opacity: pressed ? theme.opacity.pressed : 1 })}>
          <Text style={{ ...theme.typography.label, color: theme.colors.danger }}>Sign out</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}
