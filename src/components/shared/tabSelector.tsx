import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export type TabSelectorTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type TabSelectorItem<T extends string> = {
  accessibilityLabel?: string;
  label: string;
  tone?: TabSelectorTone;
  value: T;
};

export function TabSelector<T extends string>({ accessibilityLabel, items, onSelect, selectedValue }: { accessibilityLabel?: string; items: readonly TabSelectorItem<T>[]; onSelect: (value: T) => void; selectedValue: T }) {
  const { theme } = useTheme();

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="tablist" style={{ flexDirection: 'row', gap: theme.spacing.xs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.xs }}>
      {items.map((item) => {
        const selected = item.value === selectedValue;
        const selectedColor = item.tone ? theme.colors[item.tone] : theme.colors.primary;

        return (
          <Pressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={item.value}
            onPress={() => onSelect(item.value)}
            style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: selected ? selectedColor : 'transparent', opacity: pressed && !selected ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.xs })}
          >
            <Text numberOfLines={1} style={{ ...theme.typography.label, color: selected ? theme.colors.textInverse : theme.colors.textSecondary }}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}