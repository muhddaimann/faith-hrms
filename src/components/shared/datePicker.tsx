import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

type DatePickerBaseProps = {
  availableValues?: readonly string[];
  disabledValues?: readonly string[];
  initialMonth?: string;
  subtitle?: string;
  title: string;
};

type SingleDatePickerProps = DatePickerBaseProps & {
  mode: 'single';
  onSelect: (value: string) => void;
  selectedValue?: string;
};

type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range';
  onSelect: (range: { endValue: string; startValue: string }) => void;
  selectedEndValue?: string;
  selectedStartValue?: string;
};

type CalendarDay = {
  date: Date;
  value: string;
};

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const fullDateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric', timeZone: 'UTC' });
const weekdayLabels = Array.from({ length: 7 }, (_, index) => weekdayFormatter.format(new Date(Date.UTC(2026, 9, 18 + index))).slice(0, 2));

function parseCalendarValue(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatCalendarValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
}

function getCalendarDays(month: Date): readonly CalendarDay[] {
  const firstDay = startOfMonth(month);
  const gridStart = new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth(), 1 - firstDay.getUTCDay()));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(gridStart.getUTCFullYear(), gridStart.getUTCMonth(), gridStart.getUTCDate() + index));
    return { date, value: formatCalendarValue(date) };
  });
}

