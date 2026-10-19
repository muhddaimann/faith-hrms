import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, BackHandler, Modal, PanResponder, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { overlayLayout } from '../../constants/overlay';
import type { OverlayHostState, OverlayState, ToastState } from '../../contexts/overlayProvider';
import { dialogEnter, dialogExit, fadeIn, fadeOut, pressScale, sheetDismiss, sheetEnter, sheetSpringBack, toastEnter, toastExit } from '../../helpers/animate';
import { useTheme } from '../../hooks/useTheme';

type OverlayHostProps = OverlayHostState;

export function OverlayHost({ overlay, toast, completeOverlayAfterExit, dismissOverlay, dismissToast }: OverlayHostProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [renderedOverlay, setRenderedOverlay] = useState<OverlayState | null>(overlay);
  const [renderedToast, setRenderedToast] = useState<ToastState | null>(toast);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const dialogScale = useRef(new Animated.Value(0.96)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-12)).current;
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const [sheetHeight, setSheetHeight] = useState(0);
  const [sheetIsReady, setSheetIsReady] = useState(false);
  const sheetHeightRef = useRef(0);
  const sheetOffsetRef = useRef(0);
  const sheetHasEnteredRef = useRef(false);
  const sheetIsExitingRef = useRef(false);
  const sheetExitCompletedRef = useRef(false);
  const closingOverlay = useRef(false);
  const closingToast = useRef(false);

  useEffect(() => {
    if (overlay) {
      closingOverlay.current = false;
      setRenderedOverlay(overlay);
      sheetHasEnteredRef.current = false;
      sheetIsExitingRef.current = false;
      setSheetIsReady(false);
      setSheetHeight(0);
      sheetHeightRef.current = 0;
      sheetOffsetRef.current = 0;

      if (overlay.kind !== 'bottomSheet') {
        overlayOpacity.setValue(0);
        dialogScale.setValue(0.96);
        Animated.parallel([fadeIn(overlayOpacity), dialogEnter(dialogScale)]).start();
      }
      return;
    }

    if (sheetExitCompletedRef.current) {
      setRenderedOverlay(null);
      sheetExitCompletedRef.current = false;
      return;
    }

    if (renderedOverlay && !closingOverlay.current) {
      closingOverlay.current = true;
      Animated.parallel([fadeOut(overlayOpacity), dialogExit(dialogScale)]).start(() => {
        setRenderedOverlay(null);
        closingOverlay.current = false;
      });
    }
  }, [dialogScale, overlay, overlayOpacity, renderedOverlay, sheetTranslateY]);

  const isSheet = overlay?.kind === 'bottomSheet';
  const sheetMaxHeight = Math.max(0, height - insets.top - overlayLayout.sheetViewportInset);
  const sheetBackdropOpacity = sheetTranslateY.interpolate({
    inputRange: [0, Math.max(sheetHeight, 1)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!isSheet || sheetHeight === 0 || sheetHasEnteredRef.current || sheetIsExitingRef.current) {
      return;
    }

    sheetHasEnteredRef.current = true;
    const target = getSheetExitTarget(sheetHeight, insets.bottom, theme.spacing.xl);
    overlayOpacity.setValue(0);
    sheetTranslateY.setValue(target);
    Animated.parallel([fadeIn(overlayOpacity), sheetEnter(sheetTranslateY)]).start(({ finished }) => {
      if (finished && !sheetIsExitingRef.current) {
        sheetOffsetRef.current = 0;
        setSheetIsReady(true);
      }
    });
  }, [insets.bottom, isSheet, overlayOpacity, sheetHeight, sheetTranslateY, theme.spacing.xl]);

  useEffect(() => {
    if (toast) {
      closingToast.current = false;
      setRenderedToast(toast);
      toastOpacity.setValue(0);
      toastTranslateY.setValue(-12);
      toastEnter(toastOpacity, toastTranslateY).start();
      return;
    }

    if (renderedToast && !closingToast.current) {
      closingToast.current = true;
      toastExit(toastOpacity, toastTranslateY).start(() => {
        setRenderedToast(null);
        closingToast.current = false;
      });
    }
  }, [renderedToast, toast, toastOpacity, toastTranslateY]);

  useEffect(() => {
    if (!overlay || overlay.kind === 'loader') {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackdropDismiss(overlay, dismissOverlay);
      return true;
    });

    return () => subscription.remove();
  }, [dismissOverlay, overlay]);

  const dialogWidth = Math.min(overlayLayout.dialogPreferredWidth, width - overlayLayout.dialogHorizontalPadding * 2);

  const handleSheetDismiss = (velocity = 0) => {
    if (!renderedOverlay || renderedOverlay.kind !== 'bottomSheet' || sheetIsExitingRef.current) {
      return;
    }

    sheetIsExitingRef.current = true;
    setSheetIsReady(false);
    const target = getSheetExitTarget(sheetHeightRef.current, insets.bottom, theme.spacing.xl);
    const duration = Math.max(140, Math.min(overlayLayout.sheetExitDuration, 260 - Math.abs(velocity) * 75));
    Animated.parallel([
      sheetDismiss(sheetTranslateY, target, velocity),
      Animated.timing(overlayOpacity, { toValue: 0, duration, useNativeDriver: true }),
    ]).start(() => {
      sheetExitCompletedRef.current = true;
      completeOverlayAfterExit();
    });
  };

  const sheetPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => sheetIsReady && !sheetIsExitingRef.current,
    onStartShouldSetPanResponderCapture: () => sheetIsReady && !sheetIsExitingRef.current,
    onMoveShouldSetPanResponder: (_, gesture) => sheetIsReady && !sheetIsExitingRef.current && gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onMoveShouldSetPanResponderCapture: (_, gesture) => sheetIsReady && !sheetIsExitingRef.current && gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderGrant: () => {
      sheetTranslateY.stopAnimation((currentValue) => {
        sheetOffsetRef.current = currentValue;
      });
    },
    onPanResponderMove: (_, gesture) => {
      const maxDistance = sheetHeightRef.current || 300;
      const distance = Math.max(0, sheetOffsetRef.current + gesture.dy);
      const resistedDistance = distance > maxDistance
        ? maxDistance + (distance - maxDistance) * overlayLayout.sheetOverscrollResistance
        : distance;
      sheetTranslateY.setValue(resistedDistance);
    },
    onPanResponderRelease: (_, gesture) => {
      const finalOffset = Math.max(0, sheetOffsetRef.current + gesture.dy);
      const exceedsDistance = finalOffset >= sheetHeightRef.current * overlayLayout.sheetDragDismissRatio;
      const exceedsVelocity = gesture.vy > overlayLayout.sheetDismissVelocity;

      if (exceedsDistance || exceedsVelocity) {
        handleSheetDismiss(gesture.vy);
        return;
      }

      sheetSpringBack(sheetTranslateY, gesture.vy).start(() => {
        sheetOffsetRef.current = 0;
      });
    },
    onPanResponderTerminate: () => {
      sheetSpringBack(sheetTranslateY).start(() => {
        sheetOffsetRef.current = 0;
      });
    },
  }), [sheetIsReady, sheetTranslateY]);

  return (
    <>
      {renderedOverlay ? (
        <Modal
          animationType="none"
          onRequestClose={() => handleBackdropDismiss(renderedOverlay, dismissOverlay)}
          statusBarTranslucent
          transparent
          visible
        >
          <Animated.View style={{ flex: 1, opacity: overlayOpacity }}>
            <View style={{ flex: 1, backgroundColor: theme.colors.overlayBackdrop }}>
              {renderedOverlay.kind === 'bottomSheet' ? (
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Pressable
                    accessibilityLabel="Dismiss bottom sheet"
                    disabled={closingOverlay.current || sheetIsExitingRef.current}
                    onPress={() => handleBackdropDismiss(renderedOverlay, dismissOverlay)}
                    style={{ ...absoluteFill }}
                  />
                  <Animated.View
                    pointerEvents="auto"
                    onLayout={(event) => {
                      const nextHeight = event.nativeEvent.layout.height;
                      sheetHeightRef.current = nextHeight;
                      setSheetHeight((currentHeight) => currentHeight === nextHeight ? currentHeight : nextHeight);
                    }}
                    style={{
                      maxHeight: sheetMaxHeight,
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                      borderTopLeftRadius: theme.radius.xl,
                      borderTopRightRadius: theme.radius.xl,
                      backgroundColor: theme.colors.surface,
                      transform: [{ translateY: sheetTranslateY }],
                    }}
                  >
                    <View
                      {...sheetPanResponder.panHandlers}
                      collapsable={false}
                      needsOffscreenAlphaCompositing
                      renderToHardwareTextureAndroid
                      style={{ height: overlayLayout.sheetHandleHeight, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Animated.View style={{ opacity: sheetBackdropOpacity, width: 40, height: 4, borderRadius: theme.radius.pill, backgroundColor: theme.colors.borderStrong }} />
                    </View>
                    <ScrollView
                      bounces
                      contentContainerStyle={{ gap: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, paddingBottom: insets.bottom + overlayLayout.sheetContentBottomSpacing }}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                    >
                      {renderedOverlay.render?.()}
                    </ScrollView>
                  </Animated.View>
                </View>
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: overlayLayout.dialogHorizontalPadding }}>
                  {renderedOverlay.kind !== 'loader' ? (
                    <Pressable
                      accessibilityLabel="Dismiss dialog"
                      disabled={closingOverlay.current}
                      onPress={() => handleBackdropDismiss(renderedOverlay, dismissOverlay)}
                      style={{ ...absoluteFill }}
                    />
                  ) : null}
                  <Animated.View
                    style={{
                      width: dialogWidth,
                      borderRadius: theme.radius.xl,
                      backgroundColor: theme.colors.surface,
                      padding: theme.spacing.lg,
                      transform: [{ scale: dialogScale }],
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      ...theme.shadow.raised,
                    }}
                  >
                    <DialogContent overlay={renderedOverlay} dismissOverlay={dismissOverlay} />
                  </Animated.View>
                </View>
              )}
            </View>
          </Animated.View>
        </Modal>
      ) : null}

      {renderedToast ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: insets.top + theme.spacing.md,
            left: theme.spacing.lg,
            right: theme.spacing.lg,
            zIndex: 100,
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
          }}
        >
          <ToastContent toast={renderedToast} onPress={dismissToast} />
        </Animated.View>
      ) : null}
    </>
  );
}

