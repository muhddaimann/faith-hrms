export const authCredentials = {
  username: 'user',
  password: '123',
} as const;

export const authCredentialTypes = {
  username: {
    autoComplete: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    textContentType: 'username',
  },
  password: {
    autoComplete: 'current-password',
    label: 'Password',
    placeholder: 'Enter your password',
    textContentType: 'password',
  },
} as const;

export const authSession = {
  durationMs: 24 * 60 * 60 * 1000,
  storageKey: 'faith.auth.session.v1',
  version: 1,
} as const;

export const authFeedback = {
  minimumLoaderDurationMs: 1_000,
} as const;

export type AuthCredentials = {
  password: string;
  username: string;
};

export type AuthSession = {
  expiresAt: number;
  issuedAt: number;
  username: string;
  version: typeof authSession.version;
};