import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { moduleToneSoftToken, type ModuleTone } from '../../constants/modules';
import { useTheme } from '../../hooks/useTheme';

type TintedSurfaceProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
  tone?: ModuleTone;
};

export function TintedSurface({ children, contentStyle, radius, tone }: TintedSurfaceProps) {
  const { theme } = useTheme();
  const cornerRadius = radius ?? theme.radius.xl;

  if (!tone) {
    return (
      <View style={{ flexGrow: 1, borderRadius: cornerRadius, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, overflow: 'hidden' }}>
        <View style={contentStyle}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flexGrow: 1, borderRadius: cornerRadius, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' }}>
      <LinearGradient colors={[theme.colors.surface, theme.colors[moduleToneSoftToken[tone]]]} end={{ x: 1, y: 0.5 }} start={{ x: 0, y: 0.5 }} style={contentStyle}>
        {children}
      </LinearGradient>
    </View>
  );
}
