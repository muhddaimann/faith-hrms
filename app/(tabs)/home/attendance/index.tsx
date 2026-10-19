import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { AttendanceDailyView } from '../../../../src/components/attendance/attendanceDailyView';
import { AttendanceMonthlyView } from '../../../../src/components/attendance/attendanceMonthlyView';
import { AttendancePeriodControl } from '../../../../src/components/attendance/attendancePeriodControl';
import { AttendanceWeeklyView } from '../../../../src/components/attendance/attendanceWeeklyView';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { TabSelector } from '../../../../src/components/shared/tabSelector';
import { attendanceViewLabels, formatAttendanceDate, formatAttendanceMonth, formatAttendanceWeekRange, type AttendanceView } from '../../../../src/constants/attendance';
import { useAttendance } from '../../../../src/hooks/useAttendance';
import { useTheme } from '../../../../src/hooks/useTheme';

const attendanceViews: readonly AttendanceView[] = ['daily', 'weekly', 'monthly'];


export default function AttendanceScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { activeView, canMoveNext, canMovePrevious, dailyRecord, monthlyRecords, movePeriod, selectedDate, setActiveView, weeklyRecords, weeklyStatusCounts } = useAttendance();
  const periodLabel = activeView === 'daily' ? formatAttendanceDate(selectedDate) : activeView === 'weekly' ? formatAttendanceWeekRange(selectedDate) : formatAttendanceMonth(selectedDate);

  return (
    <AppScreen eyebrow="LOCAL ATTENDANCE" onBack={() => router.replace('/home')} subtitle="A read-only preview of your scheduled and recorded workdays." title="Attendance">
      <View style={{ gap: theme.spacing.lg }}>
        <TabSelector accessibilityLabel="Attendance view" items={attendanceViews.map((view) => ({ accessibilityLabel: `${attendanceViewLabels[view]} attendance view`, label: attendanceViewLabels[view], value: view }))} onSelect={setActiveView} scrollable selectedValue={activeView} />
        <AttendancePeriodControl canMoveNext={canMoveNext} canMovePrevious={canMovePrevious} label={periodLabel} onMoveNext={() => movePeriod(1)} onMovePrevious={() => movePeriod(-1)} unit={activeView} />
        {activeView === 'daily' ? <AttendanceDailyView record={dailyRecord} selectedDate={selectedDate} /> : null}
        {activeView === 'weekly' ? <AttendanceWeeklyView records={weeklyRecords} statusCounts={weeklyStatusCounts} /> : null}
        {activeView === 'monthly' ? <AttendanceMonthlyView records={monthlyRecords} /> : null}
      </View>
    </AppScreen>
  );
}