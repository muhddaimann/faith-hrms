import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import { layout } from '../constants/layout';

type BarContextValue = {
  activeRoute: string | null;
  hasScrolled: boolean;
  isReturningToTop: boolean;
  scrollToTopRequest: { id: number; route: string } | null;
  completeScrollToTop: (route: string, requestId: number) => void;
  register: (route: string) => void;
  setScrollOffset: (route: string, offset: number) => void;
  unregister: (route: string) => void;
  scrollToTop: () => void;
};

export const BarContext = createContext<BarContextValue | null>(null);

export function BarProvider({ children }: { children: ReactNode }) {
  const offsets = useRef(new Map<string, number>());
  const nextScrollToTopRequestId = useRef(0);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isReturningToTop, setIsReturningToTop] = useState(false);
  const [scrollToTopRequest, setScrollToTopRequest] = useState<{ id: number; route: string } | null>(null);

  const register = useCallback((route: string) => {
    offsets.current.set(route, 0);
    setActiveRoute(route);
    setHasScrolled(false);
    setIsReturningToTop(false);
    setScrollToTopRequest(null);
  }, []);

  const unregister = useCallback((route: string) => {
    offsets.current.delete(route);
    setActiveRoute((currentRoute) => currentRoute === route ? null : currentRoute);
    setHasScrolled(false);
    setIsReturningToTop(false);
    setScrollToTopRequest((currentRequest) => currentRequest?.route === route ? null : currentRequest);
  }, []);

  const setScrollOffset = useCallback((route: string, offset: number) => {
    if (route !== activeRoute) {
      return;
    }

    offsets.current.set(route, offset);
    setHasScrolled(offset > layout.scrollHysteresis);
  }, [activeRoute]);

  const completeScrollToTop = useCallback((route: string, requestId: number) => {
    setScrollToTopRequest((currentRequest) => {
      if (currentRequest?.route !== route || currentRequest.id !== requestId) {
        return currentRequest;
      }

      offsets.current.set(route, 0);
      setHasScrolled(false);
      setIsReturningToTop(false);
      return null;
    });
  }, []);

  const scrollToTop = useCallback(() => {
    if (!activeRoute || isReturningToTop) {
      return;
    }

    setIsReturningToTop(true);
    setScrollToTopRequest({ id: nextScrollToTopRequestId.current + 1, route: activeRoute });
    nextScrollToTopRequestId.current += 1;
  }, [activeRoute, isReturningToTop]);

  const value = useMemo(() => ({ activeRoute, hasScrolled, isReturningToTop, scrollToTopRequest, completeScrollToTop, register, setScrollOffset, unregister, scrollToTop }), [activeRoute, hasScrolled, isReturningToTop, scrollToTopRequest, completeScrollToTop, register, setScrollOffset, unregister, scrollToTop]);

  return <BarContext.Provider value={value}>{children}</BarContext.Provider>;
}