import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { formatLeaveRange, getInclusiveBusinessDays, getLeaveType, requiresLeaveAttachment, type LeaveApplicationDraft, type LeaveBalance } from '../../constants/leave';
import { useTheme } from '../../hooks/useTheme';
import { LeaveAttachmentField } from './leaveAttachmentField';

export function LeaveForm({ balances, draft, onAddAttachment, onOpenDatePicker, onOpenLeaveTypePicker, onRemoveAttachment, onUpdateReason }: { balances: readonly LeaveBalance[]; draft: LeaveApplicationDraft; onAddAttachment: () => void; onOpenDatePicker: () => void; onOpenLeaveTypePicker: () => void; onRemoveAttachment: () => void; onUpdateReason: (value: string) => void }) {
  const { theme } = useTheme();
  const selectedType = draft.typeId ? getLeaveType(draft.typeId) : null;
  const requestedDays = draft.startDate && draft.endDate ? getInclusiveBusinessDays(draft.startDate, draft.endDate) : 0;
  const requiresAttachment = draft.typeId ? requiresLeaveAttachment(draft.typeId, requestedDays) : false;
  const balance = draft.typeId ? balances.find((item) => item.typeId === draft.typeId) : null;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} /><Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>This local preview is not sent to HR and resets when the app restarts.</Text></View>
      <FormAction icon={selectedType?.icon ?? 'calendar-outline'} label="Leave type" value={selectedType?.label ?? 'Choose leave type'} onPress={onOpenLeaveTypePicker} />
      <FormAction icon="calendar-outline" label="Leave dates" value={draft.startDate && draft.endDate ? formatLeaveRange(draft.startDate, draft.endDate) : 'Choose leave dates'} onPress={onOpenDatePicker} />
      <View style={{ gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{requestedDays} {requestedDays === 1 ? 'working day' : 'working days'} requested</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{balance ? `${balance.remaining} ${balance.remaining === 1 ? 'day' : 'days'} remaining in this local preview.` : 'Choose a leave type to review your local balance.'}</Text></View>
      <View style={{ gap: theme.spacing.sm }}><Text style={{ ...theme.typography.label, color: theme.colors.text }}>Reason</Text><TextInput accessibilityLabel="Leave reason" autoCapitalize="sentences" maxLength={160} multiline onChangeText={onUpdateReason} placeholder="For example, family commitments" placeholderTextColor={theme.colors.textMuted} style={{ minHeight: 120, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, padding: theme.spacing.md, textAlignVertical: 'top', ...theme.typography.body }} value={draft.reason} /><Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{draft.reason.trim().length}/160 characters</Text></View>
      <LeaveAttachmentField attachment={draft.attachment} required={requiresAttachment} onAdd={onAddAttachment} onRemove={onRemoveAttachment} />
    </View>
  );
}

function FormAction({ icon, label, onPress, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; value: string }) {
  const { theme } = useTheme();
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, padding: theme.spacing.md })}><Ionicons color={theme.colors.icon} name={icon} size={22} /><View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>{label}</Text><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text></View><Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} /></Pressable>;
}