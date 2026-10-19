import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import type { PendingItem } from '../../constants/pending';
import { useTheme } from '../../hooks/useTheme';

export function PendingStatusPill({ item }: { item: PendingItem }) {
  const { theme } = useTheme();
  const status = item.statusLabel;
  const tone = item.statusLabel === 'Approved' ? 'success' : item.tone;
  const icon = item.statusLabel === 'Needs review' ? 'arrow-forward-outline' : item.statusLabel === 'Approved' ? 'checkmark-circle-outline' : item.statusLabel === 'Milestone' ? 'ribbon-outline' : 'time-outline';

  if (!status) {
    return null;
  }

  return (
    <View accessible={false} style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xxs, borderRadius: theme.radius.pill, backgroundColor: theme.colors[`${tone}Soft` as const], paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xxs }}>
      <Ionicons color={theme.colors[tone]} name={icon} size={14} />
      <Text style={{ ...theme.typography.label, color: theme.colors[tone] }}>{status}</Text>
    </View>
  );
}