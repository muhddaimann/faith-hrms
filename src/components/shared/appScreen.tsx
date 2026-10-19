import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, Text, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { usePathname } from 'expo-router';

import { layout } from '../../constants/layout';
import { pressScale, screenEnter, screenExit } from '../../helpers/animate';
import { useBar } from '../../hooks/useBar';
import { useTheme } from '../../hooks/useTheme';

type AppScreenProps = {
  children: ReactNode;
  eyebrow?: string;
  onBack?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  reserveFloatingControls?: boolean;
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
};

export function AppScreen({ children, eyebrow, onBack, onRefresh, refreshing = false, reserveFloatingControls = false, rightSlot, subtitle, title }: AppScreenProps) {
  const { theme } = useTheme();
  const { completeScrollToTop, register, scrollToTopRequest, setScrollOffset, unregister } = useBar();
  const pathname = usePathname();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const translateY = useRef(new Animated.Value(8)).current;
  const backScale = useRef(new Animated.Value(1)).current;
  const latestOffset = useRef(0);
  const scrollToTopFallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollToTopAnimationFrame = useRef<number | null>(null);

  useEffect(() => {
    register(pathname);
    screenEnter(translateY).start();

    return () => {
      if (scrollToTopFallback.current) {
        clearTimeout(scrollToTopFallback.current);
      }
      if (scrollToTopAnimationFrame.current) {
        cancelAnimationFrame(scrollToTopAnimationFrame.current);
      }
      screenExit(translateY).start();
      unregister(pathname);
    };
  }, [pathname, register, translateY, unregister]);

  useEffect(() => {
    if (scrollToTopRequest?.route !== pathname) {
      return;
    }

    scrollToTopAnimationFrame.current = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      scrollToTopAnimationFrame.current = null;
    });

    scrollToTopFallback.current = setTimeout(() => {
      if (latestOffset.current <= 1) {
        completeScrollToTop(pathname, scrollToTopRequest.id);
      }
    }, 700);

    return () => {
      if (scrollToTopAnimationFrame.current) {
        cancelAnimationFrame(scrollToTopAnimationFrame.current);
        scrollToTopAnimationFrame.current = null;
      }
      if (scrollToTopFallback.current) {
        clearTimeout(scrollToTopFallback.current);
        scrollToTopFallback.current = null;
      }
    };
  }, [completeScrollToTop, pathname, scrollToTopRequest]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    latestOffset.current = offset;
    setScrollOffset(pathname, offset);

    if (scrollToTopRequest?.route === pathname && offset <= 1) {
      completeScrollToTop(pathname, scrollToTopRequest.id);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: reserveFloatingControls ? layout.floatingStageHeight + theme.spacing.xxxl : theme.spacing.xxl, gap: theme.spacing.lg }}
          decelerationRate="normal"
          onScroll={handleScroll}
          refreshControl={onRefresh ? <RefreshControl colors={[theme.colors.primary]} onRefresh={onRefresh} progressBackgroundColor={theme.colors.surface} refreshing={refreshing} tintColor={theme.colors.primary} /> : undefined}
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
            {onBack ? (
              <View style={{ flexShrink: 0, paddingTop: eyebrow ? 20 : 0 }}>
                <Animated.View style={{ transform: [{ scale: backScale }] }}>
                  <Pressable
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    onPress={onBack}
                    onPressIn={() => pressScale(backScale, 0.94).start()}
                    onPressOut={() => pressScale(backScale, 1).start()}
                    style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface })}
                  >
                    <Ionicons color={theme.colors.icon} name="chevron-back" size={24} />
                  </Pressable>
                </Animated.View>
              </View>
            ) : null}
            <View style={{ flex: 1, minWidth: 0, gap: theme.spacing.xs }}>
              {eyebrow ? <Text style={{ ...theme.typography.eyebrow, color: theme.colors.primary }}>{eyebrow}</Text> : null}
              <Text accessibilityRole="header" style={{ ...theme.typography.title, fontSize: 24, lineHeight: 30, letterSpacing: -0.5, color: theme.colors.text }}>{title}</Text>
              {subtitle ? <Text style={{ ...theme.typography.body, fontSize: 14, lineHeight: 20, color: theme.colors.textSecondary }}>{subtitle}</Text> : null}
            </View>
            {rightSlot ? (
              <View style={{ flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
                {rightSlot}
              </View>
            ) : null}
          </View>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}