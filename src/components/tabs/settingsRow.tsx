import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { TintedSurface } from '../shared/tintedSurface';
import type { ModuleIcon, ModuleTone } from '../../constants/modules';
import { useTheme } from '../../hooks/useTheme';

type SettingsRowProps = {
  accessibilityLabel: string;
  detail?: string;
  icon: ModuleIcon;
  onPress: () => void;
  title: string;
  tone?: ModuleTone;
};

export function SettingsRow({ accessibilityLabel, detail, icon, onPress, title, tone }: SettingsRowProps) {
  const { theme } = useTheme();
  const accent = tone ? theme.colors[tone] : theme.colors.icon;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ borderRadius: theme.radius.xl, opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card })}
    >
      <TintedSurface contentStyle={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg }} tone={tone}>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{title}</Text>
          {detail ? <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{detail}</Text> : null}
        </View>
        <Ionicons color={accent} name={icon} size={30} />
      </TintedSurface>
    </Pressable>
  );
}
