import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { formatSupportDate, getSupportType, type SupportEnquiry } from '../../constants/support';
import { useTheme } from '../../hooks/useTheme';
import { SupportStatusBadge } from './supportStatusBadge';

export function SupportEnquiryDetail({ enquiry }: { enquiry: SupportEnquiry }) {
  const { theme } = useTheme();
  const type = getSupportType(enquiry.typeId);
  if (!type) return null;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
          <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft }}><Ionicons color={theme.colors.icon} name={type.icon} size={24} /></View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}><Text style={{ ...theme.typography.title, color: theme.colors.text }}>{enquiry.subject}</Text><SupportStatusBadge status={enquiry.status} /></View>
        </View>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{type.label}</Text>
      </View>

      <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <DetailRow icon="pricetag-outline" label="Reference" value={enquiry.reference} />
        <DetailRow icon="chatbubble-ellipses-outline" label="Type" value={type.label} />
        <DetailRow icon="send-outline" label="Submitted" value={formatSupportDate(enquiry.createdAt)} />
      </View>

      <View style={{ gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>Details</Text><Text style={{ ...theme.typography.body, color: theme.colors.text }}>{enquiry.message}</Text></View>

      {enquiry.attachment ? (
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.infoSoft, padding: theme.spacing.md }}>
          <Ionicons color={theme.colors.info} name="attach-outline" size={22} />
          <View style={{ flex: 1, gap: theme.spacing.xxs }}><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{enquiry.attachment.fileName}</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{formatAttachmentDetails(enquiry.attachment)}</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Session-only file details. The file is not stored, uploaded, or sent anywhere.</Text></View>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} /><Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>This fictional support enquiry is available only during the current app session and is not sent to a support team.</Text></View>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { theme } = useTheme();
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}><Ionicons color={theme.colors.iconMuted} name={icon} size={18} /><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{label}</Text><Text style={{ flex: 1, textAlign: 'right', ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text></View>;
}

function formatAttachmentDetails(attachment: SupportEnquiry['attachment']) {
  if (!attachment) return '';
  const source = { photoLibrary: 'Photo library', camera: 'Camera', files: 'Files' }[attachment.source];
  const size = attachment.size ? attachment.size < 1024 ? `${attachment.size} B` : attachment.size < 1024 * 1024 ? `${Math.round(attachment.size / 1024)} KB` : `${(attachment.size / (1024 * 1024)).toFixed(1)} MB` : undefined;
  return [source, attachment.mimeType, size].filter(Boolean).join(' · ');
}
