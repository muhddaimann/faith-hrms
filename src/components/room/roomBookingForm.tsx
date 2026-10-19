import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { formatRoomDate, type Room, type RoomBookingDraft } from '../../constants/room';
import { useTheme } from '../../hooks/useTheme';

export function RoomBookingForm({ date, onCancel, onConfirm, room, slot }: { date: string; onCancel: () => void; onConfirm: (draft: RoomBookingDraft) => void; room: Room; slot: { endTime: string; startTime: string } }) {
  const { theme } = useTheme();
  const [purpose, setPurpose] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Confirm room booking</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This creates a local booking for the current session only.</Text>
        </View>
        <View style={{ gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
          <BookingDetail label="Room" value={room.name} />
          <BookingDetail label="Date" value={formatRoomDate(date)} />
          <BookingDetail label="Time" value={`${slot.startTime} – ${slot.endTime}`} />
        </View>
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Meeting purpose</Text>
          <TextInput accessibilityLabel="Meeting purpose" autoCapitalize="sentences" maxLength={120} multiline onChangeText={setPurpose} placeholder="For example, weekly customer experience planning" placeholderTextColor={theme.colors.textMuted} style={{ minHeight: 112, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, padding: theme.spacing.md, textAlignVertical: 'top', ...theme.typography.body }} value={purpose} />
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{purpose.trim().length}/120 characters</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Pressable accessibilityLabel="Cancel room booking" accessibilityRole="button" onPress={onCancel} style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Cancel</Text>
          </Pressable>
          <Pressable accessibilityLabel="Confirm room booking" accessibilityRole="button" onPress={() => onConfirm({ date, endTime: slot.endTime, purpose, roomId: room.id, startTime: slot.startTime })} style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Confirm booking</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function BookingDetail({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ flex: 1, textAlign: 'right', ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text>
    </View>
  );
}