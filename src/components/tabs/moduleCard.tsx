import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { TintedSurface } from '../shared/tintedSurface';
import type { ModuleIcon, ModuleTone } from '../../constants/modules';
import { useTheme } from '../../hooks/useTheme';

type ModuleCardProps = {
  accessibilityLabel: string;
  detail: string;
  icon: ModuleIcon;
  metric: string;
  onPress: () => void;
  title: string;
  tone?: ModuleTone;
};

export function ModuleCard({ accessibilityLabel, detail, icon, metric, onPress, title, tone }: ModuleCardProps) {
  const { theme } = useTheme();
  const accent = tone ? theme.colors[tone] : theme.colors.icon;

  return (
    <Pressable
      accessibilityHint="Opens this module."
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ flexBasis: 150, flexGrow: 1, minWidth: 150, borderRadius: theme.radius.xl, opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card })}
    >
      <TintedSurface contentStyle={{ gap: theme.spacing.sm, padding: theme.spacing.lg }} tone={tone}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.label, flex: 1, color: theme.colors.textSecondary }}>{title}</Text>
          <Ionicons color={accent} name={icon} size={30} />
        </View>
        <Text style={{ ...theme.typography.title, fontSize: 24, lineHeight: 30, letterSpacing: -0.5, color: theme.colors.text }}>{metric}</Text>
        <Text style={{ ...theme.typography.body, fontSize: 13, lineHeight: 18, color: theme.colors.textSecondary }}>{detail}</Text>
      </TintedSurface>
    </Pressable>
  );
}
