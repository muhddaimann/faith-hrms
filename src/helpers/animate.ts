import { Animated } from 'react-native';

export const pressScale = (value: Animated.Value, toValue: number) =>
  Animated.spring(value, { toValue, useNativeDriver: true, speed: 30, bounciness: 4 });