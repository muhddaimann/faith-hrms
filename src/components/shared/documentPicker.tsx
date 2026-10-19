import Ionicons from '@expo/vector-icons/Ionicons';
import * as ExpoDocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export type PickedDocumentMetadata = {
  fileName: string;
  mimeType?: string;
  size?: number;
  source: 'photoLibrary' | 'camera' | 'files';
};

type DocumentPickerProps = {
  onSelect: (document: PickedDocumentMetadata) => void;
  onStartPick: (pick: () => Promise<void>) => void;
  onWarning: (message: string) => void;
};

type PickerSource = {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: PickedDocumentMetadata['source'];
};

const pickerSources: readonly PickerSource[] = [
  { value: 'photoLibrary', label: 'Photo library', description: 'Choose an image from your device.', icon: 'images-outline' },
  { value: 'camera', label: 'Camera', description: 'Take a new photo of a document.', icon: 'camera-outline' },
  { value: 'files', label: 'Files', description: 'Choose a document or image file.', icon: 'folder-open-outline' },
] as const;

export function DocumentPicker({ onSelect, onStartPick, onWarning }: DocumentPickerProps) {
  const { theme } = useTheme();

  const pickSource = (source: PickedDocumentMetadata['source']) => {
    onStartPick(async () => {
      try {
        const result = source === 'photoLibrary'
          ? await pickImageFromLibrary()
          : source === 'camera'
            ? await pickImageFromCamera()
            : await pickFile();

        if (result) {
          onSelect(result);
        }
      } catch {
        onWarning('Faith could not open that source. Please try again.');
      }
    });
  };

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Add supporting document</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Choose a source. Faith keeps only the selected file details for this session and does not upload or store the file.</Text>
      </View>

      <View style={{ gap: theme.spacing.sm }}>
        {pickerSources.map((source) => (
          <Pressable
            accessibilityHint={source.description}
            accessibilityLabel={source.label}
            accessibilityRole="button"
            key={source.value}
            onPress={() => pickSource(source.value)}
            style={({ pressed }) => ({ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface, padding: theme.spacing.md, opacity: pressed ? theme.opacity.pressed : 1 })}
          >
            <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primarySoft }}>
              <Ionicons color={theme.colors.primary} name={source.icon} size={22} />
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{source.label}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{source.description}</Text>
            </View>
            <Ionicons color={theme.colors.iconMuted} name="chevron-forward" size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

async function pickImageFromLibrary(): Promise<PickedDocumentMetadata | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission was not granted.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  return {
    fileName: asset.fileName ?? `photo-${Date.now()}.${getImageExtension(asset.mimeType)}`,
    mimeType: asset.mimeType ?? undefined,
    size: asset.fileSize ?? undefined,
    source: 'photoLibrary',
  };
}

async function pickImageFromCamera(): Promise<PickedDocumentMetadata | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Camera permission was not granted.');
  }

  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  return {
    fileName: asset.fileName ?? `camera-photo-${Date.now()}.${getImageExtension(asset.mimeType)}`,
    mimeType: asset.mimeType ?? undefined,
    size: asset.fileSize ?? undefined,
    source: 'camera',
  };
}

async function pickFile(): Promise<PickedDocumentMetadata | null> {
  const result = await ExpoDocumentPicker.getDocumentAsync({ copyToCacheDirectory: false, type: '*/*' });
  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  return {
    fileName: asset.name,
    mimeType: asset.mimeType ?? undefined,
    size: asset.size ?? undefined,
    source: 'files',
  };
}

function getImageExtension(mimeType?: string | null) {
  return mimeType?.split('/')[1] || 'jpg';
}