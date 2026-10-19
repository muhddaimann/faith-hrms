import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import type { Season } from '../../constants/season';
import { useTheme } from '../../hooks/useTheme';

export function SeasonPreview({ season }: { season: Season }) {
  const { theme } = useTheme();
  const palette = season.overrides[theme.mode];

  return (
    <View accessible={false} style={{ width: 72, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xxs, borderRadius: theme.radius.md, backgroundColor: palette.primarySoft }}>
      <View style={{ width: 18, height: 18, borderRadius: theme.radius.pill, backgroundColor: palette.primary }} />
      <View style={{ width: 14, height: 14, borderRadius: theme.radius.pill, backgroundColor: palette.accent }} />
      <Ionicons color={palette.icon} name={season.icon} size={18} />
    </View>
  );
}