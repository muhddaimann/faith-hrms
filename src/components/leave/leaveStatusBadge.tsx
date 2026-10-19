import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { type LeaveApplicationStatus } from '../../constants/leave';
import { useTheme } from '../../hooks/useTheme';

const metadata: Record<LeaveApplicationStatus, { icon: keyof typeof Ionicons.glyphMap; label: string; tone: 'success' | 'warning' | 'danger' | 'info' }> = {
  pending: { label: 'Pending', icon: 'time-outline', tone: 'warning' },
  approved: { label: 'Approved', icon: 'checkmark-circle-outline', tone: 'success' },
  cancelled: { label: 'Cancelled', icon: 'close-circle-outline', tone: 'info' },
  rejected: { label: 'Rejected', icon: 'alert-circle-outline', tone: 'danger' },
};

export function LeaveStatusBadge({ status }: { status: LeaveApplicationStatus }) {
  const { theme } = useTheme();
  const item = metadata[status];
  const soft = `${item.tone}Soft` as const;
  return <View accessibilityLabel={item.label} style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors[soft], paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}><Ionicons color={theme.colors[item.tone]} name={item.icon} size={16} /><Text style={{ ...theme.typography.label, color: theme.colors[item.tone] }}>{item.label}</Text></View>;
}