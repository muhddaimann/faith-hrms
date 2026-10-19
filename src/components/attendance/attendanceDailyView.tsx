import { Text, View } from 'react-native';

import { formatAttendanceDate, formatAttendanceTimeRange, formatAttendanceWeekday, type AttendanceRecord } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';
import { AttendanceStatusBadge } from './attendanceStatusBadge';

export function AttendanceDailyView({ record, selectedDate }: { record: AttendanceRecord | null; selectedDate: string }) {
  const { theme } = useTheme();

  if (record === null) {
    return (
      <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.xl, ...theme.shadow.card }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>No local record</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>No fixture attendance record is available for {formatAttendanceDate(selectedDate)}.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>{formatAttendanceWeekday(record.date).toUpperCase()}</Text>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{formatAttendanceDate(record.date)}</Text>
        <AttendanceStatusBadge status={record.status} />
      </View>
      {record.scheduledIn ? (
        <View style={{ gap: theme.spacing.md }}>
          <AttendanceTimePair actual={formatAttendanceTimeRange(record, 'actual')} label="Actual" scheduled={formatAttendanceTimeRange(record, 'scheduled')} />
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{record.actualIn ? 'Actual times are part of Faith’s local attendance preview.' : 'No actual times are available for this local attendance status.'}</Text>
        </View>
      ) : <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This is a non-working day in the local attendance preview.</Text>}
    </View>
  );
}

function AttendanceTimePair({ actual, label, scheduled }: { actual: string; label: string; scheduled: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
      <View style={{ flex: 1, minWidth: 132, gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>Scheduled in / out</Text>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{scheduled}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 132, gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}>
        <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{label} in / out</Text>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{actual}</Text>
      </View>
    </View>
  );
}