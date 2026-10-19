import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { attendanceStatusMetadata, type AttendanceStatus } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const { theme } = useTheme();
  const metadata = attendanceStatusMetadata[status];
  const colors = {
    success: { color: theme.colors.success, soft: theme.colors.successSoft },
    warning: { color: theme.colors.warning, soft: theme.colors.warningSoft },
    danger: { color: theme.colors.danger, soft: theme.colors.dangerSoft },
    info: { color: theme.colors.info, soft: theme.colors.infoSoft },
    neutral: { color: theme.colors.textSecondary, soft: theme.colors.surfaceMuted },
  }[metadata.tone];

  return (
    <View accessibilityLabel={`Attendance status: ${metadata.label}`} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: colors.soft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
      <Ionicons color={colors.color} name={metadata.icon} size={16} />
      <Text style={{ ...theme.typography.label, color: colors.color }}>{metadata.label}</Text>
    </View>
  );
}