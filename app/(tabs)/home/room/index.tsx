import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { RoomBookingForm } from '../../../../src/components/room/roomBookingForm';
import { RoomCard } from '../../../../src/components/room/roomCard';
import { RoomDateControl } from '../../../../src/components/room/roomDateControl';
import { RoomSchedule } from '../../../../src/components/room/roomSchedule';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { DatePicker } from '../../../../src/components/shared/datePicker';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { formatRoomDate, formatRoomWeekday, roomBookingFeedback, roomFixtureDates, validateRoomBookingDraft, type Room, type RoomSlot } from '../../../../src/constants/room';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useRoom } from '../../../../src/hooks/useRoom';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function RoomScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { bottomSheet, customModal, dismiss, showLoader, toast } = useOverlay();
  const { canMoveNext, canMovePrevious, createBooking, getAvailabilityCount, getSlots, moveDate, rooms, selectedDate, selectDate } = useRoom();

  const openDatePicker = () => {
    customModal({
      render: () => <DatePicker availableValues={roomFixtureDates} initialMonth={selectedDate} mode="single" onSelect={(date) => dismiss(() => selectDate(date as typeof selectedDate))} selectedValue={selectedDate} subtitle="Choose a day from the local room-booking preview." title="Select a date" />,
    });
  };

  const openBookingForm = (room: Room, slot: RoomSlot) => {
    customModal({
      render: () => (
        <RoomBookingForm
          date={selectedDate}
          onCancel={() => dismiss()}
          onConfirm={(draft) => {
            const validationMessage = validateRoomBookingDraft(draft);

            if (validationMessage) {
              toast({ tone: 'warning', title: 'Add a meeting purpose', message: validationMessage });
              return;
            }

            dismiss(() => {
              showLoader({
                duration: roomBookingFeedback.confirmationLoaderDurationMs,
                label: 'Confirming your booking…',
                onComplete: () => {
                  createBooking(draft);
                  toast({ tone: 'success', title: 'Room booked', message: `${room.name} is reserved locally for ${draft.startTime} – ${draft.endTime}.` });
                },
              });
            });
          }}
          room={room}
          slot={slot}
        />
      ),
    });
  };

  const openSchedule = (room: Room) => {
    bottomSheet({
      render: () => <RoomSchedule date={selectedDate} onSelectSlot={(slot) => dismiss(() => openBookingForm(room, slot))} room={room} slots={getSlots(room.id)} />,
    });
  };

  const roomsWithAvailability = rooms.filter((room) => getAvailabilityCount(room.id) > 0);

  return (
    <AppScreen
      eyebrow="MEETING SPACES"
      onBack={() => router.replace('/home')}
      rightSlot={<RoomDatePickerButton onPress={openDatePicker} />}
      subtitle="Select a date, then choose a local room and 30-minute time slot."
      title="Room booking"
    >
      <View style={{ gap: theme.spacing.lg }}>
        <RoomDateControl canMoveNext={canMoveNext} canMovePrevious={canMovePrevious} label={`${formatRoomWeekday(selectedDate)}, ${formatRoomDate(selectedDate)}`} onMoveNext={() => moveDate(1)} onMovePrevious={() => moveDate(-1)} />
        <View style={{ gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}>
          <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>LOCAL BOOKING PREVIEW</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Bookings stay on this device only for the current app session and do not reserve a real room.</Text>
        </View>
        {roomsWithAvailability.length > 0 ? rooms.map((room) => <RoomCard availableSlots={getAvailabilityCount(room.id)} key={room.id} onPress={() => openSchedule(room)} room={room} />) : <EmptyState description="No rooms are available in the local preview for this date." icon="calendar-clear-outline" title="No rooms available" />}
      </View>
    </AppScreen>
  );
}

function RoomDatePickerButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityHint="Opens a single-date picker for room availability."
      accessibilityLabel="Select room booking date"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}
    >
      <Ionicons color={theme.colors.icon} name="calendar-outline" size={21} />
    </Pressable>
  );
}
