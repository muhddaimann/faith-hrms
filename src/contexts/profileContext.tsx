import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { initialEmployeeProfile, type EmployeeProfile, type ProfileDraft } from '../constants/profile';

type ProfileContextValue = {
  profile: EmployeeProfile;
  updateProfile: (draft: ProfileDraft) => void;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<EmployeeProfile>(initialEmployeeProfile);

  const updateProfile = useCallback((draft: ProfileDraft) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      preferredName: draft.preferredName.trim(),
      workLocation: draft.workLocation.trim(),
      workPhone: draft.workPhone.trim(),
    }));
  }, []);

  const value = useMemo<ProfileContextValue>(() => ({ profile, updateProfile }), [profile, updateProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}