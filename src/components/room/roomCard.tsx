import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { type Room } from '../../constants/room';
import { useTheme } from '../../hooks/useTheme';
import { RoomInfoBadge } from './roomInfoBadge';

export function RoomCard({ availableSlots, onPress, room }: { availableSlots: number; onPress: () => void; room: Room }) {
  const { theme } = useTheme();

  return (
    <Pressable accessibilityHint="Opens this room’s 30-minute availability." accessibilityLabel={`${room.name}, ${availableSlots} available slots. ${room.floor}.`} accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ gap: theme.spacing.md, borderWidth: 1, borderColor: availableSlots > 0 ? theme.colors.border : theme.colors.borderStrong, borderRadius: theme.radius.xl, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: availableSlots === 0 ? theme.opacity.muted : pressed ? theme.opacity.pressed : 1, padding: theme.spacing.lg, ...theme.shadow.card })}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft }}>
          <Ionicons color={theme.colors.icon} name={room.icon} size={24} />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{room.name}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{room.floor}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{room.description}</Text>
        </View>
        <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
        <RoomInfoBadge icon="people-outline" label={`${room.capacity} people`} />
        {room.equipment.map((equipment) => <RoomInfoBadge icon="hardware-chip-outline" key={equipment} label={equipment} />)}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
        <Ionicons color={availableSlots > 0 ? theme.colors.success : theme.colors.warning} name={availableSlots > 0 ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={20} />
        <Text style={{ ...theme.typography.label, color: availableSlots > 0 ? theme.colors.success : theme.colors.warning }}>{availableSlots > 0 ? `${availableSlots} of 14 slots available` : 'No available slots'}</Text>
      </View>
    </Pressable>
  );
}