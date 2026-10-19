import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { AttendanceDailyView } from '../../../../src/components/attendance/attendanceDailyView';
import { AttendanceMonthlyView } from '../../../../src/components/attendance/attendanceMonthlyView';
import { AttendancePeriodControl } from '../../../../src/components/attendance/attendancePeriodControl';
import { AttendanceViewTabs } from '../../../../src/components/attendance/attendanceViewTabs';
import { AttendanceWeeklyView } from '../../../../src/components/attendance/attendanceWeeklyView';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { formatAttendanceDate, formatAttendanceMonth, formatAttendanceWeekRange } from '../../../../src/constants/attendance';
import { useAttendance } from '../../../../src/hooks/useAttendance';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function AttendanceScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { activeView, canMoveNext, canMovePrevious, dailyRecord, monthlyRecords, movePeriod, selectedDate, setActiveView, weeklyRecords, weeklyStatusCounts } = useAttendance();
  const periodLabel = activeView === 'daily' ? formatAttendanceDate(selectedDate) : activeView === 'weekly' ? formatAttendanceWeekRange(selectedDate) : formatAttendanceMonth(selectedDate);

  return (
    <AppScreen eyebrow="LOCAL ATTENDANCE" onBack={() => router.replace('/home')} subtitle="A read-only preview of your scheduled and recorded workdays." title="Attendance">
      <View style={{ gap: theme.spacing.lg }}>
        <AttendanceViewTabs activeView={activeView} onSelect={setActiveView} />
        <AttendancePeriodControl canMoveNext={canMoveNext} canMovePrevious={canMovePrevious} label={periodLabel} onMoveNext={() => movePeriod(1)} onMovePrevious={() => movePeriod(-1)} unit={activeView} />
        {activeView === 'daily' ? <AttendanceDailyView record={dailyRecord} selectedDate={selectedDate} /> : null}
        {activeView === 'weekly' ? <AttendanceWeeklyView records={weeklyRecords} statusCounts={weeklyStatusCounts} /> : null}
        {activeView === 'monthly' ? <AttendanceMonthlyView records={monthlyRecords} /> : null}
      </View>
    </AppScreen>
  );
}