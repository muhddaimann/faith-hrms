import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { type RoomSlot as RoomSlotType } from '../../constants/room';
import { useTheme } from '../../hooks/useTheme';

export function RoomSlot({ onPress, slot }: { onPress: () => void; slot: RoomSlotType }) {
  const { theme } = useTheme();
  const available = slot.status === 'available';
  const booked = slot.status === 'booked';
  const color = available ? theme.colors.primary : booked ? theme.colors.info : theme.colors.textMuted;
  const backgroundColor = available ? theme.colors.primarySoft : booked ? theme.colors.infoSoft : theme.colors.surfaceMuted;
  const label = available ? 'Available' : booked ? 'Booked this session' : 'Unavailable';

  return (
    <Pressable accessibilityHint={available ? 'Selects this 30-minute time slot.' : 'This time slot cannot be selected.'} accessibilityLabel={`${slot.startTime} to ${slot.endTime}, ${label}`} accessibilityRole="button" disabled={!available} onPress={onPress} style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm, borderWidth: 1, borderColor: available ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius.md, backgroundColor: pressed && available ? theme.colors.surfaceAccent : backgroundColor, opacity: available ? pressed ? theme.opacity.pressed : 1 : theme.opacity.muted, paddingHorizontal: theme.spacing.md })}>
      <Text style={{ ...theme.typography.bodyStrong, color: available ? theme.colors.text : theme.colors.textSecondary }}>{slot.startTime} – {slot.endTime}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
        <Ionicons color={color} name={available ? 'add-circle-outline' : booked ? 'checkmark-circle-outline' : 'close-circle-outline'} size={20} />
        <Text style={{ ...theme.typography.label, color }}>{label}</Text>
      </View>
    </Pressable>
  );
}