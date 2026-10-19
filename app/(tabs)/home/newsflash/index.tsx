import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { NewsflashCard } from '../../../../src/components/newsflash/newsflashCard';
import { NewsflashDetail } from '../../../../src/components/newsflash/newsflashDetail';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { OptionPicker } from '../../../../src/components/shared/optionPicker';
import { TabSelector, type TabSelectorTone } from '../../../../src/components/shared/tabSelector';
import { newsflashPriorityMetadata, type NewsflashItem, type NewsflashPriorityFilter } from '../../../../src/constants/newsflash';
import { useNewsflash } from '../../../../src/hooks/useNewsflash';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useTheme } from '../../../../src/hooks/useTheme';

const newsflashPriorities: readonly NewsflashPriorityFilter[] = ['all', 'important', 'critical', 'normal'];

const newsflashPriorityTones: Record<NewsflashPriorityFilter, TabSelectorTone> = {
  all: 'primary',
  critical: 'danger',
  important: 'warning',
  normal: 'info',
};


export default function NewsflashScreen() {
  const router = useRouter();
  const { acknowledgeNewsflash, isAcknowledged, items } = useNewsflash();
  const { bottomSheet, dismiss, toast } = useOverlay();
  const { theme } = useTheme();
  const [acknowledgementFilter, setAcknowledgementFilter] = useState<'all' | 'unacknowledged'>('all');
  const [selectedPriority, setSelectedPriority] = useState<NewsflashPriorityFilter>('all');
  const filteredItems = useMemo(() => items.filter((item) => (selectedPriority === 'all' || item.priority === selectedPriority) && (acknowledgementFilter === 'all' || !isAcknowledged(item.id))), [acknowledgementFilter, isAcknowledged, items, selectedPriority]);

  const openAcknowledgementFilter = () => {
    bottomSheet({
      render: () => (
        <OptionPicker
          mode="preference"
          onSelect={(value) => {
            setAcknowledgementFilter(value as 'all' | 'unacknowledged');
            dismiss();
          }}
          options={[
            { value: 'all', label: 'All updates', description: 'Show every company update.' },
            { value: 'unacknowledged', label: 'Unacknowledged', description: 'Show only updates that still need acknowledgement.' },
          ]}
          selectedValue={acknowledgementFilter}
          title="Show updates"
        />
      ),
    });
  };

  const openNewsflash = (item: NewsflashItem) => {
    bottomSheet({
      render: () => (
        <NewsflashDetail
          acknowledged={isAcknowledged(item.id)}
          item={item}
          onAcknowledge={() => dismiss(() => {
            acknowledgeNewsflash(item.id);
            toast({ tone: 'success', title: 'Update acknowledged', message: 'This company update is marked as read for the current session.' });
          })}
        />
      ),
    });
  };

  return (
    <AppScreen eyebrow="COMPANY UPDATES" onBack={() => router.replace('/home')} rightSlot={<AcknowledgementFilterButton filter={acknowledgementFilter} onPress={openAcknowledgementFilter} />} subtitle="Important updates from Faith." title="Newsflash">
      <View style={{ gap: theme.spacing.lg }}>
        <TabSelector accessibilityLabel="Newsflash priority" items={newsflashPriorities.map((priority) => ({ accessibilityLabel: priority === 'all' ? 'All company updates' : `${newsflashPriorityMetadata[priority].label} priority updates`, label: priority === 'all' ? 'All' : newsflashPriorityMetadata[priority].label, tone: newsflashPriorityTones[priority], value: priority }))} onSelect={setSelectedPriority} scrollable selectedValue={selectedPriority} />

        {filteredItems.length === 0 ? (
          <EmptyState
            description={acknowledgementFilter === 'unacknowledged' ? `There are no unacknowledged ${selectedPriority === 'all' ? 'company' : selectedPriority} updates to review right now.` : selectedPriority === 'all' ? 'There are no company updates to review right now.' : `There are no ${selectedPriority} company updates to review right now.`}
            icon="newspaper-outline"
            title={acknowledgementFilter === 'unacknowledged' ? 'Nothing awaiting acknowledgement' : selectedPriority === 'all' ? 'No company updates' : `No ${selectedPriority} updates`}
          />
        ) : filteredItems.map((item) => <NewsflashCard acknowledged={isAcknowledged(item.id)} item={item} key={item.id} onPress={() => openNewsflash(item)} />)}
      </View>
    </AppScreen>
  );
}

function AcknowledgementFilterButton({ filter, onPress }: { filter: 'all' | 'unacknowledged'; onPress: () => void }) {
  const { theme } = useTheme();
  const isUnacknowledged = filter === 'unacknowledged';

  return (
    <Pressable
      accessibilityHint="Opens the update acknowledgement filter."
      accessibilityLabel={`Filter Newsflash: ${isUnacknowledged ? 'unacknowledged updates' : 'all updates'}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isUnacknowledged ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: isUnacknowledged ? theme.colors.primarySoft : pressed ? theme.colors.surfaceMuted : theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}
    >
      <Ionicons color={isUnacknowledged ? theme.colors.primary : theme.colors.icon} name={isUnacknowledged ? 'filter' : 'filter-outline'} size={22} />
    </Pressable>
  );
}