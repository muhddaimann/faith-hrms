import { Text, View } from 'react-native';

import { getAttendanceStatusCounts, type AttendanceRecord, type AttendanceStatus } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';
import { AttendanceStatusBadge } from './attendanceStatusBadge';
import { AttendanceSummaryCard } from './attendanceSummaryCard';

const monthlyStatuses: readonly AttendanceStatus[] = ['onTime', 'late', 'earlyDeparture', 'absent', 'leave', 'scheduled'];

export function AttendanceMonthlyView({ records }: { records: readonly AttendanceRecord[] }) {
  const { theme } = useTheme();
  const counts = getAttendanceStatusCounts(records);
  const workdayRecords = records.filter((record) => record.status !== 'weekend');
  const worked = counts.onTime + counts.late + counts.earlyDeparture;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <AttendanceSummaryCard description="Completed workdays" icon="checkmark-circle-outline" label="Worked" value={String(worked)} />
        <AttendanceSummaryCard description="Planned local shifts" icon="calendar-clear-outline" label="Scheduled" value={String(counts.scheduled)} />
      </View>
      <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>Month at a glance</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Status totals for Faith’s local attendance preview.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
          {monthlyStatuses.map((status) => (
            <View key={status} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
              <AttendanceStatusBadge status={status} />
              <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{counts[status]}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>Workday timeline</Text>
        {workdayRecords.map((record) => <MonthlyRecord key={record.date} record={record} />)}
      </View>
    </View>
  );
}

function MonthlyRecord({ record }: { record: AttendanceRecord }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingVertical: theme.spacing.sm }}>
      <Text style={{ ...theme.typography.label, minWidth: 62, color: theme.colors.textSecondary }}>{record.date.slice(-2)} Oct</Text>
      <View style={{ flex: 1 }}><AttendanceStatusBadge status={record.status} /></View>
      <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{record.actualIn ? record.actualIn : record.scheduledIn ? 'No actual' : '—'}</Text>
    </View>
  );
}