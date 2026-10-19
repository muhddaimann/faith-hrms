import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LeaveApplicationCard } from '../../../../src/components/leave/leaveApplicationCard';
import { LeaveApplicationDetail } from '../../../../src/components/leave/leaveApplicationDetail';
import { LeaveBalanceCard } from '../../../../src/components/leave/leaveBalanceCard';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { TabSelector, type TabSelectorTone } from '../../../../src/components/shared/tabSelector';
import { getLeaveType, leaveFeedback, type LeaveApplication, type LeaveApplicationFilter } from '../../../../src/constants/leave';
import { useLeave } from '../../../../src/hooks/useLeave';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useTheme } from '../../../../src/hooks/useTheme';

const leaveFilters: readonly LeaveApplicationFilter[] = ['all', 'pending', 'approved', 'cancelled', 'rejected'];

const leaveFilterLabels: Record<LeaveApplicationFilter, string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

const leaveFilterTones: Record<LeaveApplicationFilter, TabSelectorTone> = {
  all: 'primary',
  pending: 'warning',
  approved: 'success',
  cancelled: 'info',
  rejected: 'danger',
};


export default function LeaveRecordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { applications, balances, cancelApplication } = useLeave();
  const { bottomSheet, destructiveConfirm, dismiss, showLoader, toast } = useOverlay();
  const [selectedFilter, setSelectedFilter] = useState<LeaveApplicationFilter>('all');
  const records = useMemo(() => [...applications].sort((first, second) => second.createdAt.localeCompare(first.createdAt)).filter((application) => selectedFilter === 'all' || application.status === selectedFilter), [applications, selectedFilter]);

  const requestCancellation = (application: LeaveApplication) => {
    const type = getLeaveType(application.typeId);
    destructiveConfirm({
      title: 'Cancel leave request?',
      message: `${type?.label ?? 'This'} request is only a local preview and will be marked cancelled for this session.`,
      confirmLabel: 'Cancel request',
      onConfirm: () => showLoader({ duration: leaveFeedback.cancellationLoaderDurationMs, label: 'Cancelling leave request…', onComplete: () => {
        if (cancelApplication(application.id)) {
          toast({ tone: 'success', title: 'Leave request cancelled', message: 'Your local pending balance has been restored for this session.' });
        }
      } }),
    });
  };

  const openApplication = (application: LeaveApplication) => {
    bottomSheet({ render: () => <LeaveApplicationDetail application={application} onCancel={() => dismiss(() => requestCancellation(application))} /> });
  };

  return (
    <AppScreen eyebrow="LEAVE MANAGEMENT" onBack={() => router.replace('/home')} rightSlot={<ApplyButton onPress={() => router.push('/home/leave/apply')} />} subtitle="Track local requests." title="My leave">
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Text style={{ ...theme.typography.label, color: theme.colors.primary }}>LOCAL HR PREVIEW</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Leave balances and applications are fictional, reset on restart, and are not sent to HR.</Text></View>
        <View style={{ gap: theme.spacing.sm }}><Text style={{ ...theme.typography.title, fontSize: 20, lineHeight: 28, color: theme.colors.text }}>Applications</Text><TabSelector accessibilityLabel="Leave application status" items={leaveFilters.map((filter) => ({ accessibilityLabel: filter === 'all' ? 'All leave applications' : `${leaveFilterLabels[filter]} leave applications`, label: leaveFilterLabels[filter], tone: leaveFilterTones[filter], value: filter }))} onSelect={setSelectedFilter} scrollable selectedValue={selectedFilter} />{records.length === 0 ? <EmptyState description={selectedFilter === 'all' ? 'New local leave requests will appear here during this app session.' : `There are no ${selectedFilter} local leave applications during this session.`} icon="calendar-outline" title={selectedFilter === 'all' ? 'No leave applications' : `No ${selectedFilter} applications`} /> : records.map((application) => <LeaveApplicationCard application={application} key={application.id} onPress={() => openApplication(application)} />)}</View>
        <View style={{ gap: theme.spacing.sm }}><Text style={{ ...theme.typography.title, fontSize: 20, lineHeight: 28, color: theme.colors.text }}>Leave balances</Text>{balances.map((balance) => <LeaveBalanceCard balance={balance} key={balance.typeId} />)}</View>
      </View>
    </AppScreen>
  );
}

function ApplyButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return <Pressable accessibilityLabel="Apply for leave" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.md })}><Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Apply</Text></Pressable>;
}