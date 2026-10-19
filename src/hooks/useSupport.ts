import { useContext } from 'react';

import { SupportContext } from '../contexts/supportContext';

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === null) {
    throw new Error('useSupport must be used within a SupportProvider.');
  }
  return context;
}
