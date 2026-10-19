import { createContext, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { getAvailableSlotCount, getRoomSlots, isRoomFixtureDate, roomFixtureToday, roomFixtureDates, rooms, type RoomBooking, type RoomBookingDraft, type RoomFixtureDate, type RoomId, type RoomSlot } from '../constants/room';

type RoomContextValue = {
  bookings: readonly RoomBooking[];
  canMoveNext: boolean;
  canMovePrevious: boolean;
  createBooking: (draft: RoomBookingDraft) => void;
  getAvailabilityCount: (roomId: RoomId) => number;
  getSlots: (roomId: RoomId) => readonly RoomSlot[];
  moveDate: (direction: -1 | 1) => void;
  rooms: typeof rooms;
  selectedDate: RoomFixtureDate;
  selectDate: (date: RoomFixtureDate) => void;
};

export const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: PropsWithChildren) {
  const [selectedDate, setSelectedDate] = useState<RoomFixtureDate>(roomFixtureToday);
  const [bookings, setBookings] = useState<readonly RoomBooking[]>([]);
  const selectedDateIndex = roomFixtureDates.indexOf(selectedDate as (typeof roomFixtureDates)[number]);

  const moveDate = useCallback((direction: -1 | 1) => {
    setSelectedDate((currentDate) => {
      const currentIndex = roomFixtureDates.indexOf(currentDate);
      const nextDate = roomFixtureDates[currentIndex + direction];
      return nextDate ?? currentDate;
    });
  }, []);

  const selectDate = useCallback((date: RoomFixtureDate) => {
    if (isRoomFixtureDate(date)) {
      setSelectedDate(date);
    }
  }, []);

  const createBooking = useCallback((draft: RoomBookingDraft) => {
    setBookings((currentBookings) => {
      const alreadyBooked = currentBookings.some((booking) => booking.roomId === draft.roomId && booking.date === draft.date && booking.startTime === draft.startTime);

      if (alreadyBooked) {
        return currentBookings;
      }

      return [
        ...currentBookings,
        {
          date: draft.date,
          endTime: draft.endTime,
          id: `${draft.roomId}-${draft.date}-${draft.startTime}`,
          purpose: draft.purpose.trim(),
          roomId: draft.roomId,
          startTime: draft.startTime,
        },
      ];
    });
  }, []);

  const value = useMemo<RoomContextValue>(() => ({
    bookings,
    canMoveNext: selectedDateIndex < roomFixtureDates.length - 1,
    canMovePrevious: selectedDateIndex > 0,
    createBooking,
    getAvailabilityCount: (roomId) => getAvailableSlotCount(roomId, selectedDate, bookings),
    getSlots: (roomId) => getRoomSlots(roomId, selectedDate, bookings),
    moveDate,
    rooms,
    selectedDate,
    selectDate,
  }), [bookings, createBooking, moveDate, selectDate, selectedDate, selectedDateIndex]);

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}