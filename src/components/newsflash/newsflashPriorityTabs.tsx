import { Pressable, Text, View } from 'react-native';

import { newsflashPriorityMetadata, type NewsflashPriorityFilter } from '../../constants/newsflash';
import { useTheme } from '../../hooks/useTheme';

type NewsflashPriorityTabsProps = {
  onSelect: (priority: NewsflashPriorityFilter) => void;
  selectedPriority: NewsflashPriorityFilter;
};

const priorities: readonly NewsflashPriorityFilter[] = ['all', 'important', 'critical', 'normal'];

export function NewsflashPriorityTabs({ onSelect, selectedPriority }: NewsflashPriorityTabsProps) {
  const { theme } = useTheme();

  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: theme.spacing.xs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.xs }}>
      {priorities.map((priority) => {
        const selected = priority === selectedPriority;
        const metadata = priority === 'all' ? { label: 'All' } : newsflashPriorityMetadata[priority];
        const priorityColors = {
          all: { color: theme.colors.primary, soft: theme.colors.primarySoft },
          critical: { color: theme.colors.danger, soft: theme.colors.dangerSoft },
          important: { color: theme.colors.warning, soft: theme.colors.warningSoft },
          normal: { color: theme.colors.info, soft: theme.colors.infoSoft },
        }[priority];

        return (
          <Pressable
            accessibilityLabel={priority === 'all' ? 'All company updates' : `${metadata.label} priority updates`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={priority}
            onPress={() => onSelect(priority)}
            style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: selected ? priorityColors.color : 'transparent', opacity: pressed && !selected ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.xs })}
          >
            <Text numberOfLines={1} style={{ ...theme.typography.label, color: selected ? theme.colors.textInverse : theme.colors.textSecondary }}>{metadata.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}