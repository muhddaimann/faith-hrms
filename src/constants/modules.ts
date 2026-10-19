import type Ionicons from '@expo/vector-icons/Ionicons';

export type ModuleIcon = keyof typeof Ionicons.glyphMap;

export type ModuleTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type ModuleIdentity = {
  icon: ModuleIcon;
  tone: ModuleTone;
};

export const moduleToneSoftToken: Record<ModuleTone, 'primarySoft' | 'successSoft' | 'warningSoft' | 'dangerSoft' | 'infoSoft'> = {
  primary: 'primarySoft',
  success: 'successSoft',
  warning: 'warningSoft',
  danger: 'dangerSoft',
  info: 'infoSoft',
};
