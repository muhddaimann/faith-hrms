import type Ionicons from '@expo/vector-icons/Ionicons';

import type { ModuleIdentity } from './modules';

export type RoomId = 'atlas' | 'harbor' | 'orchid' | 'summit';
export type RoomSlotStatus = 'available' | 'unavailable' | 'booked';

export type Room = {
  capacity: number;
  description: string;
  equipment: readonly string[];
  floor: string;
  icon: keyof typeof Ionicons.glyphMap;
  id: RoomId;
  name: string;
};

export type RoomSlot = {
  endTime: string;
  startTime: string;
  status: RoomSlotStatus;
};

export type RoomBooking = {
  date: string;
  endTime: string;
  id: string;
  purpose: string;
  roomId: RoomId;
  startTime: string;
};

export type RoomBookingDraft = {
  date: string;
  endTime: string;
  purpose: string;
  roomId: RoomId;
  startTime: string;
};

export const roomBookingFeedback = {
  confirmationLoaderDurationMs: 1_000,
} as const;

export const roomFixtureToday = '2026-10-19';
export const roomFixtureDates = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'] as const;

export type RoomFixtureDate = (typeof roomFixtureDates)[number];

export const rooms: readonly Room[] = [
  { id: 'atlas', name: 'Atlas', floor: 'Level 8 · East Wing', capacity: 10, equipment: ['Display', 'Video call'], description: 'A bright mid-size room for team planning and client conversations.', icon: 'map-outline' },
  { id: 'harbor', name: 'Harbor', floor: 'Level 8 · West Wing', capacity: 6, equipment: ['Whiteboard', 'Video call'], description: 'A focused space for quick stand-ups and private catch-ups.', icon: 'water-outline' },
  { id: 'orchid', name: 'Orchid', floor: 'Level 9 · Garden Wing', capacity: 4, equipment: ['Display', 'Whiteboard'], description: 'A quiet huddle room for small working sessions.', icon: 'flower-outline' },
  { id: 'summit', name: 'Summit', floor: 'Level 9 · North Wing', capacity: 16, equipment: ['Display', 'Video call', 'Whiteboard'], description: 'A larger collaboration space for presentations and workshops.', icon: 'trail-sign-outline' },
] as const;

export const roomModuleIdentity: ModuleIdentity = { icon: 'business-outline', tone: 'info' };

const baseSlots = [
  ['09:00', '09:30'], ['09:30', '10:00'], ['10:00', '10:30'], ['10:30', '11:00'],
  ['11:00', '11:30'], ['11:30', '12:00'], ['13:00', '13:30'], ['13:30', '14:00'],
  ['14:00', '14:30'], ['14:30', '15:00'], ['15:00', '15:30'], ['15:30', '16:00'],
  ['16:00', '16:30'], ['16:30', '17:00'],
] as const;

const unavailableByRoomAndDate: Record<string, readonly string[]> = {
  'atlas:2026-10-19': ['09:30', '10:00', '14:00', '14:30'],
  'atlas:2026-10-20': ['11:00', '11:30', '15:30'],
  'harbor:2026-10-19': ['09:00', '09:30', '13:00', '13:30', '16:00'],
  'harbor:2026-10-21': ['10:00', '10:30', '14:30', '15:00'],
  'orchid:2026-10-19': ['11:00', '11:30', '15:00'],
  'orchid:2026-10-22': ['09:00', '09:30', '10:00', '10:30'],
  'summit:2026-10-19': ['10:00', '10:30', '11:00', '13:00', '13:30', '14:00'],
  'summit:2026-10-23': ['09:30', '10:00', '15:00', '15:30'],
};

const fullDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const compactDateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });

function parseRoomDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatRoomDate(value: string) {
  return fullDateFormatter.format(parseRoomDate(value));
}

export function formatRoomCompactDate(value: string) {
  return compactDateFormatter.format(parseRoomDate(value));
}

export function formatRoomWeekday(value: string) {
  return weekdayFormatter.format(parseRoomDate(value));
}

export function isRoomFixtureDate(value: string): value is RoomFixtureDate {
  return roomFixtureDates.includes(value as RoomFixtureDate);
}

export function getRoomById(roomId: RoomId) {
  return rooms.find((room) => room.id === roomId) ?? null;
}

export function getRoomSlots(roomId: RoomId, date: string, bookings: readonly RoomBooking[]): readonly RoomSlot[] {
  const unavailableStarts = unavailableByRoomAndDate[`${roomId}:${date}`] ?? [];

  return baseSlots.map(([startTime, endTime]) => ({
    startTime,
    endTime,
    status: bookings.some((booking) => booking.roomId === roomId && booking.date === date && booking.startTime === startTime) ? 'booked' : unavailableStarts.includes(startTime) ? 'unavailable' : 'available',
  }));
}

export function getAvailableSlotCount(roomId: RoomId, date: string, bookings: readonly RoomBooking[]) {
  return getRoomSlots(roomId, date, bookings).filter((slot) => slot.status === 'available').length;
}

export function validateRoomBookingDraft(draft: RoomBookingDraft) {
  const purpose = draft.purpose.trim();

  if (purpose.length < 3) {
    return 'Add a short meeting purpose with at least three characters.';
  }

  if (purpose.length > 120) {
    return 'Keep the meeting purpose to 120 characters or fewer.';
  }

  return null;
}