import type Ionicons from '@expo/vector-icons/Ionicons';

export type AttendanceStatus = 'onTime' | 'late' | 'earlyDeparture' | 'absent' | 'leave' | 'weekend' | 'scheduled';
export type AttendanceView = 'daily' | 'weekly' | 'monthly';

export type AttendanceRecord = {
  actualIn?: string;
  actualOut?: string;
  date: string;
  scheduledIn?: string;
  scheduledOut?: string;
  status: AttendanceStatus;
};

export type AttendanceStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const attendanceFixtureMonth = '2026-10';
export const attendanceFixtureToday = '2026-10-18';
export const attendanceViewLabels: Record<AttendanceView, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const attendanceStatusMetadata: Record<AttendanceStatus, { icon: keyof typeof Ionicons.glyphMap; label: string; tone: AttendanceStatusTone }> = {
  onTime: { icon: 'checkmark-circle-outline', label: 'On time', tone: 'success' },
  late: { icon: 'time-outline', label: 'Late arrival', tone: 'warning' },
  earlyDeparture: { icon: 'log-out-outline', label: 'Early departure', tone: 'warning' },
  absent: { icon: 'close-circle-outline', label: 'Absent', tone: 'danger' },
  leave: { icon: 'calendar-outline', label: 'On leave', tone: 'info' },
  weekend: { icon: 'cafe-outline', label: 'Weekend', tone: 'neutral' },
  scheduled: { icon: 'calendar-clear-outline', label: 'Scheduled', tone: 'info' },
};

export const attendanceRecords: readonly AttendanceRecord[] = [
  { date: '2026-10-01', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:56', actualOut: '18:03', status: 'onTime' },
  { date: '2026-10-02', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '09:12', actualOut: '18:09', status: 'late' },
  { date: '2026-10-03', status: 'weekend' },
  { date: '2026-10-04', status: 'weekend' },
  { date: '2026-10-05', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:51', actualOut: '17:58', status: 'onTime' },
  { date: '2026-10-06', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '09:04', actualOut: '18:00', status: 'late' },
  { date: '2026-10-07', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:59', actualOut: '17:24', status: 'earlyDeparture' },
  { date: '2026-10-08', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:54', actualOut: '18:06', status: 'onTime' },
  { date: '2026-10-09', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '09:18', actualOut: '18:04', status: 'late' },
  { date: '2026-10-10', status: 'weekend' },
  { date: '2026-10-11', status: 'weekend' },
  { date: '2026-10-12', scheduledIn: '09:00', scheduledOut: '18:00', status: 'leave' },
  { date: '2026-10-13', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:57', actualOut: '18:11', status: 'onTime' },
  { date: '2026-10-14', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '09:09', actualOut: '18:02', status: 'late' },
  { date: '2026-10-15', scheduledIn: '09:00', scheduledOut: '18:00', status: 'absent' },
  { date: '2026-10-16', scheduledIn: '09:00', scheduledOut: '18:00', actualIn: '08:48', actualOut: '17:55', status: 'onTime' },
  { date: '2026-10-17', status: 'weekend' },
  { date: '2026-10-18', status: 'weekend' },
  { date: '2026-10-19', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-20', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-21', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-22', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-23', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-24', status: 'weekend' },
  { date: '2026-10-25', status: 'weekend' },
  { date: '2026-10-26', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-27', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-28', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-29', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-30', scheduledIn: '09:00', scheduledOut: '18:00', status: 'scheduled' },
  { date: '2026-10-31', status: 'weekend' },
] as const;

const fullDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const compactWeekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });
const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function parseAttendanceDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function addDays(value: string, amount: number) {
  const date = parseAttendanceDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function formatAttendanceDate(value: string) {
  return fullDateFormatter.format(parseAttendanceDate(value));
}

export function formatAttendanceShortDate(value: string) {
  return shortDateFormatter.format(parseAttendanceDate(value));
}

export function formatAttendanceWeekday(value: string) {
  return weekdayFormatter.format(parseAttendanceDate(value));
}

export function formatAttendanceCompactWeekday(value: string) {
  return compactWeekdayFormatter.format(parseAttendanceDate(value));
}

export function formatAttendanceMonth(value: string) {
  return monthFormatter.format(parseAttendanceDate(value));
}

export function getAttendanceRecord(value: string) {
  return attendanceRecords.find((record) => record.date === value) ?? null;
}

export function getAttendanceWeekStart(value: string) {
  const date = parseAttendanceDate(value);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + mondayOffset);
  return date.toISOString().slice(0, 10);
}

export function getAttendanceWeek(value: string) {
  const start = getAttendanceWeekStart(value);
  return Array.from({ length: 7 }, (_, index) => getAttendanceRecord(addDays(start, index))).filter((record): record is AttendanceRecord => record !== null);
}

export function formatAttendanceWeekRange(value: string) {
  const start = getAttendanceWeekStart(value);
  const end = addDays(start, 6);
  return `${formatAttendanceShortDate(start)} – ${formatAttendanceShortDate(end)}`;
}

export function getAttendanceStatusCounts(records: readonly AttendanceRecord[]) {
  return records.reduce<Record<AttendanceStatus, number>>((counts, record) => ({ ...counts, [record.status]: counts[record.status] + 1 }), {
    onTime: 0,
    late: 0,
    earlyDeparture: 0,
    absent: 0,
    leave: 0,
    weekend: 0,
    scheduled: 0,
  });
}

export function formatAttendanceTimeRange(record: AttendanceRecord, kind: 'actual' | 'scheduled') {
  const start = kind === 'actual' ? record.actualIn : record.scheduledIn;
  const end = kind === 'actual' ? record.actualOut : record.scheduledOut;
  return start && end ? `${start} – ${end}` : '—';
}

export function getFixturePeriodLimits() {
  return { firstDate: attendanceRecords[0].date, lastDate: attendanceRecords[attendanceRecords.length - 1].date };
}

export function moveAttendanceDate(value: string, view: AttendanceView, direction: -1 | 1) {
  return addDays(value, direction * (view === 'daily' ? 1 : view === 'weekly' ? 7 : 31));
}