import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { RoomRecordCard } from '../../../../src/components/room/roomRecordCard';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { getRoomById } from '../../../../src/constants/room';
import { useRoom } from '../../../../src/hooks/useRoom';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function RoomRecordScreen() {
  const router = useRouter();
  const { bookings } = useRoom();
  const { theme } = useTheme();
  const records = [...bookings].reverse();

  return (
    <AppScreen eyebrow="LOCAL BOOKING PREVIEW" onBack={() => router.replace('/home/room')} subtitle="Bookings exist only on this device for the current app session." title="Booking records">
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}>
          <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>SESSION-ONLY RECORDS</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>These fictional bookings do not reserve a real room and reset when the app restarts.</Text>
        </View>
        {records.length === 0 ? <EmptyState description="Confirmed local room bookings will appear here for the current app session." icon="receipt-outline" title="No booking records yet" /> : records.map((booking) => {
          const room = getRoomById(booking.roomId);
          return room ? <RoomRecordCard booking={booking} key={booking.id} room={room} /> : null;
        })}
      </View>
    </AppScreen>
  );
}