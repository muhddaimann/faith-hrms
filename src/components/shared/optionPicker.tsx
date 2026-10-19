import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import type { ModuleIcon, ModuleTone } from '../../constants/modules';
import { useTheme } from '../../hooks/useTheme';
import { TintedSurface } from './tintedSurface';

export type OptionPickerItem = {
  description?: string;
  icon?: ModuleIcon;
  label: string;
  tone?: ModuleTone;
  value: string;
};

export function OptionPicker({ mode, onSelect, options, selectedValue, title }: { mode: 'action' | 'preference'; onSelect: (value: string) => void; options: OptionPickerItem[]; selectedValue?: string; title?: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      {title ? <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{title}</Text> : null}
      <View accessibilityRole={mode === 'preference' ? 'radiogroup' : undefined} style={{ gap: theme.spacing.sm }}>
        {options.map((option) => {
          const selected = selectedValue === option.value;
          const accented = mode === 'action' && Boolean(option.tone);
          const iconColor = option.tone ? theme.colors[option.tone] : theme.colors.iconMuted;

          const trailing = mode === 'preference'
            ? <Ionicons color={selected ? theme.colors.primary : theme.colors.iconMuted} name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} />
            : option.icon
              ? <Ionicons color={iconColor} name={option.icon} size={accented ? 30 : 22} />
              : <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />;

          const content = (
            <>
              <View style={{ flex: 1, gap: theme.spacing.xxs }}>
                <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{option.label}</Text>
                {option.description ? <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{option.description}</Text> : null}
              </View>
              {trailing}
            </>
          );

          return (
            <Pressable
              accessibilityHint={mode === 'preference' ? `Sets ${option.label} for this session.` : `Chooses ${option.label}.`}
              accessibilityLabel={option.label}
              accessibilityRole={mode === 'preference' ? 'radio' : 'button'}
              accessibilityState={mode === 'preference' ? { selected } : undefined}
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => ({ minHeight: accented ? 68 : 52, borderRadius: theme.radius.md, borderWidth: accented ? 0 : 1, borderColor: selected ? theme.colors.primary : theme.colors.border, backgroundColor: accented ? 'transparent' : selected ? theme.colors.primarySoft : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}
            >
              {accented && option.tone ? (
                <TintedSurface contentStyle={{ minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.md }} radius={theme.radius.md} tone={option.tone}>
                  {content}
                </TintedSurface>
              ) : (
                <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.md }}>
                  {content}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
