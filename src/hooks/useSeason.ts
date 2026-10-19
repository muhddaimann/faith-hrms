import { useContext } from 'react';

import { SeasonContext } from '../contexts/seasonContext';

export function useSeason() {
  const context = useContext(SeasonContext);

  if (context === null) {
    throw new Error('useSeason must be used within a SeasonProvider.');
  }

  return context;
}