import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider } from '../src/contexts/themeContext';
import { OverlayProvider } from '../src/contexts/overlayProvider';
import { OverlayHost } from '../src/components/overlay/overlayHost';
import { useTheme } from '../src/hooks/useTheme';
import { useOverlay } from '../src/hooks/useOverlay';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OverlayProvider>
          {(hostState) => <RootShell fontsLoaded={fontsLoaded} hostState={hostState} />}
        </OverlayProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootShell({ fontsLoaded, hostState }: { fontsLoaded: boolean; hostState: Parameters<typeof OverlayHost>[0] }) {
  const { mode, theme } = useTheme();
  const { active } = useOverlay();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={active || mode === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {fontsLoaded ? (
          <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        )}
      </SafeAreaView>
      <OverlayHost {...hostState} />
    </View>
  );
}