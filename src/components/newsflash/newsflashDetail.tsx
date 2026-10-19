import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { formatNewsflashDate, newsflashCategoryMetadata, newsflashPriorityMetadata, type NewsflashItem } from '../../constants/newsflash';
import { useTheme } from '../../hooks/useTheme';

type NewsflashDetailProps = {
  acknowledged: boolean;
  item: NewsflashItem;
  onAcknowledge: () => void;
};

export function NewsflashDetail({ acknowledged, item, onAcknowledge }: NewsflashDetailProps) {
  const { theme } = useTheme();
  const category = newsflashCategoryMetadata[item.category];
  const priority = newsflashPriorityMetadata[item.priority];
  const priorityColors = {
    critical: { color: theme.colors.danger, soft: theme.colors.dangerSoft },
    important: { color: theme.colors.warning, soft: theme.colors.warningSoft },
    normal: { color: theme.colors.info, soft: theme.colors.infoSoft },
  }[item.priority];

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
          <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
            <Ionicons color={theme.colors.icon} name={category.icon} size={18} />
            <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{category.label} · {item.relativePublishedAt}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: priorityColors.soft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
            <Ionicons color={priorityColors.color} name={priority.icon} size={18} />
            <Text style={{ ...theme.typography.label, color: priorityColors.color }}>{priority.label}</Text>
          </View>
        </View>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{item.title}</Text>
      </View>

      <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <DetailRow icon="person-outline" label="By" value={item.author} />
        <DetailRow icon="calendar-outline" label="Published" value={formatNewsflashDate(item.publishedAt)} />
        <DetailRow icon="time-outline" label="Expires" value={formatNewsflashDate(item.expiresAt)} />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        {item.body.map((paragraph) => <Text key={paragraph} style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{paragraph}</Text>)}
      </View>

      {acknowledged ? (
        <View accessibilityLabel="Acknowledged" style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.successSoft, padding: theme.spacing.md }}>
          <Ionicons color={theme.colors.success} name="checkmark-circle-outline" size={22} />
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Text style={{ ...theme.typography.label, color: theme.colors.success }}>Acknowledged</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This update is marked as read for the current session.</Text>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityHint="Closes this update and records your acknowledgement for the current session."
          accessibilityLabel="Acknowledge company update"
          accessibilityRole="button"
          onPress={onAcknowledge}
          style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.md })}
        >
          <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Acknowledge</Text>
        </Pressable>
      )}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
      <Ionicons color={theme.colors.iconMuted} name={icon} size={18} />
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ flex: 1, textAlign: 'right', ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text>
    </View>
  );
}