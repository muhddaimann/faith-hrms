import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { createSupportEnquiry, initialSupportEnquiries, type SupportEnquiry, type SupportEnquiryDraft } from '../constants/support';

type SupportContextValue = {
  enquiries: readonly SupportEnquiry[];
  createEnquiry: (draft: Required<Pick<SupportEnquiryDraft, 'typeId'>> & SupportEnquiryDraft) => void;
};

export const SupportContext = createContext<SupportContextValue | null>(null);

export function SupportProvider({ children }: PropsWithChildren) {
  const [enquiries, setEnquiries] = useState<readonly SupportEnquiry[]>(initialSupportEnquiries);

  const createEnquiry = useCallback((draft: Required<Pick<SupportEnquiryDraft, 'typeId'>> & SupportEnquiryDraft) => {
    setEnquiries((currentEnquiries) => [createSupportEnquiry(draft, currentEnquiries.length), ...currentEnquiries]);
  }, []);

  const value = useMemo<SupportContextValue>(() => ({ enquiries, createEnquiry }), [enquiries, createEnquiry]);

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}
