import { useContext } from 'react';

import { LeaveContext } from '../contexts/leaveContext';

export function useLeave() {
  const context = useContext(LeaveContext);
  if (context === null) {
    throw new Error('useLeave must be used within a LeaveProvider.');
  }
  return context;
}