export function DatePicker(props: SingleDatePickerProps | RangeDatePickerProps) {
  const { theme } = useTheme();
  const initialMonth = props.initialMonth ?? (props.mode === 'single' ? props.selectedValue : props.selectedStartValue) ?? props.availableValues?.[0] ?? '2026-10-01';
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(parseCalendarValue(initialMonth)));
  const [rangeStartValue, setRangeStartValue] = useState(props.mode === 'range' ? props.selectedStartValue : undefined);
  const [rangeEndValue, setRangeEndValue] = useState(props.mode === 'range' ? props.selectedEndValue : undefined);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const availableValues = useMemo(() => new Set(props.availableValues), [props.availableValues]);
  const disabledValues = useMemo(() => new Set(props.disabledValues), [props.disabledValues]);
  const canMovePrevious = !props.availableValues || props.availableValues.some((value) => parseCalendarValue(value) < visibleMonth);
  const nextMonth = addMonths(visibleMonth, 1);
  const canMoveNext = !props.availableValues || props.availableValues.some((value) => parseCalendarValue(value) >= nextMonth);
  const selectedStartValue = props.mode === 'range' ? rangeStartValue : undefined;
  const selectedEndValue = props.mode === 'range' ? rangeEndValue : undefined;

  const isSelectable = (value: string) => !disabledValues.has(value) && (!props.availableValues || availableValues.has(value));

  const selectRangeDate = (value: string) => {
    if (props.mode !== 'range') {
      return;
    }

    if (!selectedStartValue || selectedEndValue || value < selectedStartValue) {
      setRangeStartValue(value);
      setRangeEndValue(undefined);
      return;
    }

    setRangeEndValue(value);
    props.onSelect({ startValue: selectedStartValue, endValue: value });
  };

  const rangeInstruction = selectedStartValue && !selectedEndValue ? 'Choose an end date.' : 'Choose a start date.';

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ alignSelf: 'center', width: 44, height: 4, borderRadius: theme.radius.pill, backgroundColor: theme.colors.borderStrong }} />
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{props.title}</Text>
        {props.subtitle ? <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{props.subtitle}</Text> : null}
        {props.mode === 'range' ? <Text accessibilityLiveRegion="polite" style={{ ...theme.typography.label, color: theme.colors.primary }}>{rangeInstruction}</Text> : null}
      </View>

      <View style={{ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
          <Pressable accessibilityHint="Shows the previous month." accessibilityLabel="Previous calendar month" accessibilityRole="button" accessibilityState={{ disabled: !canMovePrevious }} disabled={!canMovePrevious} onPress={() => setVisibleMonth((month) => addMonths(month, -1))} style={({ pressed }) => calendarControlStyle(theme, !canMovePrevious, pressed)}>
            <Ionicons color={theme.colors.icon} name="chevron-back" size={22} />
          </Pressable>
          <Text accessibilityRole="header" style={{ flex: 1, textAlign: 'center', ...theme.typography.bodyStrong, color: theme.colors.text }}>{monthFormatter.format(visibleMonth)}</Text>
          <Pressable accessibilityHint="Shows the next month." accessibilityLabel="Next calendar month" accessibilityRole="button" accessibilityState={{ disabled: !canMoveNext }} disabled={!canMoveNext} onPress={() => setVisibleMonth((month) => addMonths(month, 1))} style={({ pressed }) => calendarControlStyle(theme, !canMoveNext, pressed)}>
            <Ionicons color={theme.colors.icon} name="chevron-forward" size={22} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {weekdayLabels.map((label) => <Text key={label} style={{ flex: 1, textAlign: 'center', ...theme.typography.label, color: theme.colors.textMuted }}>{label}</Text>)}
        </View>

        <View accessibilityLabel={`${monthFormatter.format(visibleMonth)} calendar`} accessibilityRole={props.mode === 'single' ? 'radiogroup' : undefined} style={{ gap: theme.spacing.xxs }}>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <View key={weekIndex} style={{ flexDirection: 'row' }}>
              {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ date, value }) => {
                const inMonth = date.getUTCMonth() === visibleMonth.getUTCMonth();
                const selectable = inMonth && isSelectable(value);
                const selected = props.mode === 'single' ? props.selectedValue === value : selectedStartValue === value || selectedEndValue === value;
                const inRange = props.mode === 'range' && selectedStartValue && selectedEndValue && value > selectedStartValue && value < selectedEndValue;
                const isToday = value === '2026-10-19';
                const accessibilityHint = !selectable
                  ? 'Unavailable for selection.'
                  : props.mode === 'single'
                    ? selected ? 'Currently selected date.' : 'Selects this date.'
                    : selectedStartValue && !selectedEndValue ? 'Sets this date as the end of the range.' : 'Sets this date as the start of the range.';

                return (
                  <View key={value} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44, backgroundColor: inRange ? theme.colors.primarySoft : 'transparent' }}>
                    <Pressable
                      accessibilityHint={accessibilityHint}
                      accessibilityLabel={fullDateFormatter.format(date)}
                      accessibilityRole={props.mode === 'single' ? 'radio' : 'button'}
                      accessibilityState={{ disabled: !selectable, selected }}
                      disabled={!selectable}
                      onPress={() => props.mode === 'single' ? props.onSelect(value) : selectRangeDate(value)}
                      style={({ pressed }) => ({ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: isToday && !selected ? 1 : 0, borderColor: theme.colors.focus, borderRadius: theme.radius.pill, backgroundColor: selected ? theme.colors.primary : pressed && selectable ? theme.colors.surface : 'transparent', opacity: selectable ? pressed ? theme.opacity.pressed : 1 : theme.opacity.disabled })}
                    >
                      <Text style={{ ...theme.typography.label, color: selected ? theme.colors.textInverse : !inMonth || !selectable ? theme.colors.textMuted : theme.colors.text }}>{date.getUTCDate()}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing.sm }}>
          <Ionicons color={theme.colors.iconMuted} name="information-circle-outline" size={20} />
          <Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>{props.mode === 'single' ? 'Select an available day to continue.' : rangeInstruction}</Text>
        </View>
      </View>
    </View>
  );
}

function calendarControlStyle(theme: ReturnType<typeof useTheme>['theme'], disabled: boolean, pressed: boolean) {
  return { width: 48, height: 48, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed && !disabled ? theme.colors.surface : theme.colors.surfaceMuted, opacity: disabled ? theme.opacity.disabled : 1 };
}