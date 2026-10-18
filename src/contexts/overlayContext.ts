import { createContext, type ReactNode } from 'react';

export type OverlayTone = 'success' | 'danger' | 'warning' | 'info';

export type AlertOptions = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type CustomModalOptions = {
  render: () => ReactNode;
  onDismiss?: () => void;
};

export type BottomSheetOptions = {
  render: () => ReactNode;
  onDismiss?: () => void;
};

export type LoaderOptions = {
  label?: string;
  duration?: number;
  onComplete?: () => void;
};

export type ToastOptions = {
  title?: string;
  message: string;
  tone?: OverlayTone;
  duration?: number;
};

export type OverlayContextValue = {
  active: boolean;
  alert: (options: AlertOptions) => void;
  confirm: (options: ConfirmOptions) => void;
  destructiveConfirm: (options: ConfirmOptions) => void;
  customModal: (options: CustomModalOptions) => void;
  bottomSheet: (options: BottomSheetOptions) => void;
  showLoader: (options?: LoaderOptions) => string;
  hideLoader: (loaderId?: string) => void;
  toast: (options: ToastOptions) => void;
  dismiss: (onComplete?: () => void) => void;
};

export const OverlayContext = createContext<OverlayContextValue | null>(null);