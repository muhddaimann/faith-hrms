import { useContext } from 'react';

import { RoomContext } from '../contexts/roomContext';

export function useRoom() {
  const context = useContext(RoomContext);

  if (context === null) {
    throw new Error('useRoom must be used within a RoomProvider.');
  }

  return context;
}