import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ProfileEditForm } from '../../../../src/components/profile/profileEditForm';
import { ProfileHeader } from '../../../../src/components/profile/profileHeader';
import { ProfileInfoCard, type ProfileInfoItem } from '../../../../src/components/profile/profileInfoCard';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { profileFeedback, validateProfileDraft, type ProfileDraft } from '../../../../src/constants/profile';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useProfile } from '../../../../src/hooks/useProfile';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const { customModal, dismiss, showLoader, toast } = useOverlay();
  const { theme } = useTheme();

  const contactItems: ProfileInfoItem[] = [
    { icon: 'mail-outline', label: 'Work email', value: profile.workEmail },
    { icon: 'call-outline', label: 'Work phone', value: profile.workPhone },
    { icon: 'location-outline', label: 'Work location', value: profile.workLocation },
  ];

  const employmentItems: ProfileInfoItem[] = [
    { icon: 'card-outline', label: 'Employee ID', value: profile.employeeId },
    { icon: 'briefcase-outline', label: 'Department', value: profile.department },
    { icon: 'people-outline', label: 'Manager', value: profile.managerName },
    { icon: 'calendar-outline', label: 'Started', value: profile.startDate },
  ];

  const saveProfile = (draft: ProfileDraft) => {
    const validationMessage = validateProfileDraft(draft);

    if (validationMessage) {
      toast({ tone: 'warning', title: 'Complete your profile details', message: validationMessage });
      return;
    }

    dismiss(() => {
      showLoader({
        duration: profileFeedback.updateLoaderDurationMs,
        label: 'Updating your profile…',
        onComplete: () => {
          updateProfile(draft);
          toast({ tone: 'success', title: 'Profile updated', message: 'Your work profile was updated for this session.' });
        },
      });
    });
  };

  const openEditor = () => {
    customModal({
      render: () => <ProfileEditForm onCancel={() => dismiss()} onSave={saveProfile} profile={profile} />,
    });
  };

  return (
    <AppScreen
      eyebrow="MY PROFILE"
      onBack={() => router.replace('/settings')}
      rightSlot={(
        <Pressable
          accessibilityHint="Opens an editor for your local profile details."
          accessibilityLabel="Edit profile"
          accessibilityRole="button"
          onPress={openEditor}
          style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}
        >
          <Ionicons color={theme.colors.icon} name="create-outline" size={21} />
        </Pressable>
      )}
      subtitle="Your employment details."
      title="Work profile"
    >
      <View style={{ gap: theme.spacing.lg }}>
        <ProfileHeader profile={profile} />
        <ProfileInfoCard items={contactItems} title="Contact details" />
        <ProfileInfoCard items={employmentItems} title="Employment details" />
      </View>
    </AppScreen>
  );
}