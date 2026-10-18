import { useContext } from 'react';

import { BarContext } from '../contexts/barContext';

export function useBar() {
  const context = useContext(BarContext);

  if (context === null) {
    throw new Error('useBar must be used within a BarProvider.');
  }

  return context;
}