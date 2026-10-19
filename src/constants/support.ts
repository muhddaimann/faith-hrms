import type Ionicons from '@expo/vector-icons/Ionicons';

export type SupportEnquiryTypeId = 'bug' | 'feedback' | 'question';
export type SupportEnquiryStatus = 'submitted' | 'inReview' | 'resolved';
export type SupportEnquiryFilter = 'all' | SupportEnquiryStatus;

export type SupportEnquiryType = {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  id: SupportEnquiryTypeId;
  label: string;
  subjectPlaceholder: string;
};

export type SupportAttachment = {
  fileName: string;
  mimeType?: string;
  size?: number;
  source: 'photoLibrary' | 'camera' | 'files';
};

export type SupportEnquiry = {
  attachment?: SupportAttachment;
  createdAt: string;
  id: string;
  message: string;
  reference: string;
  status: SupportEnquiryStatus;
  subject: string;
  typeId: SupportEnquiryTypeId;
};

export type SupportEnquiryDraft = {
  attachment?: SupportAttachment;
  message: string;
  subject: string;
  typeId?: SupportEnquiryTypeId;
};

export const supportFeedback = {
  submissionLoaderDurationMs: 1_000,
} as const;

export const supportReferenceStart = 1040;

export const supportTypes: readonly SupportEnquiryType[] = [
  { id: 'bug', label: 'Bug report', description: 'Report something that is not working as expected.', icon: 'bug-outline', subjectPlaceholder: 'For example, navigation hides content' },
  { id: 'feedback', label: 'Feedback', description: 'Share an idea or suggestion about your experience.', icon: 'bulb-outline', subjectPlaceholder: 'For example, add a quick search' },
  { id: 'question', label: 'Question', description: 'Ask about how a local Faith feature works.', icon: 'help-circle-outline', subjectPlaceholder: 'For example, do previews reset?' },
] as const;

export const initialSupportEnquiries: readonly SupportEnquiry[] = [
  { id: 'support-bug-navigation', reference: 'SUP-1042', typeId: 'bug', subject: 'Bottom navigation hides content on small screens', message: 'On a small phone the floating navigation covers the last card in the list. Scrolling helps, but the final item is hard to reach. This is a local preview of a bug report.', status: 'resolved', createdAt: '2026-10-06' },
  { id: 'support-feedback-search', reference: 'SUP-1035', typeId: 'feedback', subject: 'Add a quick search on Home', message: 'It would be faster to jump straight to a feature from a search field instead of scrolling through the action list every time. This is a local preview of feedback.', status: 'inReview', createdAt: '2026-10-11' },
  { id: 'support-question-reset', reference: 'SUP-1027', typeId: 'question', subject: 'Do local previews reset when I reopen the app?', message: 'I want to confirm whether the records I create in this preview stay on my device or reset each time the app restarts. This is a local preview of a question.', status: 'submitted', createdAt: '2026-10-17' },
] as const;

const fullDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const compactDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function parseSupportDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getSupportType(typeId: SupportEnquiryTypeId) {
  return supportTypes.find((type) => type.id === typeId) ?? null;
}

export function formatSupportDate(value: string) {
  return fullDateFormatter.format(parseSupportDate(value));
}

export function formatSupportDateCompact(value: string) {
  return compactDateFormatter.format(parseSupportDate(value));
}

export function validateSupportDraft(draft: SupportEnquiryDraft) {
  if (!draft.typeId) {
    return 'Choose whether this is a bug report, feedback, or a question.';
  }
  if (draft.subject.trim().length < 4) {
    return 'Add a short subject with at least four characters.';
  }
  if (draft.subject.trim().length > 80) {
    return 'Keep the subject to 80 characters or fewer.';
  }
  if (draft.message.trim().length < 10) {
    return 'Describe your enquiry with at least ten characters.';
  }
  if (draft.message.trim().length > 500) {
    return 'Keep the details to 500 characters or fewer.';
  }
  return null;
}

export function createSupportEnquiry(draft: Required<Pick<SupportEnquiryDraft, 'typeId'>> & SupportEnquiryDraft, sequence: number): SupportEnquiry {
  return {
    id: `support-${draft.typeId}-${Date.now()}`,
    reference: `SUP-${supportReferenceStart + sequence}`,
    typeId: draft.typeId,
    subject: draft.subject.trim(),
    message: draft.message.trim(),
    status: 'submitted',
    attachment: draft.attachment,
    createdAt: formatDateValue(new Date(Date.UTC(2026, 9, 19))),
  };
}
