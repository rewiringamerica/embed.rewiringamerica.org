import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

/** A button that looks like a real button; white text on purple. */
export const PrimaryButton: FC<
  PropsWithChildren<{
    id?: string;
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
  }>
> = ({ id, disabled, type, children }) => (
  <button
    id={id}
    type={type}
    disabled={disabled}
    className={clsx(
      'flex',
      'gap-2',
      'items-center',
      'justify-center',
      'w-full',
      'h-12',
      'text-base',
      'leading-7',
      'p-2',
      'bg-ra-color-background-button',
      'text-ra-color-text-button',
      'rounded',
      'font-semibold',
      'disabled:text-color-state-disabled',
      'disabled:bg-color-state-disabled-on-dark',
      'hover:enabled:bg-gradient-to-r',
      'hover:enabled:from-color-shadow-primary/25 hover:from-0%',
      'hover:enabled:via-color-shadow-primary/25 hover:via-100%',
      'active:enabled:bg-gradient-to-r',
      'active:enabled:from-white/25 active:from-0%',
      'active:enabled:via-white/25 active:via-100%',
      'focus-visible:ring-2',
      'focus-visible:ring-white',
      'focus-visible:bg-gradient-to-r',
      'focus-visible:from-color-shadow-primary/25 focus-visible:from-0%',
      'focus-visible:via-color-shadow-primary/25 focus-visible:via-100%',
    )}
  >
    {children}
  </button>
);

/** A button that looks like a link; no border or background. */
export const TextButton: FC<
  PropsWithChildren<{
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
    onClick?: (e: React.MouseEvent) => void;
  }>
> = ({ children, disabled, type, onClick }) => (
  <button
    type={type}
    className={clsx(
      'text-ra-color-text-link',
      'disabled:text-color-state-disabled',
      'text-base',
      'font-medium',
      'leading-tight',
      'hover:underline',
      'disabled:no-underline',
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
