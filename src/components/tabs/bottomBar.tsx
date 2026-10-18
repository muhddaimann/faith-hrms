import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';

import { pressScale } from '../../helpers/animate';
import { fadeIn, fadeOut } from '../../helpers/animate';
import { layout } from '../../constants/layout';
import { useBar } from '../../hooks/useBar';
import { useTheme } from '../../hooks/useTheme';

type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
  path: '/home' | '/settings';
};

const tabs: TabItem[] = [
  { label: 'Home', path: '/home', icon: 'home-outline', iconActive: 'home' },
  { label: 'Settings', path: '/settings', icon: 'settings-outline', iconActive: 'settings' },
];

export function BottomBar() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { hasScrolled, isReturningToTop, scrollToTop } = useBar();
  const tabOpacity = useRef(new Animated.Value(1)).current;
  const topOpacity = useRef(new Animated.Value(0)).current;
  const topScale = useRef(new Animated.Value(1)).current;
  const isRootRoute = pathname === '/home' || pathname === '/settings';
  const showTabs = isRootRoute && !hasScrolled;
  const showScrollTop = hasScrolled;

  useEffect(() => {
    if (showTabs) {
      fadeIn(tabOpacity).start();
      fadeOut(topOpacity).start();
      return;
    }

    fadeOut(tabOpacity).start();
    if (showScrollTop) {
      fadeIn(topOpacity).start();
    } else {
      fadeOut(topOpacity).start();
    }
  }, [showScrollTop, showTabs, tabOpacity, topOpacity]);

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: theme.spacing.lg, bottom: Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.md, left: theme.spacing.lg, height: layout.floatingStageHeight, justifyContent: 'flex-end' }}>
      <Animated.View
        pointerEvents={showTabs ? 'auto' : 'none'}
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          gap: theme.spacing.xs,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.xs,
          ...theme.shadow.raised,
          opacity: tabOpacity,
        }}
      >
        {tabs.map((tab) => (
          <BottomBarItem
            active={pathname === tab.path}
            key={tab.path}
            tab={tab}
            onPress={() => {
              if (pathname !== tab.path) {
                router.replace(tab.path);
              }
            }}
          />
        ))}
      </Animated.View>
      <Animated.View pointerEvents={showScrollTop ? 'auto' : 'none'} style={{ position: 'absolute', alignSelf: 'center', bottom: 0, opacity: topOpacity, transform: [{ scale: topScale }] }}>
        <Pressable
          accessibilityLabel="Scroll to top"
          accessibilityRole="button"
          disabled={isReturningToTop}
          onPress={scrollToTop}
          onPressIn={() => pressScale(topScale, 0.94).start()}
          onPressOut={() => pressScale(topScale, 1).start()}
          style={({ pressed }) => ({ width: layout.floatingControlSize, height: layout.floatingControlSize, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: isReturningToTop ? theme.opacity.muted : pressed ? theme.opacity.pressed : 1, ...theme.shadow.raised })}
        >
          <Ionicons color={theme.colors.textInverse} name="chevron-up" size={26} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function BottomBarItem({ active, onPress, tab }: { active: boolean; onPress: () => void; tab: TabItem }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityHint={active ? 'Current tab.' : `Switches to ${tab.label}.`}
        accessibilityLabel={tab.label}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        disabled={active}
        onPress={onPress}
        onPressIn={() => pressScale(scale, 0.96).start()}
        onPressOut={() => pressScale(scale, 1).start()}
        style={({ pressed }) => ({
          minWidth: 112,
          minHeight: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.xs,
          borderRadius: theme.radius.pill,
          backgroundColor: active ? theme.colors.primary : 'transparent',
          opacity: pressed && !active ? theme.opacity.pressed : 1,
          paddingHorizontal: theme.spacing.md,
        })}
      >
        <Ionicons color={active ? theme.colors.textInverse : theme.colors.iconMuted} name={active ? tab.iconActive : tab.icon} size={20} />
        <Text style={{ ...theme.typography.label, color: active ? theme.colors.textInverse : theme.colors.textSecondary }}>{tab.label}</Text>
      </Pressable>
    </Animated.View>
  );
}