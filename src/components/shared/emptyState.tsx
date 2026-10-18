import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function EmptyState({ description, icon = 'sparkles-outline', title }: { description: string; icon?: keyof typeof Ionicons.glyphMap; title: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.xl, ...theme.shadow.card }}>
      <Ionicons color={theme.colors.icon} name={icon} size={32} />
      <Text style={{ ...theme.typography.title, color: theme.colors.text, textAlign: 'center' }}>{title}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center' }}>{description}</Text>
    </View>
  );
}