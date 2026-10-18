import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { pressScale } from '../../helpers/animate';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { mode, theme, toggleTheme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityHint={`Switches to ${nextMode} mode for this session.`}
        accessibilityLabel={`Switch to ${nextMode} mode`}
        accessibilityRole="switch"
        accessibilityState={{ checked: mode === 'dark' }}
        hitSlop={theme.spacing.xs}
        onPress={toggleTheme}
        onPressIn={() => pressScale(scale, 0.94).start()}
        onPressOut={() => pressScale(scale, 1).start()}
        style={({ pressed }) => ({
          width: 48, height: 48, alignItems: 'center', justifyContent: 'center',
          borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill,
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
          opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card,
        })}
      >
        <Ionicons color={theme.colors.icon} name={mode === 'light' ? 'moon-outline' : 'sunny-outline'} size={22} />
      </Pressable>
    </Animated.View>
  );
}