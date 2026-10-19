import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

type AttendancePeriodControlProps = {
  canMoveNext: boolean;
  canMovePrevious: boolean;
  label: string;
  onMoveNext: () => void;
  onMovePrevious: () => void;
  unit: string;
};

export function AttendancePeriodControl({ canMoveNext, canMovePrevious, label, onMoveNext, onMovePrevious, unit }: AttendancePeriodControlProps) {
  const { theme } = useTheme();
  const createButtonStyle = (disabled: boolean) => ({ width: 48, height: 48, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface, opacity: disabled ? theme.opacity.disabled : 1 });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.sm, ...theme.shadow.card }}>
      <Pressable accessibilityLabel={`Show previous attendance ${unit}`} accessibilityRole="button" disabled={!canMovePrevious} onPress={onMovePrevious} style={({ pressed }) => ({ ...createButtonStyle(!canMovePrevious), backgroundColor: pressed && canMovePrevious ? theme.colors.surfaceMuted : theme.colors.surface })}>
        <Ionicons color={theme.colors.icon} name="chevron-back" size={22} />
      </Pressable>
      <Text accessibilityRole="header" style={{ ...theme.typography.bodyStrong, flex: 1, color: theme.colors.text, textAlign: 'center' }}>{label}</Text>
      <Pressable accessibilityLabel={`Show next attendance ${unit}`} accessibilityRole="button" disabled={!canMoveNext} onPress={onMoveNext} style={({ pressed }) => ({ ...createButtonStyle(!canMoveNext), backgroundColor: pressed && canMoveNext ? theme.colors.surfaceMuted : theme.colors.surface })}>
        <Ionicons color={theme.colors.icon} name="chevron-forward" size={22} />
      </Pressable>
    </View>
  );
}