import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SupportEnquiryCard } from '../../../../src/components/support/supportEnquiryCard';
import { SupportEnquiryDetail } from '../../../../src/components/support/supportEnquiryDetail';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { TabSelector, type TabSelectorTone } from '../../../../src/components/shared/tabSelector';
import { supportModuleIdentity, type SupportEnquiry, type SupportEnquiryFilter } from '../../../../src/constants/support';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useSupport } from '../../../../src/hooks/useSupport';
import { useTheme } from '../../../../src/hooks/useTheme';

const supportFilters: readonly SupportEnquiryFilter[] = ['all', 'submitted', 'inReview', 'resolved'];

const supportFilterLabels: Record<SupportEnquiryFilter, string> = {
  all: 'All',
  submitted: 'Submitted',
  inReview: 'In review',
  resolved: 'Resolved',
};

const supportFilterTones: Record<SupportEnquiryFilter, TabSelectorTone> = {
  all: 'primary',
  submitted: 'info',
  inReview: 'warning',
  resolved: 'success',
};


export default function SupportRecordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { enquiries } = useSupport();
  const { bottomSheet } = useOverlay();
  const [selectedFilter, setSelectedFilter] = useState<SupportEnquiryFilter>('all');
  const records = useMemo(() => [...enquiries].sort((first, second) => second.createdAt.localeCompare(first.createdAt)).filter((enquiry) => selectedFilter === 'all' || enquiry.status === selectedFilter), [enquiries, selectedFilter]);

  const openEnquiry = (enquiry: SupportEnquiry) => {
    bottomSheet({ render: () => <SupportEnquiryDetail enquiry={enquiry} /> });
  };

  return (
    <AppScreen eyebrow="SUPPORT" onBack={() => router.replace('/settings')} rightSlot={<NewEnquiryButton onPress={() => router.push('/settings/support/apply')} />} subtitle="Report a bug or share feedback." title="Support">
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xxs, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primarySoft, padding: theme.spacing.md }}><Text style={{ ...theme.typography.label, color: theme.colors.primary }}>LOCAL SUPPORT PREVIEW</Text><Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Enquiries are fictional, reset on restart, and are not sent to a support team.</Text></View>
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.title, fontSize: 20, lineHeight: 28, color: theme.colors.text }}>Your enquiries</Text>
          <TabSelector accessibilityLabel="Support enquiry status" items={supportFilters.map((filter) => ({ accessibilityLabel: filter === 'all' ? 'All support enquiries' : `${supportFilterLabels[filter]} support enquiries`, label: supportFilterLabels[filter], tone: supportFilterTones[filter], value: filter }))} onSelect={setSelectedFilter} scrollable selectedValue={selectedFilter} />
          {records.length === 0 ? <EmptyState description={selectedFilter === 'all' ? 'New local support enquiries will appear here during this app session.' : `There are no ${selectedFilter} support enquiries during this session.`} icon={supportModuleIdentity.icon} title={selectedFilter === 'all' ? 'No support enquiries' : `No ${selectedFilter} enquiries`} /> : records.map((enquiry) => <SupportEnquiryCard enquiry={enquiry} key={enquiry.id} onPress={() => openEnquiry(enquiry)} />)}
        </View>
      </View>
    </AppScreen>
  );
}

function NewEnquiryButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return <Pressable accessibilityHint="Opens a local support enquiry form." accessibilityLabel="New support enquiry" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.md })}><Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>New</Text></Pressable>;
}
