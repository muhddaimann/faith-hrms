import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, TextInput, View } from 'react-native';

import { getSupportType, supportModuleIdentity, type SupportEnquiryDraft } from '../../constants/support';
import { useTheme } from '../../hooks/useTheme';
import { SupportAttachmentField } from './supportAttachmentField';

export function SupportForm({ draft, onAddAttachment, onOpenTypePicker, onRemoveAttachment, onUpdateMessage, onUpdateSubject }: { draft: SupportEnquiryDraft; onAddAttachment: () => void; onOpenTypePicker: () => void; onRemoveAttachment: () => void; onUpdateMessage: (value: string) => void; onUpdateSubject: (value: string) => void }) {
  const { theme } = useTheme();
  const selectedType = draft.typeId ? getSupportType(draft.typeId) : null;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} /><Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>This local preview is not sent to a support team and resets when the app restarts.</Text></View>

      <Pressable accessibilityLabel="Enquiry type" accessibilityRole="button" onPress={onOpenTypePicker} style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, padding: theme.spacing.md })}><Ionicons color={theme.colors.icon} name={selectedType?.icon ?? supportModuleIdentity.icon} size={22} /><View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>Enquiry type</Text><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{selectedType?.label ?? 'Choose bug report, feedback, or question'}</Text></View><Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} /></Pressable>

      <View style={{ gap: theme.spacing.sm }}><Text style={{ ...theme.typography.label, color: theme.colors.text }}>Subject</Text><TextInput accessibilityLabel="Support enquiry subject" autoCapitalize="sentences" maxLength={80} onChangeText={onUpdateSubject} placeholder={selectedType?.subjectPlaceholder ?? 'Add a short subject'} placeholderTextColor={theme.colors.textMuted} style={{ minHeight: 52, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, paddingHorizontal: theme.spacing.md, ...theme.typography.body }} value={draft.subject} /><Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{draft.subject.trim().length}/80 characters</Text></View>

      <View style={{ gap: theme.spacing.sm }}><Text style={{ ...theme.typography.label, color: theme.colors.text }}>Details</Text><TextInput accessibilityLabel="Support enquiry details" autoCapitalize="sentences" maxLength={500} multiline onChangeText={onUpdateMessage} placeholder="Describe what happened, share your idea, or ask your question" placeholderTextColor={theme.colors.textMuted} style={{ minHeight: 140, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, padding: theme.spacing.md, textAlignVertical: 'top', ...theme.typography.body }} value={draft.message} /><Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{draft.message.trim().length}/500 characters</Text></View>

      <SupportAttachmentField attachment={draft.attachment} onAdd={onAddAttachment} onRemove={onRemoveAttachment} />
    </View>
  );
}
