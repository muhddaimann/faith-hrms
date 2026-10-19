import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { LeaveForm } from '../../../../src/components/leave/leaveForm';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { DatePicker } from '../../../../src/components/shared/datePicker';
import { DocumentPicker } from '../../../../src/components/shared/documentPicker';
import { OptionPicker } from '../../../../src/components/shared/optionPicker';
import { type LeaveApplicationDraft, leaveFeedback, leaveFixtureDates, leaveTypes, validateLeaveDraft } from '../../../../src/constants/leave';
import { useLeave } from '../../../../src/hooks/useLeave';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function LeaveApplyScreen() {
  const router = useRouter();
  const { balances, createApplication } = useLeave();
  const { bottomSheet, customModal, dismiss, showLoader, toast } = useOverlay();
  const [draft, setDraft] = useState<LeaveApplicationDraft>({ reason: '' });

  const openLeaveTypePicker = () => {
    bottomSheet({ render: () => <OptionPicker mode="preference" onSelect={(value) => dismiss(() => setDraft((current) => ({ ...current, typeId: value as typeof current.typeId })))} options={leaveTypes.map((type) => ({ value: type.id, label: type.label, description: type.description }))} selectedValue={draft.typeId} title="Choose leave type" /> });
  };

  const openDatePicker = () => {
    customModal({ render: () => <DatePicker availableValues={leaveFixtureDates} initialMonth={draft.startDate ?? leaveFixtureDates[0]} mode="range" onCancel={() => dismiss()} onConfirm={({ startValue, endValue }) => dismiss(() => setDraft((current) => ({ ...current, startDate: startValue, endDate: endValue })))} selectedEndValue={draft.endDate} selectedStartValue={draft.startDate} subtitle="Choose the first and last day of your local leave request preview." title="Select leave dates" /> });
  };

  const openDocumentPicker = () => {
    bottomSheet({
      render: () => (
        <DocumentPicker
          onSelect={(attachment) => setDraft((current) => ({ ...current, attachment }))}
          onStartPick={(pick) => dismiss(() => { void pick(); })}
          onWarning={(message) => toast({ tone: 'warning', title: 'Document not added', message })}
        />
      ),
    });
  };

  const submitApplication = () => {
    const validationMessage = validateLeaveDraft(draft, balances);
    if (validationMessage) {
      toast({ tone: 'warning', title: 'Check your leave request', message: validationMessage });
      return;
    }
    if (!draft.typeId || !draft.startDate || !draft.endDate) return;
    const { typeId, startDate, endDate } = draft;
    showLoader({ duration: leaveFeedback.submissionLoaderDurationMs, label: 'Submitting leave request…', onComplete: () => {
      createApplication({ ...draft, typeId, startDate, endDate });
      toast({ tone: 'success', title: 'Leave request submitted', message: 'Your fictional leave request is pending for this app session.' });
      router.replace('/home/leave');
    } });
  };

  return <AppScreen eyebrow="LEAVE MANAGEMENT" onBack={() => router.replace('/home/leave')} rightSlot={<SubmitButton onPress={submitApplication} />} subtitle="Local request preview." title="Apply for leave"><LeaveForm balances={balances} draft={draft} onAddAttachment={openDocumentPicker} onOpenDatePicker={openDatePicker} onOpenLeaveTypePicker={openLeaveTypePicker} onRemoveAttachment={() => setDraft((current) => ({ ...current, attachment: undefined }))} onUpdateReason={(reason) => setDraft((current) => ({ ...current, reason }))} /></AppScreen>;
}

function SubmitButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return <Pressable accessibilityHint="Validates and submits this local leave application." accessibilityLabel="Submit local leave application" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.md })}><Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Submit</Text></Pressable>;
}