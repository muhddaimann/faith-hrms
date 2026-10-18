import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../../../src/hooks/useTheme';

export default function HomeDemoScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.md }}>
        <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>HOME / DEMO</Text>
        <Text style={{ ...theme.typography.display, color: theme.colors.text }}>Home demo</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>This full-screen placeholder intentionally hides the floating tab bar.</Text>
      </View>
      <BackAction onPress={() => router.replace('/home')} />
    </View>
  );
}

function BackAction({ onPress }: { onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityLabel="Return to Home" accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : 1 })}>
      <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>Return to Home</Text>
    </Pressable>
  );
}