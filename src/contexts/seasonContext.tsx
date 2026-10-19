import { createContext, useMemo, useState, type PropsWithChildren } from 'react';

import { seasons, type Season, type SeasonId } from '../constants/season';

type SeasonContextValue = {
  season: Season;
  seasonId: SeasonId;
  selectSeason: (seasonId: SeasonId) => void;
};

export const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: PropsWithChildren) {
  const [seasonId, setSeasonId] = useState<SeasonId>('default');
  const value = useMemo<SeasonContextValue>(() => ({ season: seasons[seasonId], seasonId, selectSeason: setSeasonId }), [seasonId]);

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}