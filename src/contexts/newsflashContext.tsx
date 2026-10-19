import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { newsflashItems, type NewsflashItem } from '../constants/newsflash';

type NewsflashContextValue = {
  acknowledgedIds: readonly string[];
  acknowledgeNewsflash: (id: string) => void;
  isAcknowledged: (id: string) => boolean;
  items: readonly NewsflashItem[];
};

export const NewsflashContext = createContext<NewsflashContextValue | null>(null);

export function NewsflashProvider({ children }: PropsWithChildren) {
  const [acknowledgedIds, setAcknowledgedIds] = useState<readonly string[]>([]);

  const acknowledgeNewsflash = useCallback((id: string) => {
    setAcknowledgedIds((currentIds) => currentIds.includes(id) ? currentIds : [...currentIds, id]);
  }, []);

  const isAcknowledged = useCallback((id: string) => acknowledgedIds.includes(id), [acknowledgedIds]);

  const value = useMemo<NewsflashContextValue>(() => ({
    acknowledgedIds,
    acknowledgeNewsflash,
    isAcknowledged,
    items: newsflashItems,
  }), [acknowledgedIds, acknowledgeNewsflash, isAcknowledged]);

  return <NewsflashContext.Provider value={value}>{children}</NewsflashContext.Provider>;
}