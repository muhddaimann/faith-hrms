import type { ModuleIdentity } from './modules';

export const profileFeedback = {
  updateLoaderDurationMs: 1_000,
} as const;

export const profileFieldMetadata = {
  preferredName: {
    autoComplete: 'name',
    label: 'Preferred name',
    placeholder: 'Enter your preferred name',
    textContentType: 'nickname',
  },
  workLocation: {
    autoComplete: 'off',
    label: 'Work location',
    placeholder: 'Enter your work location',
    textContentType: 'addressCity',
  },
  workPhone: {
    autoComplete: 'tel',
    keyboardType: 'phone-pad',
    label: 'Work phone',
    placeholder: 'Enter your work phone',
    textContentType: 'telephoneNumber',
  },
} as const;

export const profileModuleIdentity: ModuleIdentity = { icon: 'person-circle-outline', tone: 'success' };

export type EmployeeProfile = {
  department: string;
  employeeId: string;
  employmentType: string;
  fullName: string;
  managerName: string;
  preferredName: string;
  startDate: string;
  workEmail: string;
  workLocation: string;
  workPhone: string;
  jobTitle: string;
};

export type ProfileDraft = Pick<EmployeeProfile, 'preferredName' | 'workLocation' | 'workPhone'>;

export const initialEmployeeProfile: EmployeeProfile = {
  department: 'Customer Experience',
  employeeId: 'FTH-1048',
  employmentType: 'Full-time',
  fullName: 'Maya Santos',
  jobTitle: 'Customer Service Agent',
  managerName: 'Lena Ortiz',
  preferredName: 'Maya',
  startDate: 'March 18, 2024',
  workEmail: 'maya.santos@faith.example',
  workLocation: 'Manila Support Hub',
  workPhone: '+63 2 8123 4567',
};

export function createProfileDraft(profile: EmployeeProfile): ProfileDraft {
  return {
    preferredName: profile.preferredName,
    workLocation: profile.workLocation,
    workPhone: profile.workPhone,
  };
}

export function validateProfileDraft(draft: ProfileDraft): string | null {
  if (!draft.preferredName.trim() || !draft.workLocation.trim() || !draft.workPhone.trim()) {
    return 'Complete your preferred name, work phone, and work location to save changes.';
  }

  return null;
}