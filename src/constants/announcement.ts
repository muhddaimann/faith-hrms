import type { ModuleIcon, ModuleTone } from './modules';

export type AnnouncementItem = {
  body: readonly string[];
  eyebrow: string;
  icon: ModuleIcon;
  id: string;
  summary: string;
  title: string;
  tone: ModuleTone;
};

export const announcementItems: readonly AnnouncementItem[] = [
  {
    id: 'recruitment-referral-bonus',
    icon: 'gift-outline',
    eyebrow: 'Team growth',
    title: 'Recommend great people. Grow Faith together.',
    summary: 'A fictional referral-bonus spotlight for your next great teammate.',
    tone: 'success',
    body: [
      'Know someone who would bring care, curiosity, and great energy to the Faith team? Share their details with your manager or Human Resource representative through the usual internal process.',
      'This local preview highlights how a recruitment referral bonus announcement could appear in Faith. Eligibility, reward amounts, hiring decisions, and payment terms are not represented here.',
    ],
  },
  {
    id: 'faith-mobile-companion',
    icon: 'phone-portrait-outline',
    eyebrow: 'Faith mobile',
    title: 'Your workday, in your pocket.',
    summary: 'A Faith mobile placeholder for the people tools you use most.',
    tone: 'primary',
    body: [
      'Faith brings everyday workplace information closer to you with a calm, clear mobile companion for your workday.',
      'This is a local product placeholder only. It does not announce a production release, availability date, or new service beyond the features already available in this demonstration app.',
    ],
  },
] as const;