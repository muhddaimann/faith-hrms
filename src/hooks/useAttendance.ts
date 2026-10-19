import { useContext } from 'react';

import { AttendanceContext } from '../contexts/attendanceContext';

export function useAttendance() {
  const context = useContext(AttendanceContext);

  if (context === null) {
    throw new Error('useAttendance must be used within an AttendanceProvider.');
  }

  return context;
}