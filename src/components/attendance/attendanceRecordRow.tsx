import { Text, View } from 'react-native';

import { formatAttendanceCompactWeekday, formatAttendanceShortDate, formatAttendanceTimeRange, type AttendanceRecord } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';
import { AttendanceStatusBadge } from './attendanceStatusBadge';

export function AttendanceRecordRow({ record }: { record: AttendanceRecord }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{formatAttendanceCompactWeekday(record.date)}, {formatAttendanceShortDate(record.date)}</Text>
        </View>
        <AttendanceStatusBadge status={record.status} />
      </View>
      {record.scheduledIn ? (
        <View style={{ gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>Scheduled</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{formatAttendanceTimeRange(record, 'scheduled')}</Text>
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>Actual</Text>
          <Text style={{ ...theme.typography.body, color: record.actualIn ? theme.colors.text : theme.colors.textSecondary }}>{formatAttendanceTimeRange(record, 'actual')}</Text>
        </View>
      ) : <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>No scheduled shift for this day.</Text>}
    </View>
  );
}