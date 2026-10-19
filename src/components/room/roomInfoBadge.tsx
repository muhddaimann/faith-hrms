import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function RoomInfoBadge({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
      <Ionicons color={theme.colors.iconMuted} name={icon} size={16} />
      <Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>{label}</Text>
    </View>
  );
}