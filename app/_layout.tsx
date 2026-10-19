import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider } from '../src/contexts/themeContext';
import { OverlayProvider } from '../src/contexts/overlayProvider';
import { BarProvider } from '../src/contexts/barContext';
import { AuthProvider } from '../src/contexts/authContext';
import { ProfileProvider } from '../src/contexts/profileContext';
import { NewsflashProvider } from '../src/contexts/newsflashContext';
import { AttendanceProvider } from '../src/contexts/attendanceContext';
import { OverlayHost } from '../src/components/overlay/overlayHost';
import { useTheme } from '../src/hooks/useTheme';
import { useOverlay } from '../src/hooks/useOverlay';
import { authFeedback } from '../src/constants/auth';
import { useAuth } from '../src/hooks/useAuth';

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
        <AuthProvider>
          <ProfileProvider>
            <NewsflashProvider>
              <AttendanceProvider>
                <BarProvider>
                  <OverlayProvider>
                    {(hostState) => <RootShell fontsLoaded={fontsLoaded} hostState={hostState} />}
                  </OverlayProvider>
                </BarProvider>
              </AttendanceProvider>
            </NewsflashProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootShell({ fontsLoaded, hostState }: { fontsLoaded: boolean; hostState: Parameters<typeof OverlayHost>[0] }) {
  const { mode, theme } = useTheme();
  const { active } = useOverlay();
  const { completeSessionRestore, restoredSession } = useAuth();
  const { showLoader } = useOverlay();
  const router = useRouter();
  const isRestoringSession = useRef(false);

  useEffect(() => {
    if (!fontsLoaded || !restoredSession || isRestoringSession.current) {
      return;
    }

    isRestoringSession.current = true;
    showLoader({
      duration: authFeedback.minimumLoaderDurationMs,
      label: 'Restoring your session…',
      onComplete: () => {
        completeSessionRestore();
        router.replace('/home');
      },
    });
  }, [completeSessionRestore, fontsLoaded, restoredSession, router, showLoader]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={active || mode === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {fontsLoaded ? (
          <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: theme.colors.background } }} />
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