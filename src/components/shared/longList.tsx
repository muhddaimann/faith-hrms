import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export function LongList({ label = 'Sample activity', length = 12 }: { label?: string; length?: number }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {Array.from({ length }, (_, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.md }}>
          <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primarySoft }}>
            <Text style={{ ...theme.typography.label, color: theme.colors.primary }}>{index + 1}</Text>
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{label} {index + 1}</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Scrollable specimen for floating-control behavior.</Text>
          </View>
        </View>
      ))}
    </View>
  );
}