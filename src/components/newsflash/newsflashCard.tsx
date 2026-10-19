import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { formatNewsflashDate, newsflashCategoryMetadata, newsflashPriorityMetadata, type NewsflashItem } from '../../constants/newsflash';
import { useTheme } from '../../hooks/useTheme';

type NewsflashCardProps = {
  acknowledged: boolean;
  item: NewsflashItem;
  onPress: () => void;
};

export function NewsflashCard({ acknowledged, item, onPress }: NewsflashCardProps) {
  const { theme } = useTheme();
  const category = newsflashCategoryMetadata[item.category];
  const priority = newsflashPriorityMetadata[item.priority];
  const priorityColors = {
    critical: { color: theme.colors.danger, soft: theme.colors.dangerSoft },
    important: { color: theme.colors.warning, soft: theme.colors.warningSoft },
    normal: { color: theme.colors.info, soft: theme.colors.infoSoft },
  }[item.priority];
  const statusLabel = acknowledged ? 'Acknowledged' : 'Acknowledgement required';

  return (
    <Pressable
      accessibilityHint={acknowledged ? 'Opens this acknowledged company update.' : 'Opens this company update for review and acknowledgement.'}
      accessibilityLabel={`${priority.label} ${category.label}: ${item.title}. ${statusLabel}.`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        gap: theme.spacing.md,
        borderWidth: 1,
        borderColor: acknowledged ? theme.colors.border : theme.colors.primary,
        borderRadius: theme.radius.xl,
        backgroundColor: acknowledged ? theme.colors.surface : theme.colors.surfaceAccent,
        opacity: pressed ? theme.opacity.pressed : 1,
        padding: theme.spacing.lg,
        ...theme.shadow.card,
      })}
    >
      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
              <Ionicons color={theme.colors.icon} name={category.icon} size={17} />
              <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{category.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: priorityColors.soft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
              <Ionicons color={priorityColors.color} name={priority.icon} size={17} />
              <Text style={{ ...theme.typography.label, color: priorityColors.color }}>{priority.label}</Text>
            </View>
          </View>
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{item.relativePublishedAt}</Text>
        </View>
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{item.title}</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>By {item.author}</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>Published {formatNewsflashDate(item.publishedAt)} · Expires {formatNewsflashDate(item.expiresAt)}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
        <Ionicons color={acknowledged ? theme.colors.success : theme.colors.warning} name={acknowledged ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={20} />
        <Text style={{ ...theme.typography.label, color: acknowledged ? theme.colors.success : theme.colors.warning }}>{statusLabel}</Text>
      </View>
    </Pressable>
  );
}