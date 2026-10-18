import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export type OptionPickerItem = {
  description?: string;
  label: string;
  value: string;
};

export function OptionPicker({ mode, onSelect, options, selectedValue, title }: { mode: 'action' | 'preference'; onSelect: (value: string) => void; options: OptionPickerItem[]; selectedValue?: string; title: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{title}</Text>
      <View accessibilityRole={mode === 'preference' ? 'radiogroup' : undefined} style={{ gap: theme.spacing.sm }}>
        {options.map((option) => {
          const selected = selectedValue === option.value;
          return (
            <Pressable
              accessibilityHint={mode === 'preference' ? `Sets ${option.label} for this session.` : `Chooses ${option.label}.`}
              accessibilityLabel={option.label}
              accessibilityRole={mode === 'preference' ? 'radio' : 'button'}
              accessibilityState={mode === 'preference' ? { selected } : undefined}
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: selected ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius.md, backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1, padding: theme.spacing.md })}
            >
              <View style={{ flex: 1, gap: theme.spacing.xxs }}>
                <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{option.label}</Text>
                {option.description ? <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{option.description}</Text> : null}
              </View>
              {mode === 'preference' ? <Ionicons color={selected ? theme.colors.primary : theme.colors.iconMuted} name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} /> : <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}