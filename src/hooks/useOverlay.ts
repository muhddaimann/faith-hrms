import { useContext } from 'react';

import { OverlayContext } from '../contexts/overlayContext';

export function useOverlay() {
  const context = useContext(OverlayContext);

  if (context === null) {
    throw new Error('useOverlay must be used within an OverlayProvider.');
  }

  return context;
}