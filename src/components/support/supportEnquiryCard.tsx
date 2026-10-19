import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { formatSupportDateCompact, getSupportType, type SupportEnquiry } from '../../constants/support';
import { useTheme } from '../../hooks/useTheme';
import { SupportStatusBadge } from './supportStatusBadge';

export function SupportEnquiryCard({ enquiry, onPress }: { enquiry: SupportEnquiry; onPress: () => void }) {
  const { theme } = useTheme();
  const type = getSupportType(enquiry.typeId);
  if (!type) return null;

  return (
    <Pressable
      accessibilityHint="Opens the support enquiry details."
      accessibilityLabel={`${type.label}, ${enquiry.subject}, ${enquiry.status}, ${enquiry.reference}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1, padding: theme.spacing.lg, ...theme.shadow.card })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft }}><Ionicons color={theme.colors.icon} name={type.icon} size={24} /></View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{enquiry.subject}</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{type.label} · {enquiry.reference}</Text></View>
        <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <SupportStatusBadge status={enquiry.status} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          {enquiry.attachment ? <View accessibilityLabel="Local attachment details available" style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}><Ionicons color={theme.colors.info} name="attach-outline" size={18} /><Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>Attachment</Text></View> : null}
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{formatSupportDateCompact(enquiry.createdAt)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
