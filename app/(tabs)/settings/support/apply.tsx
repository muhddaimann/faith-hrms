import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { SupportForm } from '../../../../src/components/support/supportForm';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { DocumentPicker } from '../../../../src/components/shared/documentPicker';
import { OptionPicker } from '../../../../src/components/shared/optionPicker';
import { supportFeedback, supportTypes, validateSupportDraft, type SupportEnquiryDraft } from '../../../../src/constants/support';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useSupport } from '../../../../src/hooks/useSupport';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function SupportApplyScreen() {
  const router = useRouter();
  const { createEnquiry } = useSupport();
  const { bottomSheet, dismiss, showLoader, toast } = useOverlay();
  const [draft, setDraft] = useState<SupportEnquiryDraft>({ subject: '', message: '' });

  const openTypePicker = () => {
    bottomSheet({ render: () => <OptionPicker mode="preference" onSelect={(value) => dismiss(() => setDraft((current) => ({ ...current, typeId: value as typeof current.typeId })))} options={supportTypes.map((type) => ({ value: type.id, label: type.label, description: type.description }))} selectedValue={draft.typeId} title="Choose enquiry type" /> });
  };

  const openDocumentPicker = () => {
    bottomSheet({
      render: () => (
        <DocumentPicker
          onSelect={(attachment) => setDraft((current) => ({ ...current, attachment }))}
          onStartPick={(pick) => dismiss(() => { void pick(); })}
          onWarning={(message) => toast({ tone: 'warning', title: 'Attachment not added', message })}
        />
      ),
    });
  };

  const submitEnquiry = () => {
    const validationMessage = validateSupportDraft(draft);
    if (validationMessage) {
      toast({ tone: 'warning', title: 'Check your enquiry', message: validationMessage });
      return;
    }
    if (!draft.typeId) return;
    const { typeId } = draft;
    showLoader({ duration: supportFeedback.submissionLoaderDurationMs, label: 'Sending your enquiry…', onComplete: () => {
      createEnquiry({ ...draft, typeId });
      toast({ tone: 'success', title: 'Support enquiry submitted', message: 'Your fictional support enquiry is listed for this app session.' });
      router.replace('/settings/support');
    } });
  };

  return <AppScreen eyebrow="SUPPORT" onBack={() => router.replace('/settings/support')} rightSlot={<SubmitButton onPress={submitEnquiry} />} subtitle="Local enquiry preview." title="New enquiry"><SupportForm draft={draft} onAddAttachment={openDocumentPicker} onOpenTypePicker={openTypePicker} onRemoveAttachment={() => setDraft((current) => ({ ...current, attachment: undefined }))} onUpdateMessage={(message) => setDraft((current) => ({ ...current, message }))} onUpdateSubject={(subject) => setDraft((current) => ({ ...current, subject }))} /></AppScreen>;
}

function SubmitButton({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return <Pressable accessibilityHint="Validates and submits this local support enquiry." accessibilityLabel="Submit local support enquiry" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1, paddingHorizontal: theme.spacing.md })}><Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Submit</Text></Pressable>;
}
