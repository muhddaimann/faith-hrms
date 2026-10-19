import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function RoomDateControl({ canMoveNext, canMovePrevious, label, onMoveNext, onMovePrevious }: { canMoveNext: boolean; canMovePrevious: boolean; label: string; onMoveNext: () => void; onMovePrevious: () => void }) {
  const { theme } = useTheme();
  const controlStyle = (disabled: boolean) => ({ width: 48, height: 48, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface, opacity: disabled ? theme.opacity.disabled : 1 });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.sm, ...theme.shadow.card }}>
      <Pressable accessibilityLabel="Show previous room booking date" accessibilityRole="button" disabled={!canMovePrevious} onPress={onMovePrevious} style={({ pressed }) => ({ ...controlStyle(!canMovePrevious), backgroundColor: pressed && canMovePrevious ? theme.colors.surfaceMuted : theme.colors.surface })}>
        <Ionicons color={theme.colors.icon} name="chevron-back" size={22} />
      </Pressable>
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <Text style={{ ...theme.typography.label, color: theme.colors.primary, textAlign: 'center' }}>SELECTED DATE</Text>
        <Text accessibilityRole="header" style={{ ...theme.typography.bodyStrong, color: theme.colors.text, textAlign: 'center' }}>{label}</Text>
      </View>
      <Pressable accessibilityLabel="Show next room booking date" accessibilityRole="button" disabled={!canMoveNext} onPress={onMoveNext} style={({ pressed }) => ({ ...controlStyle(!canMoveNext), backgroundColor: pressed && canMoveNext ? theme.colors.surfaceMuted : theme.colors.surface })}>
        <Ionicons color={theme.colors.icon} name="chevron-forward" size={22} />
      </Pressable>
    </View>
  );
}