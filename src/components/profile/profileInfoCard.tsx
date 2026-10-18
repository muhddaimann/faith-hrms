import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export type ProfileInfoItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export function ProfileInfoCard({ items, title }: { items: ProfileInfoItem[]; title: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{title}</Text>
      <View style={{ gap: theme.spacing.md }}>
        {items.map((item, index) => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, borderTopWidth: index === 0 ? 0 : 1, borderTopColor: theme.colors.border, paddingTop: index === 0 ? 0 : theme.spacing.md }}>
            <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primarySoft }}>
              <Ionicons color={theme.colors.icon} name={item.icon} size={19} />
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text style={{ ...theme.typography.label, color: theme.colors.textSecondary }}>{item.label}</Text>
              <Text selectable style={{ ...theme.typography.body, color: theme.colors.text }}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}