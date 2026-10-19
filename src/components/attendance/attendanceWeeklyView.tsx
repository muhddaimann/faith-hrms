import { Text, View } from 'react-native';

import { type AttendanceRecord } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';
import { AttendanceRecordRow } from './attendanceRecordRow';
import { AttendanceSummaryCard } from './attendanceSummaryCard';

export function AttendanceWeeklyView({ records, statusCounts }: { records: readonly AttendanceRecord[]; statusCounts: { onTime: number; late: number; earlyDeparture: number; absent: number; leave: number; weekend: number; scheduled: number } }) {
  const { theme } = useTheme();
  const completed = statusCounts.onTime + statusCounts.late + statusCounts.earlyDeparture;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <AttendanceSummaryCard description="Completed shifts" icon="checkmark-done-outline" label="Worked" value={String(completed)} />
        <AttendanceSummaryCard description="Needs attention" icon="alert-circle-outline" label="Exceptions" value={String(statusCounts.late + statusCounts.earlyDeparture + statusCounts.absent)} />
      </View>
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>Daily records</Text>
        {records.map((record) => <AttendanceRecordRow key={record.date} record={record} />)}
      </View>
    </View>
  );
}