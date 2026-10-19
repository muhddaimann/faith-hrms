import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function NewsflashEmptyState({ description = 'There are no company updates to review right now.', title = 'You are up to date' }: { description?: string; title?: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.xl, ...theme.shadow.card }}>
      <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft }}>
        <Ionicons color={theme.colors.icon} name="newspaper-outline" size={28} />
      </View>
      <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{title}</Text>
      <Text style={{ textAlign: 'center', ...theme.typography.body, color: theme.colors.textSecondary }}>{description}</Text>
    </View>
  );
}