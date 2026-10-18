import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { createProfileDraft, profileFieldMetadata, type EmployeeProfile, type ProfileDraft } from '../../constants/profile';
import { useTheme } from '../../hooks/useTheme';

type ProfileEditFormProps = {
  onCancel: () => void;
  onSave: (draft: ProfileDraft) => void;
  profile: EmployeeProfile;
};

export function ProfileEditForm({ onCancel, onSave, profile }: ProfileEditFormProps) {
  const { theme } = useTheme();
  const [draft, setDraft] = useState<ProfileDraft>(() => createProfileDraft(profile));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Edit profile</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Update the contact details you manage in this local session.</Text>
        </View>

        <ProfileInput field="preferredName" onChangeText={(value) => setDraft((current) => ({ ...current, preferredName: value }))} value={draft.preferredName} />
        <ProfileInput field="workPhone" onChangeText={(value) => setDraft((current) => ({ ...current, workPhone: value }))} value={draft.workPhone} />
        <ProfileInput field="workLocation" onChangeText={(value) => setDraft((current) => ({ ...current, workLocation: value }))} value={draft.workLocation} />

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Pressable accessibilityLabel="Cancel profile editing" accessibilityRole="button" onPress={onCancel} style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Cancel</Text>
          </Pressable>
          <Pressable accessibilityLabel="Save profile changes" accessibilityRole="button" onPress={() => onSave(draft)} style={({ pressed }) => ({ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}>
            <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProfileInput({ field, onChangeText, value }: { field: keyof typeof profileFieldMetadata; onChangeText: (value: string) => void; value: string }) {
  const { theme } = useTheme();
  const metadata = profileFieldMetadata[field];

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{metadata.label}</Text>
      <TextInput
        accessibilityLabel={metadata.label}
        autoCapitalize={field === 'workLocation' ? 'words' : 'none'}
        autoComplete={metadata.autoComplete}
        keyboardType={'keyboardType' in metadata ? metadata.keyboardType : 'default'}
        onChangeText={onChangeText}
        placeholder={metadata.placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={{ minHeight: 52, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, paddingHorizontal: theme.spacing.md, ...theme.typography.body }}
        textContentType={metadata.textContentType}
        value={value}
      />
    </View>
  );
}