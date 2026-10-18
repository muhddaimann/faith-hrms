import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import type { EmployeeProfile } from '../../constants/profile';
import { useTheme } from '../../hooks/useTheme';

export function ProfileHeader({ profile }: { profile: EmployeeProfile }) {
  const { theme } = useTheme();
  const initials = profile.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View style={{ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        <View accessibilityLabel={`${profile.fullName} initials`} style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.textInverse }}>{initials}</Text>
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{profile.preferredName}</Text>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.textSecondary }}>{profile.jobTitle}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>{profile.department}</Text>
        </View>
      </View>
      <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: theme.colors.accentSoft, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
        <Ionicons color={theme.colors.accent} name="checkmark-circle-outline" size={18} />
        <Text style={{ ...theme.typography.label, color: theme.colors.accent }}>{profile.employmentType} employee</Text>
      </View>
    </View>
  );
}