import type Ionicons from '@expo/vector-icons/Ionicons';

import type { ModuleIdentity } from './modules';

export type LeaveTypeId = 'annual' | 'sick' | 'emergency' | 'bereavement' | 'unpaid';
export type LeaveApplicationStatus = 'pending' | 'approved' | 'cancelled' | 'rejected';
export type LeaveApplicationFilter = 'all' | LeaveApplicationStatus;

export type LeaveType = {
  attachmentRule: 'never' | 'sickTwoDaysOrMore';
  icon: keyof typeof Ionicons.glyphMap;
  id: LeaveTypeId;
  label: string;
  description: string;
};

export type LeaveBalance = {
  entitlement: number;
  pending: number;
  remaining: number;
  typeId: LeaveTypeId;
  used: number;
};

export type LeaveAttachment = {
  fileName: string;
  mimeType?: string;
  size?: number;
  source: 'photoLibrary' | 'camera' | 'files';
};

export type LeaveApplication = {
  attachment?: LeaveAttachment;
  createdAt: string;
  endDate: string;
  id: string;
  reason: string;
  requestedDays: number;
  startDate: string;
  status: LeaveApplicationStatus;
  typeId: LeaveTypeId;
};

export type LeaveApplicationDraft = {
  attachment?: LeaveAttachment;
  endDate?: string;
  reason: string;
  startDate?: string;
  typeId?: LeaveTypeId;
};

export const leaveFeedback = {
  cancellationLoaderDurationMs: 1_000,
  submissionLoaderDurationMs: 1_000,
} as const;

export const leaveFixtureDates = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'] as const;

export const leaveTypes: readonly LeaveType[] = [
  { id: 'annual', label: 'Annual leave', description: 'Planned time away from work.', icon: 'sunny-outline', attachmentRule: 'never' },
  { id: 'sick', label: 'Sick leave', description: 'Time away for illness or recovery.', icon: 'medkit-outline', attachmentRule: 'sickTwoDaysOrMore' },
  { id: 'emergency', label: 'Emergency leave', description: 'Urgent personal or family matters.', icon: 'alert-circle-outline', attachmentRule: 'never' },
  { id: 'bereavement', label: 'Bereavement leave', description: 'Time away following a bereavement.', icon: 'heart-outline', attachmentRule: 'never' },
  { id: 'unpaid', label: 'Unpaid leave', description: 'Unpaid time away in this local preview.', icon: 'calendar-clear-outline', attachmentRule: 'never' },
] as const;

export const leaveModuleIdentity: ModuleIdentity = { icon: 'sunny-outline', tone: 'warning' };

const leaveEntitlements: Record<LeaveTypeId, number> = {
  annual: 14,
  sick: 10,
  emergency: 3,
  bereavement: 5,
  unpaid: 0,
};

const initialUsedDays: Record<LeaveTypeId, number> = {
  annual: 3,
  sick: 1,
  emergency: 0,
  bereavement: 0,
  unpaid: 0,
};

export const initialLeaveApplications: readonly LeaveApplication[] = [
  { id: 'leave-annual-approved-october', typeId: 'annual', startDate: '2026-10-08', endDate: '2026-10-09', requestedDays: 2, reason: 'Personal commitments.', status: 'approved', createdAt: '2026-10-01' },
  { id: 'leave-sick-approved-october', typeId: 'sick', startDate: '2026-10-12', endDate: '2026-10-12', requestedDays: 1, reason: 'Medical recovery day.', status: 'approved', createdAt: '2026-10-10' },
  { id: 'leave-annual-pending-october', typeId: 'annual', startDate: '2026-10-26', endDate: '2026-10-27', requestedDays: 2, reason: 'Family visit.', status: 'pending', createdAt: '2026-10-18' },
] as const;

const fullDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const compactDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

function parseLeaveDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getLeaveType(typeId: LeaveTypeId) {
  return leaveTypes.find((type) => type.id === typeId) ?? null;
}

export function formatLeaveDate(value: string) {
  return fullDateFormatter.format(parseLeaveDate(value));
}

export function formatLeaveRange(startDate: string, endDate: string) {
  return startDate === endDate ? formatLeaveDate(startDate) : `${compactDateFormatter.format(parseLeaveDate(startDate))} – ${fullDateFormatter.format(parseLeaveDate(endDate))}`;
}

export function getInclusiveBusinessDays(startDate: string, endDate: string) {
  const start = parseLeaveDate(startDate);
  const end = parseLeaveDate(endDate);

  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end < start) {
    return 0;
  }

  let total = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      total += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return total;
}

export function requiresLeaveAttachment(typeId: LeaveTypeId, requestedDays: number) {
  return getLeaveType(typeId)?.attachmentRule === 'sickTwoDaysOrMore' && requestedDays >= 2;
}

export function canCancelLeaveApplication(application: LeaveApplication) {
  return application.status === 'pending';
}

export function getLeaveBalances(applications: readonly LeaveApplication[]): readonly LeaveBalance[] {
  return leaveTypes.map((type) => {
    const pending = applications.filter((application) => application.typeId === type.id && application.status === 'pending').reduce((total, application) => total + application.requestedDays, 0);
    const approved = applications.filter((application) => application.typeId === type.id && application.status === 'approved').reduce((total, application) => total + application.requestedDays, 0);
    const used = Math.max(initialUsedDays[type.id], approved);
    const entitlement = leaveEntitlements[type.id];
    return { typeId: type.id, entitlement, used, pending, remaining: Math.max(0, entitlement - used - pending) };
  });
}

export function validateLeaveDraft(draft: LeaveApplicationDraft, balances: readonly LeaveBalance[]) {
  if (!draft.typeId) {
    return 'Choose a leave type to continue.';
  }
  if (!draft.startDate || !draft.endDate) {
    return 'Choose the first and last day of your leave request.';
  }
  if (!leaveFixtureDates.includes(draft.startDate as (typeof leaveFixtureDates)[number]) || !leaveFixtureDates.includes(draft.endDate as (typeof leaveFixtureDates)[number])) {
    return 'Choose dates available in this local leave preview.';
  }
  const requestedDays = getInclusiveBusinessDays(draft.startDate, draft.endDate);
  if (requestedDays < 1) {
    return 'Choose at least one working day for your leave request.';
  }
  if (draft.reason.trim().length < 3) {
    return 'Add a short reason with at least three characters.';
  }
  if (draft.reason.trim().length > 160) {
    return 'Keep the reason to 160 characters or fewer.';
  }
  if (requiresLeaveAttachment(draft.typeId, requestedDays) && !draft.attachment) {
    return 'Add the local supporting-document preview for this sick leave request.';
  }
  const balance = balances.find((item) => item.typeId === draft.typeId);
  if (draft.typeId !== 'unpaid' && (!balance || requestedDays > balance.remaining)) {
    return 'This request exceeds the remaining balance in this local preview.';
  }
  return null;
}

export function createLeaveApplication(draft: Required<Pick<LeaveApplicationDraft, 'endDate' | 'startDate' | 'typeId'>> & LeaveApplicationDraft): LeaveApplication {
  const requestedDays = getInclusiveBusinessDays(draft.startDate, draft.endDate);
  return {
    id: `leave-${draft.typeId}-${draft.startDate}-${draft.endDate}-${Date.now()}`,
    typeId: draft.typeId,
    startDate: draft.startDate,
    endDate: draft.endDate,
    requestedDays,
    reason: draft.reason.trim(),
    status: 'pending',
    attachment: draft.attachment,
    createdAt: formatDateValue(new Date(Date.UTC(2026, 9, 19))),
  };
}