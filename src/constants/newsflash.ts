import type Ionicons from '@expo/vector-icons/Ionicons';

export type NewsflashCategory = 'humanResource' | 'payroll';
export type NewsflashPriority = 'critical' | 'important' | 'normal';
export type NewsflashPriorityFilter = 'all' | NewsflashPriority;

export type NewsflashItem = {
  author: string;
  body: readonly string[];
  category: NewsflashCategory;
  expiresAt: string;
  id: string;
  priority: NewsflashPriority;
  publishedAt: string;
  relativePublishedAt: string;
  title: string;
};

export const newsflashCategoryMetadata: Record<NewsflashCategory, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  humanResource: { icon: 'shield-checkmark-outline', label: 'Human Resource' },
  payroll: { icon: 'wallet-outline', label: 'Payroll' },
};

export const newsflashPriorityMetadata: Record<NewsflashPriority, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  critical: { icon: 'alert-circle-outline', label: 'Critical' },
  important: { icon: 'warning-outline', label: 'Important' },
  normal: { icon: 'information-circle-outline', label: 'Normal' },
};

export const newsflashItems: readonly NewsflashItem[] = [
  {
    id: 'workplace-security-professional-conduct',
    category: 'humanResource',
    priority: 'important',
    title: 'Workplace Security, Professional Conduct & Responsible Use of Company Resources',
    author: 'Kisuntha A/P Sundarason',
    publishedAt: '2026-10-15',
    relativePublishedAt: '3 days ago',
    expiresAt: '2036-12-31',
    body: [
      'All employees are expected to help maintain a safe, respectful, and secure workplace. Follow established workplace security procedures, protect company information, and report any concern through the appropriate internal channel.',
      'Company devices, systems, and resources are provided for responsible business use. Do not share access credentials, leave devices unattended in unsecured areas, or use company resources in a way that could compromise security, productivity, or professional standards.',
      'Please review your team guidance and speak with your manager or Human Resource representative if you need clarification about these expectations.',
    ],
  },
  {
    id: 'memo-special-public-holiday-silver-jubilee-selangor',
    category: 'payroll',
    priority: 'normal',
    title: 'Memo Special PH Silver Jubilee Sultan Selangor',
    author: 'Kisuntha A/P Sundarason',
    publishedAt: '2026-10-13',
    relativePublishedAt: '5 days ago',
    expiresAt: '2026-11-25',
    body: [
      'This memo shares the payroll and scheduling guidance for the special public holiday in conjunction with the Silver Jubilee celebration of the Sultan of Selangor.',
      'Employees with approved shifts or payroll-related questions should review their roster and contact their manager or Payroll representative through the usual internal process.',
      'Please acknowledge this notice after reviewing the information so your local Newsflash list reflects that it has been read.',
    ],
  },
] as const;

const displayDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function parseNewsflashDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatNewsflashDate(value: string) {
  return displayDateFormatter.format(parseNewsflashDate(value));
}
