import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { formatLeaveRange, getLeaveType, type LeaveApplication } from '../../constants/leave';
import { useTheme } from '../../hooks/useTheme';
import { LeaveStatusBadge } from './leaveStatusBadge';

export function LeaveApplicationCard({ application, onPress }: { application: LeaveApplication; onPress: () => void }) {
  const { theme } = useTheme();
  const type = getLeaveType(application.typeId);
  if (!type) return null;

  return (
    <Pressable
      accessibilityHint="Opens the leave request details."
      accessibilityLabel={`${type.label}, ${application.status}, ${formatLeaveRange(application.startDate, application.endDate)}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1, padding: theme.spacing.lg, ...theme.shadow.card })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft }}><Ionicons color={theme.colors.icon} name={type.icon} size={24} /></View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{type.label}</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{formatLeaveRange(application.startDate, application.endDate)} · {application.requestedDays} {application.requestedDays === 1 ? 'day' : 'days'}</Text></View>
        <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <LeaveStatusBadge status={application.status} />
        {application.attachment ? <View accessibilityLabel="Local attachment preview available" style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}><Ionicons color={theme.colors.info} name="attach-outline" size={18} /><Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>Preview attached</Text></View> : null}
      </View>
    </Pressable>
  );
}