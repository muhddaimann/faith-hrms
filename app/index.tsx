import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { about } from '../src/constants/about';
import { authCredentialTypes, authFeedback } from '../src/constants/auth';
import { pressScale } from '../src/helpers/animate';
import { useAuth } from '../src/hooks/useAuth';
import { useOverlay } from '../src/hooks/useOverlay';
import { useTheme } from '../src/hooks/useTheme';

export default function LandingScreen() {
  const { completeSignIn, prepareSignIn, status } = useAuth();
  const overlay = useOverlay();
  const router = useRouter();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleSignIn = async () => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      overlay.toast({
        tone: 'warning',
        title: 'Complete your sign-in details',
        message: 'Enter both your username and password to continue.',
      });
      return;
    }

    setSubmitting(true);
    const loaderId = overlay.showLoader({ label: 'Signing you in…' });
    const [didSignIn] = await Promise.all([
      prepareSignIn({ username: normalizedUsername, password }),
      new Promise<void>((resolve) => setTimeout(resolve, authFeedback.minimumLoaderDurationMs)),
    ]);
    setPassword('');

    if (!didSignIn) {
      overlay.dismiss(() => {
        setSubmitting(false);
        overlay.toast({
          tone: 'danger',
          title: 'Sign-in failed',
          message: 'Username or password is incorrect. Try the development credentials shown below.',
        });
      });
      return;
    }

    overlay.dismiss(() => {
      setSubmitting(false);
      completeSignIn();
      router.replace('/home');
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xxl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View style={{ gap: theme.spacing.xxl }}>
          <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
            <View style={{ width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.xl, backgroundColor: theme.colors.primary, ...theme.shadow.raised }}>
              <Ionicons color={theme.colors.textInverse} name="shield-checkmark-outline" size={38} />
            </View>
            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>WELCOME TO</Text>
              <Text style={{ ...theme.typography.display, color: theme.colors.text }}>{about.appName}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center' }}>{about.appAbout}</Text>
            </View>
          </View>

          <View style={{ gap: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.title, color: theme.colors.text }}>Sign in</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>Access your workplace information securely.</Text>
            </View>

            <View style={{ gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{authCredentialTypes.username.label}</Text>
              <TextInput
                accessibilityHint="Enter your Faith username."
                accessibilityLabel={authCredentialTypes.username.label}
                autoCapitalize="none"
                autoComplete={authCredentialTypes.username.autoComplete}
                onChangeText={setUsername}
                placeholder={authCredentialTypes.username.placeholder}
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="next"
                style={{ minHeight: 52, borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, color: theme.colors.text, paddingHorizontal: theme.spacing.md, ...theme.typography.body }}
                textContentType={authCredentialTypes.username.textContentType}
                value={username}
              />
            </View>

            <View style={{ gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{authCredentialTypes.password.label}</Text>
              <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted }}>
                <TextInput
                  accessibilityHint="Enter your Faith password."
                  accessibilityLabel={authCredentialTypes.password.label}
                  autoCapitalize="none"
                  autoComplete={authCredentialTypes.password.autoComplete}
                  onChangeText={setPassword}
                  onSubmitEditing={handleSignIn}
                  placeholder={authCredentialTypes.password.placeholder}
                  placeholderTextColor={theme.colors.textMuted}
                  returnKeyType="go"
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, minHeight: 52, color: theme.colors.text, paddingLeft: theme.spacing.md, ...theme.typography.body }}
                  textContentType={authCredentialTypes.password.textContentType}
                  value={password}
                />
                <Pressable
                  accessibilityHint={showPassword ? 'Hides your password.' : 'Shows your password.'}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  onPress={() => setShowPassword((current) => !current)}
                  style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? theme.opacity.pressed : 1 })}
                >
                  <Ionicons color={theme.colors.iconMuted} name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} />
                </Pressable>
              </View>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                accessibilityHint="Signs in with your username and password."
                accessibilityLabel="Sign in"
                accessibilityRole="button"
                disabled={submitting || status === 'restoring'}
                onPress={handleSignIn}
                onPressIn={() => pressScale(buttonScale, 0.98).start()}
                onPressOut={() => pressScale(buttonScale, 1).start()}
                style={({ pressed }) => ({ minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: submitting || status === 'restoring' ? theme.opacity.disabled : pressed ? theme.opacity.pressed : 1 })}
              >
                <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>{submitting ? 'Signing in…' : 'Sign in'}</Text>
              </Pressable>
            </Animated.View>

            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, borderRadius: theme.radius.md, backgroundColor: theme.colors.warningSoft, padding: theme.spacing.md }}>
              <Ionicons color={theme.colors.warning} name="information-circle-outline" size={21} />
              <Text style={{ flex: 1, ...theme.typography.body, color: theme.colors.textSecondary }}>Development-only sign in: username <Text style={{ fontFamily: theme.fontFamily.bold, color: theme.colors.text }}>user</Text> and password <Text style={{ fontFamily: theme.fontFamily.bold, color: theme.colors.text }}>123</Text>. This is not production authentication.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}