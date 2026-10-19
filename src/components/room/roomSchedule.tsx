import { Text, View } from 'react-native';

import { formatRoomDate, type Room, type RoomSlot as RoomSlotData } from '../../constants/room';
import { useTheme } from '../../hooks/useTheme';
import { RoomInfoBadge } from './roomInfoBadge';
import { RoomSlot } from './roomSlot';

export function RoomSchedule({ date, onSelectSlot, room, slots }: { date: string; onSelectSlot: (slot: RoomSlotData) => void; room: Room; slots: readonly RoomSlotData[] }) {
  const { theme } = useTheme();
  const availableCount = slots.filter((slot) => slot.status === 'available').length;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{room.name}</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{room.floor} · {formatRoomDate(date)}</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{room.description}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
          <RoomInfoBadge icon="people-outline" label={`${room.capacity} people`} />
          {room.equipment.map((equipment) => <RoomInfoBadge icon="hardware-chip-outline" key={equipment} label={equipment} />)}
        </View>
      </View>
      <View style={{ gap: theme.spacing.xs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}>
        <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{availableCount} slots available</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Choose one 30-minute slot for this local booking preview.</Text>
      </View>
      <View accessibilityRole="list" style={{ gap: theme.spacing.sm }}>
        {slots.map((slot) => <RoomSlot key={slot.startTime} onPress={() => onSelectSlot(slot)} slot={slot} />)}
      </View>
    </View>
  );
}