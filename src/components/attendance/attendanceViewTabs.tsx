import { attendanceViewLabels, type AttendanceView } from '../../constants/attendance';
import { TabSelector } from '../shared/tabSelector';

const views: readonly AttendanceView[] = ['daily', 'weekly', 'monthly'];

export function AttendanceViewTabs({ activeView, onSelect }: { activeView: AttendanceView; onSelect: (view: AttendanceView) => void }) {
  return <TabSelector accessibilityLabel="Attendance view" items={views.map((view) => ({ value: view, label: attendanceViewLabels[view], accessibilityLabel: `${attendanceViewLabels[view]} attendance view` }))} onSelect={onSelect} selectedValue={activeView} />;
}