import type { ModuleIcon, ModuleIdentity, ModuleTone } from './modules';

export type PendingItemKind =
  | 'profileCompletion'
  | 'newsflashAcknowledgement'
  | 'roomBooking'
  | 'approvedLeave'
  | 'supportReview'
  | 'publicHoliday'
  | 'birthday'
  | 'workTenure';

export type PendingItemRoute = '/settings/profile' | '/home/newsflash' | '/home/room' | '/home/leave' | '/settings/support';

export type PendingItem = {
  dateLabel?: string;
  icon: ModuleIcon;
  id: string;
  kind: PendingItemKind;
  route?: PendingItemRoute;
  statusLabel?: string;
  summary: string;
  title: string;
  tone: ModuleTone;
};

export const pendingModuleIdentity: ModuleIdentity = { icon: 'time-outline', tone: 'warning' };

export const pendingItems: readonly PendingItem[] = [
  {
    id: 'pending-profile-completion',
    kind: 'profileCompletion',
    icon: 'person-circle-outline',
    tone: 'success',
    title: 'Complete your profile',
    summary: 'Review your preferred name, work phone, and work location in Profile.',
    statusLabel: 'Needs review',
    route: '/settings/profile',
  },
  {
    id: 'pending-newsflash-acknowledgement',
    kind: 'newsflashAcknowledgement',
    icon: 'newspaper-outline',
    tone: 'info',
    title: 'Review a company update',
    summary: 'Open Newsflash to review the latest local company updates.',
    statusLabel: 'Needs review',
    route: '/home/newsflash',
  },
  {
    id: 'pending-room-booking',
    kind: 'roomBooking',
    icon: 'business-outline',
    tone: 'info',
    title: 'Upcoming room booking',
    summary: 'Atlas · Team planning session · 10:00–10:30.',
    dateLabel: '20 Oct 2026',
    statusLabel: 'Coming up',
    route: '/home/room',
  },
  {
    id: 'pending-support-review',
    kind: 'supportReview',
    icon: 'chatbubble-ellipses-outline',
    tone: 'info',
    title: 'Review your submitted support enquiry',
    summary: 'Open Support to revisit your local submitted enquiry.',
    statusLabel: 'Needs review',
    route: '/settings/support',
  },
  {
    id: 'pending-public-holiday',
    kind: 'publicHoliday',
    icon: 'calendar-outline',
    tone: 'primary',
    title: 'Upcoming public holiday',
    summary: 'A local workplace-calendar reminder for the next public holiday.',
    dateLabel: '25 Oct 2026',
    statusLabel: 'Calendar reminder',
  },
  {
    id: 'pending-approved-leave',
    kind: 'approvedLeave',
    icon: 'sunny-outline',
    tone: 'warning',
    title: 'Approved annual leave',
    summary: 'Two days of planned time away are coming up.',
    dateLabel: '26–27 Oct 2026',
    statusLabel: 'Approved',
    route: '/home/leave',
  },
  {
    id: 'pending-birthday',
    kind: 'birthday',
    icon: 'gift-outline',
    tone: 'success',
    title: 'Team birthday',
    summary: 'Celebrate a colleague during the upcoming workplace milestone.',
    dateLabel: '28 Oct 2026',
    statusLabel: 'Coming up',
  },
  {
    id: 'pending-work-tenure',
    kind: 'workTenure',
    icon: 'ribbon-outline',
    tone: 'primary',
    title: 'Work anniversary approaching',
    summary: 'Your two-year Faith milestone is nearly here.',
    dateLabel: '18 Mar 2027',
    statusLabel: 'Milestone',
  },
] as const;