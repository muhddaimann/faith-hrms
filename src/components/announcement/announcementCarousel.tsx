import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import type { AnnouncementItem } from '../../constants/announcement';
import { announcementProgress, fadeIn, fadeOut } from '../../helpers/animate';
import { useTheme } from '../../hooks/useTheme';

type AnnouncementCarouselProps = {
  items: readonly AnnouncementItem[];
  onPressAnnouncement: (item: AnnouncementItem) => void;
};

const announcementIntervalMs = 3000;

export function AnnouncementCarousel({ items, onPressAnnouncement }: AnnouncementCarouselProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const activeItem = items[activeIndex];

  useEffect(() => {
    if (items.length < 2) {
      return undefined;
    }

    progress.setValue(0);
    progressAnimation.current?.stop();
    progressAnimation.current = announcementProgress(progress, announcementIntervalMs);
    progressAnimation.current.start();
    timer.current = setTimeout(() => {
      fadeOut(contentOpacity).start(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
        contentOpacity.setValue(0);
        fadeIn(contentOpacity).start();
      });
    }, announcementIntervalMs);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      progressAnimation.current?.stop();
    };
  }, [activeIndex, contentOpacity, items.length, progress]);

  if (!activeItem) {
    return null;
  }

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Pressable
      accessibilityHint="Opens the full announcement."
      accessibilityLabel={`${activeItem.title}. ${activeItem.summary}. Announcement ${activeIndex + 1} of ${items.length}.`}
      accessibilityRole="button"
      onPress={() => onPressAnnouncement(activeItem)}
      style={({ pressed }) => ({ minHeight: 156, borderRadius: theme.radius.xl, opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.card })}
    >
      <View style={{ minHeight: 156, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg }}>
        <Animated.View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, opacity: contentOpacity }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.eyebrow, color: theme.colors[activeItem.tone] }}>{activeItem.eyebrow}</Text>
            <Text numberOfLines={2} style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{activeItem.title}</Text>
            <Text numberOfLines={2} style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{activeItem.summary}</Text>
          </View>
          <View style={{ width: '30%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: theme.colors[`${activeItem.tone}Soft` as const] }}>
            <Ionicons color={theme.colors[activeItem.tone]} name={activeItem.icon} size={48} />
          </View>
        </Animated.View>
        <View accessibilityLabel={`Announcement ${activeIndex + 1} of ${items.length}. Changes automatically every 3 seconds.`} accessibilityRole="summary" style={{ marginTop: theme.spacing.md }}>
          <View style={{ height: 4, overflow: 'hidden', borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceMuted }}>
            <Animated.View style={{ width: progressWidth, height: '100%', borderRadius: theme.radius.pill, backgroundColor: theme.colors[activeItem.tone] }} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}