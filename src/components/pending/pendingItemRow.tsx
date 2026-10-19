import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import type { PendingItem } from '../../constants/pending';
import { useTheme } from '../../hooks/useTheme';
import { TintedSurface } from '../shared/tintedSurface';
import { PendingStatusPill } from './pendingStatusPill';

type PendingItemRowProps = {
  item: PendingItem;
  onPress?: () => void;
};

export function PendingItemRow({ item, onPress }: PendingItemRowProps) {
  const { theme } = useTheme();
  const isActionable = Boolean(onPress);
  const status = item.statusLabel;
  const detail = [item.summary, item.dateLabel, status].filter(Boolean).join(' · ');
  const content = (
    <TintedSurface contentStyle={{ minHeight: 80, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.md }} tone={item.tone}>
      <View accessible={false} style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors[item.tone] }}>
        <Ionicons color={theme.colors.textInverse} name={item.icon} size={24} />
      </View>
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{item.title}</Text>
        <Text numberOfLines={isActionable ? 2 : 1} style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{item.summary}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.xs }}>
          {item.dateLabel ? <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{item.dateLabel}</Text> : null}
          <PendingStatusPill item={item} />
        </View>
      </View>
      {isActionable ? <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={22} /> : null}
    </TintedSurface>
  );

  if (!isActionable) {
    return <View accessibilityLabel={`${item.title}. ${detail}`} accessibilityRole="summary" style={{ borderRadius: theme.radius.xl, ...theme.shadow.card }}>{content}</View>;
  }

  return <Pressable accessibilityHint="Opens the related Faith module." accessibilityLabel={`${item.title}. ${detail}`} accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, borderRadius: theme.radius.xl, opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card })}>{content}</Pressable>;
}