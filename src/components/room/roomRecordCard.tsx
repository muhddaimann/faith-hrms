import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { formatRoomDate, formatRoomWeekday, type Room, type RoomBooking } from '../../constants/room';
import { useTheme } from '../../hooks/useTheme';

export function RoomRecordCard({ booking, room }: { booking: RoomBooking; room: Room }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft }}>
          <Ionicons color={theme.colors.icon} name={room.icon} size={24} />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{room.name}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{room.floor}</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.successSoft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
          <Ionicons color={theme.colors.success} name="checkmark-circle-outline" size={16} />
          <Text style={{ ...theme.typography.label, color: theme.colors.success }}>Booked</Text>
        </View>
      </View>
      <View style={{ gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <RecordDetail icon="calendar-outline" label="Date" value={`${formatRoomWeekday(booking.date)}, ${formatRoomDate(booking.date)}`} />
        <RecordDetail icon="time-outline" label="Time" value={`${booking.startTime} – ${booking.endTime}`} />
      </View>
      <View style={{ gap: theme.spacing.xxs }}>
        <Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>Meeting purpose</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{booking.purpose}</Text>
      </View>
    </View>
  );
}

function RecordDetail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
      <Ionicons color={theme.colors.iconMuted} name={icon} size={18} />
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ flex: 1, textAlign: 'right', ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text>
    </View>
  );
}