import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { ScrollView, Text, View } from 'react-native';

import { ThemeToggle } from '../src/components/theme/themeToggle';
import { about } from '../src/constants/about';
import { themes } from '../src/constants/theme';
import { useTheme } from '../src/hooks/useTheme';

type ColorName = keyof (typeof themes)['light']['colors'];
type TypographyName = keyof (typeof themes)['light']['typography'];
type FontFamilyName = keyof (typeof themes)['light']['fontFamily'];
type SpacingName = keyof (typeof themes)['light']['spacing'];
type RadiusName = keyof (typeof themes)['light']['radius'];
type OpacityName = keyof (typeof themes)['light']['opacity'];
type ShadowName = keyof (typeof themes)['light']['shadow'];

const colorNames = Object.keys(themes.light.colors) as ColorName[];
const typographyNames = Object.keys(themes.light.typography) as TypographyName[];
const fontFamilyNames = Object.keys(themes.light.fontFamily) as FontFamilyName[];
const spacingNames = Object.keys(themes.light.spacing) as SpacingName[];
const radiusNames = Object.keys(themes.light.radius) as RadiusName[];
const opacityNames = Object.keys(themes.light.opacity) as OpacityName[];
const shadowNames = Object.keys(themes.light.shadow) as ShadowName[];

export default function LandingScreen() {
  const { mode, selectedMode, theme } = useTheme();
  const cardStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  };
  const tokenNameStyle = { ...theme.typography.label, color: theme.colors.text };
  const tokenValueStyle = { ...theme.typography.body, color: theme.colors.textSecondary };
  const sectionTitleStyle = { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.md };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
        gap: theme.spacing.xxl,
      }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>THEME FOUNDATION</Text>
            <Text style={{ ...theme.typography.display, color: theme.colors.text }}>{about.appName}</Text>
            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.textSecondary }}>{about.appAbout}</Text>
          </View>
          <ThemeToggle />
        </View>

        <View style={{ ...cardStyle, gap: theme.spacing.sm, backgroundColor: theme.colors.surfaceAccent }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Ionicons color={theme.colors.icon} name="color-palette-outline" size={22} />
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Active theme</Text>
          </View>
          <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{mode}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>
            {selectedMode === null
              ? 'Following the device appearance for this session.'
              : 'Using a session-only manual selection. Restart to follow the device again.'}
          </Text>
          <Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>Version {about.version}</Text>
        </View>
      </View>

      <TokenSection title="Semantic colors" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.sm }}>
          {colorNames.map((name) => (
            <View key={name} style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderWidth: 1,
                  borderColor: theme.colors.borderStrong,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors[name],
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={tokenNameStyle}>colors.{name}</Text>
                <Text style={tokenValueStyle}>{theme.colors[name]}</Text>
              </View>
            </View>
          ))}
        </View>
      </TokenSection>

      <TokenSection title="Typography" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.sm }}>
          {typographyNames.map((name) => {
            const value = theme.typography[name];

            return (
              <View key={name} style={{ ...cardStyle, gap: theme.spacing.xs }}>
                <Text style={tokenNameStyle}>typography.{name}</Text>
                <Text style={{ ...value, color: theme.colors.text }}>Faith HRMS specimen</Text>
                <Text style={tokenValueStyle}>{value.fontSize}px · {value.lineHeight}px · {value.fontFamily}</Text>
              </View>
            );
          })}
        </View>
      </TokenSection>

      <TokenSection title="Font families" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.sm }}>
          {fontFamilyNames.map((name) => (
            <View key={name} style={{ ...cardStyle, gap: theme.spacing.xs }}>
              <Text style={tokenNameStyle}>fontFamily.{name}</Text>
              <Text style={{ fontFamily: theme.fontFamily[name], fontSize: 18, lineHeight: 26, color: theme.colors.text }}>
                Faith in every workday
              </Text>
              <Text style={tokenValueStyle}>{theme.fontFamily[name]}</Text>
            </View>
          ))}
        </View>
      </TokenSection>

      <TokenSection title="Spacing" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.sm }}>
          {spacingNames.map((name) => {
            const value = theme.spacing[name];

            return (
              <View key={name} style={{ ...cardStyle, gap: theme.spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}>
                  <Text style={tokenNameStyle}>spacing.{name}</Text>
                  <Text style={tokenValueStyle}>{value}px</Text>
                </View>
                <View style={{ height: 12, width: Math.max(value, 4), borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary }} />
              </View>
            );
          })}
        </View>
      </TokenSection>

      <TokenSection title="Radii" titleStyle={sectionTitleStyle}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {radiusNames.map((name) => (
            <View key={name} style={{ ...cardStyle, width: '47%', gap: theme.spacing.sm }}>
              <View style={{ height: 56, borderRadius: theme.radius[name], backgroundColor: theme.colors.primarySoft }} />
              <Text style={tokenNameStyle}>radius.{name}</Text>
              <Text style={tokenValueStyle}>{theme.radius[name]}px</Text>
            </View>
          ))}
        </View>
      </TokenSection>

      <TokenSection title="Opacity states" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.sm }}>
          {opacityNames.map((name) => (
            <View key={name} style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <View style={{ width: 48, height: 48, borderRadius: theme.radius.md, backgroundColor: theme.colors.primary, opacity: theme.opacity[name] }} />
              <View style={{ flex: 1 }}>
                <Text style={tokenNameStyle}>opacity.{name}</Text>
                <Text style={tokenValueStyle}>{theme.opacity[name]}</Text>
              </View>
            </View>
          ))}
        </View>
      </TokenSection>

      <TokenSection title="Shadow and elevation" titleStyle={sectionTitleStyle}>
        <View style={{ gap: theme.spacing.lg, padding: theme.spacing.sm }}>
          {shadowNames.map((name) => (
            <View key={name} style={{ borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow[name] }}>
              <Text style={tokenNameStyle}>shadow.{name}</Text>
              <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs, color: theme.colors.textSecondary }}>
                {name === 'card' ? 'Subtle surface elevation.' : 'Prominent floating elevation.'}
              </Text>
            </View>
          ))}
        </View>
      </TokenSection>

      <TokenSection title="Focus treatment" titleStyle={sectionTitleStyle}>
        <View style={{ ...cardStyle, gap: theme.spacing.sm }}>
          <View style={{ borderWidth: 3, borderColor: theme.colors.focus, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.label, color: theme.colors.text }}>Focus-ring specimen</Text>
          </View>
          <Text style={tokenValueStyle}>colors.focus · {theme.colors.focus} · 3px outline</Text>
        </View>
      </TokenSection>
    </ScrollView>
  );
}

function TokenSection({ children, title, titleStyle }: { children: ReactNode; title: string; titleStyle: StyleProp<TextStyle> }) {
  return (
    <View>
      <Text style={titleStyle}>{title}</Text>
      {children}
    </View>
  );
}