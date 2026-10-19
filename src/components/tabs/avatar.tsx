import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Avatar({ fullName, size = 40 }: { fullName: string; size?: number }) {
  const { theme } = useTheme();

  return (
    <View accessibilityLabel={`${fullName} initials`} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary }}>
      <Text style={{ ...theme.typography.label, fontSize: Math.round(size * 0.36), color: theme.colors.textInverse }}>{getInitials(fullName)}</Text>
    </View>
  );
}