function DialogContent({ overlay, dismissOverlay }: { overlay: OverlayState; dismissOverlay: (onComplete?: () => void) => void }) {
  const { theme } = useTheme();
  const primaryScale = useRef(new Animated.Value(1)).current;
  const secondaryScale = useRef(new Animated.Value(1)).current;

  if (overlay.kind === 'customModal') {
    return <>{overlay.render?.()}</>;
  }

  if (overlay.kind === 'loader') {
    return (
      <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{overlay.label ?? 'Loading…'}</Text>
      </View>
    );
  }

  const isConfirm = overlay.kind === 'confirm' || overlay.kind === 'destructiveConfirm';
  const primaryColor = overlay.kind === 'destructiveConfirm' ? theme.colors.danger : theme.colors.primary;

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{overlay.title}</Text>
        {overlay.message ? <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{overlay.message}</Text> : null}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: theme.spacing.sm }}>
        {isConfirm ? (
          <Animated.View style={{ transform: [{ scale: secondaryScale }] }}>
            <Pressable
              accessibilityLabel={overlay.cancelLabel ?? 'Cancel'}
              onPress={() => dismissOverlay(overlay.onCancel)}
              onPressIn={() => pressScale(secondaryScale, 0.97).start()}
              onPressOut={() => pressScale(secondaryScale, 1).start()}
              style={({ pressed }) => ({
                minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md,
                borderWidth: 1, borderColor: theme.colors.borderStrong, borderRadius: theme.radius.md,
                backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
              })}
            >
              <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{overlay.cancelLabel ?? 'Cancel'}</Text>
            </Pressable>
          </Animated.View>
        ) : null}
        <Animated.View style={{ transform: [{ scale: primaryScale }] }}>
          <Pressable
            accessibilityLabel={isConfirm ? overlay.confirmLabel ?? 'Confirm' : overlay.actionLabel ?? 'OK'}
            onPress={() => dismissOverlay(isConfirm ? overlay.onConfirm : overlay.onAction)}
            onPressIn={() => pressScale(primaryScale, 0.97).start()}
            onPressOut={() => pressScale(primaryScale, 1).start()}
            style={({ pressed }) => ({
              minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.md, backgroundColor: primaryColor,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Text style={{ ...theme.typography.label, color: theme.colors.textInverse }}>
              {isConfirm ? overlay.confirmLabel ?? 'Confirm' : overlay.actionLabel ?? 'OK'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function ToastContent({ onPress, toast }: { onPress: () => void; toast: ToastState }) {
  const { theme } = useTheme();
  const tone = toast.tone ?? 'info';
  const toneColors = {
    success: { color: theme.colors.success, soft: theme.colors.successSoft, icon: 'checkmark-circle-outline' as const },
    danger: { color: theme.colors.danger, soft: theme.colors.dangerSoft, icon: 'alert-circle-outline' as const },
    warning: { color: theme.colors.warning, soft: theme.colors.warningSoft, icon: 'warning-outline' as const },
    info: { color: theme.colors.info, soft: theme.colors.infoSoft, icon: 'information-circle-outline' as const },
  }[tone];

  return (
    <Pressable
      accessibilityLabel="Dismiss notification"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm,
        borderWidth: 1, borderColor: toneColors.color, borderRadius: theme.radius.lg,
        backgroundColor: toneColors.soft, padding: theme.spacing.md,
        opacity: pressed ? theme.opacity.pressed : 1, ...theme.shadow.raised,
      })}
    >
      <Ionicons color={toneColors.color} name={toneColors.icon} size={22} />
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        {toast.title ? <Text style={{ ...theme.typography.label, color: theme.colors.text }}>{toast.title}</Text> : null}
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{toast.message}</Text>
      </View>
    </Pressable>
  );
}

function handleBackdropDismiss(overlay: OverlayState, dismissOverlay: (onComplete?: () => void) => void) {
  if (overlay.kind === 'loader') {
    return;
  }

  dismissOverlay(overlay.kind === 'confirm' || overlay.kind === 'destructiveConfirm' ? overlay.onCancel : undefined);
}

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

function getSheetExitTarget(sheetHeight: number, bottomInset: number, extraSpacing: number) {
  return Math.max(sheetHeight, 280) + bottomInset + extraSpacing;
}