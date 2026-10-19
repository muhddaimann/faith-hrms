import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { type SupportAttachment } from '../../constants/support';
import { useTheme } from '../../hooks/useTheme';

export function SupportAttachmentField({ attachment, onAdd, onRemove }: { attachment?: SupportAttachment; onAdd: () => void; onRemove: () => void }) {
  const { theme } = useTheme();
  const sourceLabel = attachment ? { photoLibrary: 'Photo library', camera: 'Camera', files: 'Files' }[attachment.source] : '';
  const details = attachment ? [sourceLabel, attachment.mimeType, attachment.size ? formatFileSize(attachment.size) : undefined].filter(Boolean).join(' · ') : '';

  return (
    <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <Ionicons color={theme.colors.iconMuted} name="attach-outline" size={22} />
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>Screenshot or file (optional)</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Session-only file details. The file is not stored, uploaded, or sent anywhere.</Text>
        </View>
      </View>
      {attachment ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Ionicons color={theme.colors.success} name="checkmark-circle-outline" size={20} />
          <View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.body, color: theme.colors.text }}>{attachment.fileName}</Text>{details ? <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{details}</Text> : null}</View>
          <Pressable accessibilityLabel="Remove local attachment" accessibilityRole="button" onPress={onRemove} style={({ pressed }) => ({ minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.sm, backgroundColor: pressed ? theme.colors.surfaceAccent : theme.colors.surface })}><Text style={{ ...theme.typography.label, color: theme.colors.danger }}>Remove</Text></Pressable>
        </View>
      ) : (
        <Pressable accessibilityLabel="Add screenshot or file" accessibilityRole="button" onPress={onAdd} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}><Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Add screenshot or file</Text></Pressable>
      )}
    </View>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
