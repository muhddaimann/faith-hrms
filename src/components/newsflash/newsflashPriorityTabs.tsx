import { newsflashPriorityMetadata, type NewsflashPriorityFilter } from '../../constants/newsflash';
import { TabSelector, type TabSelectorTone } from '../shared/tabSelector';

type NewsflashPriorityTabsProps = {
  onSelect: (priority: NewsflashPriorityFilter) => void;
  selectedPriority: NewsflashPriorityFilter;
};

const priorities: readonly NewsflashPriorityFilter[] = ['all', 'important', 'critical', 'normal'];

export function NewsflashPriorityTabs({ onSelect, selectedPriority }: NewsflashPriorityTabsProps) {
  const tones: Record<NewsflashPriorityFilter, TabSelectorTone> = { all: 'primary', critical: 'danger', important: 'warning', normal: 'info' };

  return <TabSelector accessibilityLabel="Newsflash priority" items={priorities.map((priority) => ({ value: priority, label: priority === 'all' ? 'All' : newsflashPriorityMetadata[priority].label, accessibilityLabel: priority === 'all' ? 'All company updates' : `${newsflashPriorityMetadata[priority].label} priority updates`, tone: tones[priority] }))} onSelect={onSelect} selectedValue={selectedPriority} />;
}