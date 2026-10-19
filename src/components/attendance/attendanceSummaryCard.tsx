import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function AttendanceSummaryCard({ description, icon = 'calendar-outline', label, value }: { description: string; icon?: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, minWidth: 140, gap: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.md, ...theme.shadow.card }}>
      <Ionicons color={theme.colors.icon} name={icon} size={21} />
      <Text style={{ ...theme.typography.display, color: theme.colors.text, fontSize: 28, lineHeight: 34, letterSpacing: -1 }}>{value}</Text>
      <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{label}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{description}</Text>
    </View>
  );
}