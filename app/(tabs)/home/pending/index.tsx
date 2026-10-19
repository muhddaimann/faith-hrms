import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { PendingItemRow } from '../../../../src/components/pending/pendingItemRow';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { pendingItems, type PendingItem } from '../../../../src/constants/pending';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function PendingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const actionItems = pendingItems.filter((item) => item.statusLabel === 'Needs review');
  const upcomingItems = pendingItems.filter((item) => item.statusLabel !== 'Needs review');

  return (
    <AppScreen eyebrow="LOCAL REMINDERS" onBack={() => router.replace('/home')} subtitle="A clear view of local reminders and workplace milestones." title="Pending & upcoming">
      <View style={{ gap: theme.spacing.lg }}>
        <Section count={actionItems.length} title="Needs review">
          {actionItems.map((item) => <PendingItemRow item={item} key={item.id} onPress={getPendingNavigationHandler(item, router.push)} />)}
        </Section>
        <Section count={upcomingItems.length} title="Coming up">
          {upcomingItems.map((item) => <PendingItemRow item={item} key={item.id} onPress={getPendingNavigationHandler(item, router.push)} />)}
        </Section>
      </View>
    </AppScreen>
  );
}

function getPendingNavigationHandler(item: PendingItem, navigate: ReturnType<typeof useRouter>['push']) {
  const route = item.route;

  return route ? () => navigate(route) : undefined;
}

function Section({ children, count, title }: { children: React.ReactNode; count: number; title: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text accessibilityLabel={`${title}, ${count} item${count === 1 ? '' : 's'}`} style={{ ...theme.typography.title, fontSize: 20, lineHeight: 28, color: theme.colors.text }}>{title} · {count}</Text>
      <View style={{ gap: theme.spacing.md }}>{children}</View>
    </View>
  );
}