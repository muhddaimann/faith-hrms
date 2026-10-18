import { useRouter } from 'expo-router';

import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { LongList } from '../../../../src/components/shared/longList';
import { BottomBar } from '../../../../src/components/tabs/bottomBar';

export default function HomeDemoScreen() {
  const router = useRouter();

  return (
    <>
      <AppScreen eyebrow="HOME / DEMO" onBack={() => router.replace('/home')} subtitle="This full-screen placeholder intentionally hides the tab pill." title="Home demo">
        <EmptyState description="The generic demo route remains available for later product modules." title="No module selected" />
        <LongList label="Nested Home item" />
      </AppScreen>
      <BottomBar />
    </>
  );
}