import { useRouter } from 'expo-router';

import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { LongList } from '../../../../src/components/shared/longList';
import { BottomBar } from '../../../../src/components/tabs/bottomBar';

export default function SettingsDemoScreen() {
  const router = useRouter();

  return (
    <>
      <AppScreen eyebrow="SETTINGS / DEMO" onBack={() => router.replace('/settings')} subtitle="This full-screen placeholder intentionally hides the tab pill." title="Settings demo">
        <EmptyState description="The generic demo route remains available for a future settings module." title="No preference module" />
        <LongList label="Nested Settings item" />
      </AppScreen>
      <BottomBar />
    </>
  );
}