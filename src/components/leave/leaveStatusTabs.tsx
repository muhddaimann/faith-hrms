import { ScrollView } from 'react-native';

import { type LeaveApplicationFilter } from '../../constants/leave';
import { TabSelector, type TabSelectorTone } from '../shared/tabSelector';

type LeaveStatusTabsProps = {
  onSelect: (filter: LeaveApplicationFilter) => void;
  selectedFilter: LeaveApplicationFilter;
};

const filters: readonly LeaveApplicationFilter[] = ['all', 'pending', 'approved', 'cancelled', 'rejected'];

const labels: Record<LeaveApplicationFilter, string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

const tones: Record<LeaveApplicationFilter, TabSelectorTone> = {
  all: 'primary',
  pending: 'warning',
  approved: 'success',
  cancelled: 'info',
  rejected: 'danger',
};

export function LeaveStatusTabs({ onSelect, selectedFilter }: LeaveStatusTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
      <TabSelector
        accessibilityLabel="Leave application status"
        items={filters.map((filter) => ({ accessibilityLabel: filter === 'all' ? 'All leave applications' : `${labels[filter]} leave applications`, label: labels[filter], tone: tones[filter], value: filter }))}
        onSelect={onSelect}
        selectedValue={selectedFilter}
      />
    </ScrollView>
  );
}