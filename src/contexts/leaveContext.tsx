import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { canCancelLeaveApplication, createLeaveApplication, getLeaveBalances, initialLeaveApplications, type LeaveApplication, type LeaveApplicationDraft, type LeaveBalance } from '../constants/leave';

type LeaveContextValue = {
  applications: readonly LeaveApplication[];
  balances: readonly LeaveBalance[];
  cancelApplication: (applicationId: string) => boolean;
  createApplication: (draft: Required<Pick<LeaveApplicationDraft, 'endDate' | 'startDate' | 'typeId'>> & LeaveApplicationDraft) => void;
};

export const LeaveContext = createContext<LeaveContextValue | null>(null);

export function LeaveProvider({ children }: PropsWithChildren) {
  const [applications, setApplications] = useState<readonly LeaveApplication[]>(initialLeaveApplications);

  const createApplication = useCallback((draft: Required<Pick<LeaveApplicationDraft, 'endDate' | 'startDate' | 'typeId'>> & LeaveApplicationDraft) => {
    setApplications((currentApplications) => [createLeaveApplication(draft), ...currentApplications]);
  }, []);

  const cancelApplication = useCallback((applicationId: string) => {
    let didCancel = false;
    setApplications((currentApplications) => currentApplications.map((application) => {
      if (application.id !== applicationId || !canCancelLeaveApplication(application)) {
        return application;
      }
      didCancel = true;
      return { ...application, status: 'cancelled' };
    }));
    return didCancel;
  }, []);

  const balances = useMemo(() => getLeaveBalances(applications), [applications]);
  const value = useMemo<LeaveContextValue>(() => ({ applications, balances, cancelApplication, createApplication }), [applications, balances, cancelApplication, createApplication]);

  return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
}