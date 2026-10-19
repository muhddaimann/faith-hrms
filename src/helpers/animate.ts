import { Animated } from 'react-native';

export const pressScale = (value: Animated.Value, toValue: number) =>
  Animated.spring(value, { toValue, useNativeDriver: true, speed: 30, bounciness: 4 });

export const fadeIn = (value: Animated.Value) =>
  Animated.timing(value, { toValue: 1, duration: 220, useNativeDriver: true });

export const fadeOut = (value: Animated.Value) =>
  Animated.timing(value, { toValue: 0, duration: 180, useNativeDriver: true });

export const screenEnter = (translateY: Animated.Value) =>
  Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 3 });

export const screenExit = (translateY: Animated.Value) =>
  Animated.timing(translateY, { toValue: 8, duration: 180, useNativeDriver: true });

export const dialogEnter = (value: Animated.Value) =>
  Animated.spring(value, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 4 });

export const dialogExit = (value: Animated.Value) =>
  Animated.timing(value, { toValue: 0.96, duration: 180, useNativeDriver: true });

export const toastEnter = (opacity: Animated.Value, translateY: Animated.Value) =>
  Animated.parallel([
    fadeIn(opacity),
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 3 }),
  ]);

export const toastExit = (opacity: Animated.Value, translateY: Animated.Value) =>
  Animated.parallel([
    fadeOut(opacity),
    Animated.timing(translateY, { toValue: -12, duration: 180, useNativeDriver: true }),
  ]);

export const announcementProgress = (value: Animated.Value, duration: number) =>
  Animated.timing(value, { toValue: 1, duration, useNativeDriver: false });

export const sheetEnter = (translateY: Animated.Value) =>
  Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 15, bounciness: 2 });

export const sheetSpringBack = (translateY: Animated.Value, velocity = 0) =>
  Animated.spring(translateY, { toValue: 0, velocity, useNativeDriver: true, speed: 17, bounciness: 3 });

export const sheetDismiss = (translateY: Animated.Value, target: number, velocity = 0) =>
  Animated.timing(translateY, {
    toValue: target,
    duration: Math.max(130, Math.min(220, 250 - Math.abs(velocity) * 70)),
    useNativeDriver: true,
  });