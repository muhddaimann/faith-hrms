import { Pressable, Text, View } from 'react-native';

import { attendanceViewLabels, type AttendanceView } from '../../constants/attendance';
import { useTheme } from '../../hooks/useTheme';

const views: readonly AttendanceView[] = ['daily', 'weekly', 'monthly'];

export function AttendanceViewTabs({ activeView, onSelect }: { activeView: AttendanceView; onSelect: (view: AttendanceView) => void }) {
  const { theme } = useTheme();

  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: theme.spacing.xs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.xs }}>
      {views.map((view) => {
        const selected = activeView === view;

        return (
          <Pressable
            accessibilityLabel={`${attendanceViewLabels[view]} attendance view`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={view}
            onPress={() => onSelect(view)}
            style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: selected ? theme.colors.primary : 'transparent', opacity: pressed && !selected ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.xs })}
          >
            <Text numberOfLines={1} style={{ ...theme.typography.label, color: selected ? theme.colors.textInverse : theme.colors.textSecondary }}>{attendanceViewLabels[view]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}