import type { ModuleIcon } from './modules';
import type { ThemeColors, ThemeMode } from './theme';

export type SeasonId = 'default' | 'chineseNewYear' | 'hariRayaAidilfitri' | 'merdekaDay' | 'deepavali';

type SeasonalColorOverrides = Pick<ThemeColors, 'accent' | 'accentSoft' | 'focus' | 'icon' | 'primary' | 'primaryPressed' | 'primarySoft'>;

export type Season = {
  description: string;
  icon: ModuleIcon;
  id: SeasonId;
  label: string;
  overrides: Record<ThemeMode, SeasonalColorOverrides>;
};

export const seasons: Record<SeasonId, Season> = {
  default: {
    id: 'default', label: 'Default', description: 'Faith’s calm purple workplace palette.', icon: 'color-palette-outline',
    overrides: {
      light: { primary: '#6D28D9', primaryPressed: '#5B21B6', primarySoft: '#EDE9FE', accent: '#0F9F6E', accentSoft: '#DCFCE7', icon: '#5B21B6', focus: '#8B5CF6' },
      dark: { primary: '#B794F4', primaryPressed: '#D8B4FE', primarySoft: '#382155', accent: '#6EE7B7', accentSoft: '#173D35', icon: '#D8B4FE', focus: '#C4B5FD' },
    },
  },
  chineseNewYear: {
    id: 'chineseNewYear', label: 'Chinese New Year', description: 'Warm red and gold accents for a refined seasonal look.', icon: 'sparkles-outline',
    overrides: {
      light: { primary: '#B91C1C', primaryPressed: '#991B1B', primarySoft: '#FEE2E2', accent: '#A16207', accentSoft: '#FEF3C7', icon: '#B91C1C', focus: '#DC2626' },
      dark: { primary: '#FCA5A5', primaryPressed: '#FECACA', primarySoft: '#4C1D2A', accent: '#FCD34D', accentSoft: '#4B3510', icon: '#FCA5A5', focus: '#FCA5A5' },
    },
  },
  hariRayaAidilfitri: {
    id: 'hariRayaAidilfitri', label: 'Hari Raya Aidilfitri', description: 'Emerald and soft gold accents for a calm celebratory mood.', icon: 'leaf-outline',
    overrides: {
      light: { primary: '#047857', primaryPressed: '#065F46', primarySoft: '#D1FAE5', accent: '#A16207', accentSoft: '#FEF3C7', icon: '#047857', focus: '#059669' },
      dark: { primary: '#6EE7B7', primaryPressed: '#A7F3D0', primarySoft: '#173D35', accent: '#FCD34D', accentSoft: '#4B3510', icon: '#6EE7B7', focus: '#6EE7B7' },
    },
  },
  merdekaDay: {
    id: 'merdekaDay', label: 'Merdeka Day', description: 'Confident navy, red, and gold-inspired accent colors.', icon: 'flag-outline',
    overrides: {
      light: { primary: '#1E3A8A', primaryPressed: '#1E3075', primarySoft: '#DBEAFE', accent: '#B91C1C', accentSoft: '#FEE2E2', icon: '#1E3A8A', focus: '#2563EB' },
      dark: { primary: '#93C5FD', primaryPressed: '#BFDBFE', primarySoft: '#193A5E', accent: '#FCA5A5', accentSoft: '#4C1D2A', icon: '#93C5FD', focus: '#93C5FD' },
    },
  },
  deepavali: {
    id: 'deepavali', label: 'Deepavali', description: 'Luminous violet and marigold accents for an elegant glow.', icon: 'sunny-outline',
    overrides: {
      light: { primary: '#7E22CE', primaryPressed: '#6B21A8', primarySoft: '#F3E8FF', accent: '#B45309', accentSoft: '#FEF3C7', icon: '#7E22CE', focus: '#A855F7' },
      dark: { primary: '#D8B4FE', primaryPressed: '#E9D5FF', primarySoft: '#3B1D54', accent: '#FCD34D', accentSoft: '#4B3510', icon: '#D8B4FE', focus: '#D8B4FE' },
    },
  },
};

export const seasonOptions = Object.values(seasons);