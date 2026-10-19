import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { attendanceFixtureToday, attendanceRecords, getAttendanceRecord, getAttendanceStatusCounts, getAttendanceWeek, getFixturePeriodLimits, moveAttendanceDate, type AttendanceRecord, type AttendanceView } from '../constants/attendance';

type AttendanceContextValue = {
  activeView: AttendanceView;
  canMoveNext: boolean;
  canMovePrevious: boolean;
  dailyRecord: AttendanceRecord | null;
  monthlyRecords: readonly AttendanceRecord[];
  movePeriod: (direction: -1 | 1) => void;
  selectedDate: string;
  setActiveView: (view: AttendanceView) => void;
  weeklyRecords: readonly AttendanceRecord[];
  weeklyStatusCounts: ReturnType<typeof getAttendanceStatusCounts>;
};

export const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: PropsWithChildren) {
  const [activeView, setActiveView] = useState<AttendanceView>('daily');
  const [selectedDate, setSelectedDate] = useState(attendanceFixtureToday);
  const { firstDate, lastDate } = getFixturePeriodLimits();

  const movePeriod = useCallback((direction: -1 | 1) => {
    setSelectedDate((currentDate) => {
      const nextDate = moveAttendanceDate(currentDate, activeView, direction);
      return nextDate < firstDate || nextDate > lastDate ? currentDate : nextDate;
    });
  }, [activeView, firstDate, lastDate]);

  const value = useMemo<AttendanceContextValue>(() => {
    const candidatePrevious = moveAttendanceDate(selectedDate, activeView, -1);
    const candidateNext = moveAttendanceDate(selectedDate, activeView, 1);
    const weeklyRecords = getAttendanceWeek(selectedDate);

    return {
      activeView,
      canMoveNext: candidateNext <= lastDate,
      canMovePrevious: candidatePrevious >= firstDate,
      dailyRecord: getAttendanceRecord(selectedDate),
      monthlyRecords: attendanceRecords,
      movePeriod,
      selectedDate,
      setActiveView,
      weeklyRecords,
      weeklyStatusCounts: getAttendanceStatusCounts(weeklyRecords),
    };
  }, [activeView, firstDate, lastDate, movePeriod, selectedDate]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}