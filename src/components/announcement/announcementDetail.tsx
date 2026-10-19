import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import type { AnnouncementItem } from '../../constants/announcement';
import { TintedSurface } from '../shared/tintedSurface';
import { useTheme } from '../../hooks/useTheme';

export function AnnouncementDetail({ item }: { item: AnnouncementItem }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <TintedSurface contentStyle={{ minHeight: 148, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg }} tone={item.tone}>
        <View style={{ flex: 1, gap: theme.spacing.sm }}>
          <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Ionicons color={theme.colors[item.tone]} name="megaphone-outline" size={18} />
            <Text style={{ ...theme.typography.label, color: theme.colors[item.tone] }}>{item.eyebrow}</Text>
          </View>
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{item.title}</Text>
        </View>
        <View accessible={false} style={{ width: 112, height: 112, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors[item.tone] }}>
          <Ionicons color={theme.colors.textInverse} name={item.icon} size={64} />
        </View>
      </TintedSurface>
      <View style={{ gap: theme.spacing.sm }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{item.summary}</Text>
      </View>
      <View style={{ gap: theme.spacing.md }}>
        {item.body.map((paragraph) => <Text key={paragraph} style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{paragraph}</Text>)}
      </View>
      <View accessibilityLabel="Local fictional announcement" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.md }}>
        <Ionicons color={theme.colors.iconMuted} name="information-circle-outline" size={20} />
        <Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>This is local, fictional announcement content for the Faith demonstration app. It is not a production policy, payment, recruitment, or communications record.</Text>
      </View>
    </View>
  );
}