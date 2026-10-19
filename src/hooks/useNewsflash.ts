import { useContext } from 'react';

import { NewsflashContext } from '../contexts/newsflashContext';

export function useNewsflash() {
  const context = useContext(NewsflashContext);

  if (context === null) {
    throw new Error('useNewsflash must be used within a NewsflashProvider.');
  }

  return context;
}