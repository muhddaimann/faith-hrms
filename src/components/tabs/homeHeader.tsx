import { Text, View } from 'react-native';

import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';

export function HomeHeader() {
  const { theme } = useTheme();
  const { profile } = useProfile();

  return (
    <View style={{ gap: theme.spacing.xxs, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Good to see you,</Text>
      <Text style={{ ...theme.typography.title, fontSize: 24, lineHeight: 30, letterSpacing: -0.5, color: theme.colors.text }}>{profile.preferredName}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{profile.jobTitle} · {profile.department}</Text>
    </View>
  );
}
