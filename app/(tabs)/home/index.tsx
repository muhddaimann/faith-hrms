import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppScreen } from '../../../src/components/shared/appScreen';
import { OptionPicker } from '../../../src/components/shared/optionPicker';
import { Avatar } from '../../../src/components/tabs/avatar';
import { HomeHeader } from '../../../src/components/tabs/homeHeader';
import { ModuleCard } from '../../../src/components/tabs/moduleCard';
import { attendanceModuleIdentity, attendanceStatusMetadata } from '../../../src/constants/attendance';
import { authFeedback, authSignOutIdentity } from '../../../src/constants/auth';
import { leaveModuleIdentity } from '../../../src/constants/leave';
import type { ModuleIcon, ModuleTone } from '../../../src/constants/modules';
import { newsflashModuleIdentity, newsflashPriorityMetadata } from '../../../src/constants/newsflash';
import { profileModuleIdentity } from '../../../src/constants/profile';
import { formatRoomCompactDate, roomModuleIdentity } from '../../../src/constants/room';
import { supportModuleIdentity } from '../../../src/constants/support';
import { useAttendance } from '../../../src/hooks/useAttendance';
import { useAuth } from '../../../src/hooks/useAuth';
import { useLeave } from '../../../src/hooks/useLeave';
import { useNewsflash } from '../../../src/hooks/useNewsflash';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useProfile } from '../../../src/hooks/useProfile';
import { useRoom } from '../../../src/hooks/useRoom';
import { useSupport } from '../../../src/hooks/useSupport';
import { useTheme } from '../../../src/hooks/useTheme';

