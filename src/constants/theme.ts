import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

const opacity = {
  disabled: 0.42,
  muted: 0.68,
  pressed: 0.82,
  subtle: 0.12,
} as const;

const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

const typography = {
  eyebrow: { fontFamily: fontFamily.bold, fontSize: 12, letterSpacing: 1.4, lineHeight: 18 },
  label: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 20 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 24 },
  title: { fontFamily: fontFamily.bold, fontSize: 28, letterSpacing: -0.8, lineHeight: 36 },
  display: { fontFamily: fontFamily.bold, fontSize: 48, letterSpacing: -2, lineHeight: 58 },
} as const satisfies Record<string, TextStyle>;

const shadow = {
  card: Platform.select<ViewStyle>({
    ios: { shadowColor: '#1F1538', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 18 },
    android: { elevation: 0 },
    default: {},
  }) ?? {},
  raised: Platform.select<ViewStyle>({
    ios: { shadowColor: '#1F1538', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.16, shadowRadius: 28 },
    android: { elevation: 0 },
    default: {},
  }) ?? {},
} as const;

const shared = { spacing, radius, opacity, fontFamily, typography, shadow } as const;

export const themes = {
  light: {
    ...shared,
    mode: 'light',
    colors: {
      background: '#F8F7FF', surface: '#FFFFFF', surfaceMuted: '#F0EDFA', surfaceAccent: '#EDE9FE',
      border: '#E4DEF1', borderStrong: '#CFC3EA', primary: '#6D28D9', primaryPressed: '#5B21B6',
      primarySoft: '#EDE9FE', accent: '#0F9F6E', accentSoft: '#DCFCE7', text: '#1F1538',
      textSecondary: '#675C7A', textMuted: '#8B819C', textInverse: '#FFFFFF', icon: '#5B21B6',
      iconMuted: '#766A8B', focus: '#8B5CF6', overlayBackdrop: 'rgba(31, 21, 56, 0.56)',
      success: '#15803D', successSoft: '#DCFCE7', warning: '#B45309', warningSoft: '#FEF3C7',
      danger: '#B91C1C', dangerSoft: '#FEE2E2', info: '#2563EB', infoSoft: '#DBEAFE',
    },
  },
  dark: {
    ...shared,
    mode: 'dark',
    colors: {
      background: '#160F24', surface: '#241A35', surfaceMuted: '#302344', surfaceAccent: '#382155',
      border: '#47375E', borderStrong: '#65517F', primary: '#B794F4', primaryPressed: '#D8B4FE',
      primarySoft: '#382155', accent: '#6EE7B7', accentSoft: '#173D35', text: '#F7F2FF',
      textSecondary: '#D2C8E1', textMuted: '#AA9DBE', textInverse: '#160F24', icon: '#D8B4FE',
      iconMuted: '#B6A9C7', focus: '#C4B5FD', overlayBackdrop: 'rgba(7, 4, 12, 0.72)',
      success: '#86EFAC', successSoft: '#173D35', warning: '#FCD34D', warningSoft: '#4B3510',
      danger: '#FCA5A5', dangerSoft: '#4C1D2A', info: '#93C5FD', infoSoft: '#193A5E',
    },
  },
} as const;

export type Theme = (typeof themes)[ThemeMode];