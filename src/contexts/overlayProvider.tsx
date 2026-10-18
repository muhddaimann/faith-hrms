import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { OverlayContext, type AlertOptions, type BottomSheetOptions, type ConfirmOptions, type CustomModalOptions, type LoaderOptions, type OverlayContextValue, type ToastOptions } from './overlayContext';

export type OverlayKind = 'alert' | 'confirm' | 'destructiveConfirm' | 'customModal' | 'bottomSheet' | 'loader';

export type OverlayState = {
  kind: OverlayKind;
  title?: string;
  message?: string;
  actionLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  render?: () => ReactNode;
  label?: string;
  onAction?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  onComplete?: () => void;
  loaderId?: string;
};

export type ToastState = ToastOptions & { id: string };

export type OverlayHostState = {
  overlay: OverlayState | null;
  toast: ToastState | null;
  dismissOverlay: (onComplete?: () => void) => void;
  completeOverlayAfterExit: (onComplete?: () => void) => void;
  dismissToast: () => void;
};

type OverlayProviderProps = {
  children: (hostState: OverlayHostState) => ReactNode;
};

export function OverlayProvider({ children }: OverlayProviderProps) {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const overlayRef = useRef<OverlayState | null>(null);
  const loaderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishingOverlay = useRef(false);
  const finishingToast = useRef(false);

  const clearLoaderTimer = useCallback(() => {
    if (loaderTimer.current) {
      clearTimeout(loaderTimer.current);
      loaderTimer.current = null;
    }
  }, []);

  const clearToastTimer = useCallback(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
  }, []);

  const setCurrentOverlay = useCallback((nextOverlay: OverlayState | null) => {
    overlayRef.current = nextOverlay;
    setOverlay(nextOverlay);
  }, []);

  const completeOverlayAfterExit = useCallback((onComplete?: () => void) => {
    const currentOverlay = overlayRef.current;

    if (!currentOverlay || finishingOverlay.current) {
      return;
    }

    finishingOverlay.current = true;
    clearLoaderTimer();

    setCurrentOverlay(null);
    finishingOverlay.current = false;
    currentOverlay.onDismiss?.();
    currentOverlay.onComplete?.();
    onComplete?.();
  }, [clearLoaderTimer, setCurrentOverlay]);

  const dismissOverlay = useCallback((onComplete?: () => void) => {
    const currentOverlay = overlayRef.current;

    if (!currentOverlay || finishingOverlay.current) {
      return;
    }

    finishingOverlay.current = true;
    clearLoaderTimer();

    setTimeout(() => {
      setCurrentOverlay(null);
      finishingOverlay.current = false;
      currentOverlay.onDismiss?.();
      currentOverlay.onComplete?.();
      onComplete?.();
    }, 220);
  }, [clearLoaderTimer, setCurrentOverlay]);

  const dismissToast = useCallback(() => {
    if (!toast || finishingToast.current) {
      return;
    }

    finishingToast.current = true;
    clearToastTimer();

    setTimeout(() => {
      setToast(null);
      finishingToast.current = false;
    }, 180);
  }, [clearToastTimer, toast]);

  const openOverlay = useCallback((nextOverlay: OverlayState) => {
    clearLoaderTimer();
    finishingOverlay.current = false;
    setCurrentOverlay(nextOverlay);
  }, [clearLoaderTimer, setCurrentOverlay]);

  const alert = useCallback((options: AlertOptions) => {
    openOverlay({ kind: 'alert', actionLabel: options.actionLabel ?? 'OK', ...options });
  }, [openOverlay]);

  const confirm = useCallback((options: ConfirmOptions) => {
    openOverlay({ kind: 'confirm', confirmLabel: options.confirmLabel ?? 'Confirm', cancelLabel: options.cancelLabel ?? 'Cancel', ...options });
  }, [openOverlay]);

  const destructiveConfirm = useCallback((options: ConfirmOptions) => {
    openOverlay({ kind: 'destructiveConfirm', confirmLabel: options.confirmLabel ?? 'Delete', cancelLabel: options.cancelLabel ?? 'Cancel', ...options });
  }, [openOverlay]);

  const customModal = useCallback((options: CustomModalOptions) => {
    openOverlay({ kind: 'customModal', ...options });
  }, [openOverlay]);

  const bottomSheet = useCallback((options: BottomSheetOptions) => {
    openOverlay({ kind: 'bottomSheet', ...options });
  }, [openOverlay]);

  const showLoader = useCallback((options: LoaderOptions = {}) => {
    const loaderId = `${Date.now()}-${Math.random()}`;
    openOverlay({ kind: 'loader', loaderId, label: options.label, onComplete: options.onComplete });

    if (options.duration && options.duration > 0) {
      loaderTimer.current = setTimeout(() => dismissOverlay(), options.duration);
    }

    return loaderId;
  }, [dismissOverlay, openOverlay]);

  const hideLoader = useCallback((loaderId?: string) => {
    const currentOverlay = overlayRef.current;

    if (currentOverlay?.kind !== 'loader' || (loaderId && currentOverlay.loaderId !== loaderId)) {
      return;
    }

    dismissOverlay();
  }, [dismissOverlay]);

  const showToast = useCallback((options: ToastOptions) => {
    clearToastTimer();
    finishingToast.current = false;
    const nextToast: ToastState = { ...options, duration: options.duration ?? 3600, tone: options.tone ?? 'info', id: `${Date.now()}-${Math.random()}` };
    setToast(nextToast);
    toastTimer.current = setTimeout(() => dismissToast(), nextToast.duration);
  }, [clearToastTimer, dismissToast]);

  useEffect(() => () => {
    clearLoaderTimer();
    clearToastTimer();
  }, [clearLoaderTimer, clearToastTimer]);

  const value = useMemo<OverlayContextValue>(() => ({
    active: overlay !== null,
    alert,
    confirm,
    destructiveConfirm,
    customModal,
    bottomSheet,
    showLoader,
    hideLoader,
    toast: showToast,
    dismiss: dismissOverlay,
  }), [alert, bottomSheet, confirm, customModal, destructiveConfirm, dismissOverlay, hideLoader, overlay, showLoader, showToast]);

  return (
    <OverlayContext.Provider value={value}>
      {children({ overlay, toast, dismissOverlay, completeOverlayAfterExit, dismissToast })}
    </OverlayContext.Provider>
  );
}