type HomeActionRoute = '/home/attendance' | '/home/leave/apply' | '/home/room' | '/settings/profile' | '/settings/support';
type OverviewRoute = '/home/attendance' | '/home/leave' | '/home/room' | '/home/newsflash' | '/settings/support';
type OverviewCard = {
  accessibilityLabel: string;
  detail: string;
  icon: ModuleIcon;
  key: string;
  metric: string;
  route: OverviewRoute;
  title: string;
  tone?: ModuleTone;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { completeSignOut, prepareSignOut } = useAuth();
  const { customModal, destructiveConfirm, dismiss, showLoader, toast } = useOverlay();
  const { dailyRecord } = useAttendance();
  const { applications, balances } = useLeave();
  const { bookings, getAvailabilityCount, rooms, selectedDate } = useRoom();
  const { isAcknowledged, items } = useNewsflash();
  const { enquiries } = useSupport();

  const attendanceMeta = dailyRecord ? attendanceStatusMetadata[dailyRecord.status] : null;
  const attendanceDetail = dailyRecord?.actualIn && dailyRecord.actualOut
    ? `In ${dailyRecord.actualIn} · Out ${dailyRecord.actualOut}`
    : dailyRecord?.scheduledIn && dailyRecord.scheduledOut
      ? `Scheduled ${dailyRecord.scheduledIn}–${dailyRecord.scheduledOut}`
      : 'No scheduled shift';
  const attendanceTone = attendanceMeta && attendanceMeta.tone !== 'neutral' ? attendanceMeta.tone : undefined;

  const remainingDays = balances.reduce((total, balance) => total + balance.remaining, 0);
  const pendingLeave = applications.filter((application) => application.status === 'pending').length;
  const availableSlots = rooms.reduce((total, room) => total + getAvailabilityCount(room.id), 0);
  const unreadUpdates = items.filter((item) => !isAcknowledged(item.id)).length;
  const topUnread = items.find((item) => !isAcknowledged(item.id));
  const openEnquiries = enquiries.filter((enquiry) => enquiry.status !== 'resolved').length;

  const cards: OverviewCard[] = [
    { key: 'attendance', title: 'Attendance', icon: attendanceMeta?.icon ?? attendanceModuleIdentity.icon, tone: attendanceTone ?? attendanceModuleIdentity.tone, metric: attendanceMeta?.label ?? 'No record', detail: attendanceDetail, route: '/home/attendance', accessibilityLabel: `Attendance, ${attendanceMeta?.label ?? 'no record'}` },
    { key: 'leave', title: 'Leave', icon: leaveModuleIdentity.icon, tone: leaveModuleIdentity.tone, metric: `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} left`, detail: `${pendingLeave} pending ${pendingLeave === 1 ? 'request' : 'requests'}`, route: '/home/leave', accessibilityLabel: `Leave, ${remainingDays} days remaining` },
    { key: 'room', title: 'Room booking', icon: roomModuleIdentity.icon, tone: roomModuleIdentity.tone, metric: `${availableSlots} slots`, detail: `${formatRoomCompactDate(selectedDate)} · ${bookings.length} booked`, route: '/home/room', accessibilityLabel: `Room booking, ${availableSlots} slots available` },
    { key: 'newsflash', title: 'Newsflash', icon: newsflashModuleIdentity.icon, tone: newsflashModuleIdentity.tone, metric: `${unreadUpdates} unread`, detail: topUnread ? `${newsflashPriorityMetadata[topUnread.priority].label} update awaiting` : 'All updates acknowledged', route: '/home/newsflash', accessibilityLabel: `Newsflash, ${unreadUpdates} unread` },
    { key: 'support', title: 'Support', icon: supportModuleIdentity.icon, tone: supportModuleIdentity.tone, metric: `${openEnquiries} open`, detail: 'Report a bug or feedback', route: '/settings/support', accessibilityLabel: `Support, ${openEnquiries} open enquiries` },
  ];

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

  const runAction = (value: string) => {
    if (value === 'logout') {
      requestLogout();
      return;
    }

    router.push(value as HomeActionRoute);
  };

  const openActions = () => {
    customModal({
      render: () => (
        <OptionPicker
          mode="action"
          onSelect={(value) => dismiss(() => runAction(value))}
          options={[
            { value: '/home/attendance', label: 'Manage Attendance', description: 'Review your attendance.', icon: attendanceModuleIdentity.icon, tone: attendanceModuleIdentity.tone },
            { value: '/home/leave/apply', label: 'Apply Leave', description: 'Start a local request.', icon: leaveModuleIdentity.icon, tone: leaveModuleIdentity.tone },
            { value: '/home/room', label: 'Book a Room', description: 'Reserve a meeting room.', icon: roomModuleIdentity.icon, tone: roomModuleIdentity.tone },
            { value: '/settings/profile', label: 'Manage Profile', description: 'Update your details.', icon: profileModuleIdentity.icon, tone: profileModuleIdentity.tone },
            { value: '/settings/support', label: 'Reach Support', description: 'Report a bug or feedback.', icon: supportModuleIdentity.icon, tone: supportModuleIdentity.tone },
            { value: 'logout', label: 'Log out', description: 'End this local session.', icon: authSignOutIdentity.icon, tone: authSignOutIdentity.tone },
          ]}
        />
      ),
    });
  };

  return (
    <AppScreen eyebrow="FAITH HRMS" reserveFloatingControls rightSlot={<AvatarAction onPress={openActions} />} subtitle="Your workday at a glance." title="Home">
      <View style={{ gap: theme.spacing.lg }}>
        <HomeHeader />
        <View accessibilityLabel="Module overview" accessibilityRole="summary" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
          {cards.map((card) => <ModuleCard accessibilityLabel={card.accessibilityLabel} detail={card.detail} icon={card.icon} key={card.key} metric={card.metric} onPress={() => router.push(card.route)} title={card.title} tone={card.tone} />)}
        </View>
      </View>
    </AppScreen>
  );
}

function AvatarAction({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  const { profile } = useProfile();

  return (
    <Pressable
      accessibilityHint="Opens Home actions."
      accessibilityLabel={`Open Home actions for ${profile.preferredName}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1, paddingLeft: theme.spacing.xxs, paddingRight: theme.spacing.sm, paddingVertical: theme.spacing.xxs })}
    >
      <Avatar fullName={profile.fullName} size={36} />
      <Ionicons color={theme.colors.iconMuted} name="chevron-down" size={18} />
    </Pressable>
  );
}
