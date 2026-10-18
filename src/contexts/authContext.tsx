import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';

import { authCredentials, authSession, type AuthCredentials, type AuthSession } from '../constants/auth';

type AuthStatus = 'restoring' | 'unauthenticated' | 'authenticated';

type AuthContextValue = {
  completeSignIn: () => void;
  completeSessionRestore: () => void;
  completeSignOut: () => void;
  error: string | null;
  isAuthenticated: boolean;
  pendingSession: AuthSession | null;
  restoredSession: AuthSession | null;
  session: AuthSession | null;
  prepareSignIn: (credentials: AuthCredentials) => Promise<boolean>;
  prepareSignOut: () => Promise<boolean>;
  status: AuthStatus;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function isValidSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Partial<AuthSession>;
  return session.version === authSession.version
    && typeof session.username === 'string'
    && session.username.length > 0
    && typeof session.issuedAt === 'number'
    && Number.isFinite(session.issuedAt)
    && typeof session.expiresAt === 'number'
    && Number.isFinite(session.expiresAt)
    && session.expiresAt > session.issuedAt;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingSession, setPendingSession] = useState<AuthSession | null>(null);
  const [restoredSession, setRestoredSession] = useState<AuthSession | null>(null);
  const currentSession = useRef<AuthSession | null>(null);

  const applySession = useCallback((nextSession: AuthSession | null) => {
    currentSession.current = nextSession;
    setSession(nextSession);
    setStatus(nextSession ? 'authenticated' : 'unauthenticated');
  }, []);

  const clearStoredSession = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(authSession.storageKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setStatus('restoring');
    setError(null);

    try {
      const storedSession = await SecureStore.getItemAsync(authSession.storageKey);

      if (!storedSession) {
        applySession(null);
        return;
      }

      const parsedSession: unknown = JSON.parse(storedSession);
      if (!isValidSession(parsedSession) || parsedSession.expiresAt <= Date.now()) {
        await clearStoredSession();
        applySession(null);
        return;
      }

      setRestoredSession(parsedSession);
      setStatus('unauthenticated');
    } catch {
      await clearStoredSession();
      setError('We could not restore your saved session. Please sign in again.');
      applySession(null);
    }
  }, [applySession, clearStoredSession]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }

      const activeSession = currentSession.current;
      if (activeSession && activeSession.expiresAt <= Date.now()) {
        void clearStoredSession();
        applySession(null);
      }
    });

    return () => subscription.remove();
  }, [applySession, clearStoredSession]);

  const prepareSignIn = useCallback(async ({ username, password }: AuthCredentials) => {
    setError(null);

    if (username !== authCredentials.username || password !== authCredentials.password) {
      setError('Username or password is incorrect.');
      return false;
    }

    const issuedAt = Date.now();
    const nextSession: AuthSession = {
      expiresAt: issuedAt + authSession.durationMs,
      issuedAt,
      username,
      version: authSession.version,
    };

    try {
      await SecureStore.setItemAsync(authSession.storageKey, JSON.stringify(nextSession));
      setPendingSession(nextSession);
      return true;
    } catch {
      setError('We could not save your secure session. Please try again.');
      setPendingSession(null);
      return false;
    }
  }, []);

  const completeSignIn = useCallback(() => {
    const nextSession = pendingSession;
    setPendingSession(null);

    if (nextSession) {
      applySession(nextSession);
    }
  }, [applySession, pendingSession]);

  const completeSessionRestore = useCallback(() => {
    setRestoredSession((nextSession) => {
      if (nextSession) {
        applySession(nextSession);
      }

      return null;
    });
  }, [applySession]);

  const prepareSignOut = useCallback(async () => {
    setError(null);
    const didClearStorage = await clearStoredSession();

    if (!didClearStorage) {
      setError('We could not clear your secure session. Please try again.');
      return false;
    }

    return true;
  }, [clearStoredSession]);

  const completeSignOut = useCallback(() => {
    setPendingSession(null);
    setRestoredSession(null);
    applySession(null);
  }, [applySession]);

  const value = useMemo<AuthContextValue>(() => ({
    completeSignIn,
    completeSessionRestore,
    completeSignOut,
    error,
    isAuthenticated: status === 'authenticated',
    pendingSession,
    restoredSession,
    session,
    prepareSignIn,
    prepareSignOut,
    status,
  }), [completeSignIn, completeSessionRestore, completeSignOut, error, pendingSession, prepareSignIn, prepareSignOut, restoredSession, session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}