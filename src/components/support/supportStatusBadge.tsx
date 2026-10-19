import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { type SupportEnquiryStatus } from '../../constants/support';
import { useTheme } from '../../hooks/useTheme';

const metadata: Record<SupportEnquiryStatus, { icon: keyof typeof Ionicons.glyphMap; label: string; tone: 'info' | 'success' | 'warning' }> = {
  submitted: { label: 'Submitted', icon: 'paper-plane-outline', tone: 'info' },
  inReview: { label: 'In review', icon: 'time-outline', tone: 'warning' },
  resolved: { label: 'Resolved', icon: 'checkmark-circle-outline', tone: 'success' },
};

export function SupportStatusBadge({ status }: { status: SupportEnquiryStatus }) {
  const { theme } = useTheme();
  const item = metadata[status];
  const soft = `${item.tone}Soft` as const;
  return <View accessibilityLabel={item.label} style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors[soft], paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}><Ionicons color={theme.colors[item.tone]} name={item.icon} size={16} /><Text style={{ ...theme.typography.label, color: theme.colors[item.tone] }}>{item.label}</Text></View>;
}
