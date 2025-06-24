import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

/** A button that looks like a real button; white text on purple. */
export const PrimaryButton: FC<
  PropsWithChildren<{ id?: string; disabled?: boolean }>
> = ({ id, disabled, children }) => (
  <button
    id={id}
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
      'active:bg-gradient-to-r',
      'active:from-white/25 active:from-0%',
      'active:via-white/25 active:via-100%',
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
    onClick?: (e: React.MouseEvent) => void;
  }>
> = ({ children, disabled, onClick }) => (
  <button
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

/** Rendered as a button, with a border. Narrow layout only. */
export const BorderedLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'flex',
      'sm:hidden',
      'gap-2',
      'justify-center',
      'items-center',
      'self-stretch',
      'h-9',
      'px-3.5',
      'py-1.5',
      'border',
      'rounded',
      'border-grey-300',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

/** Rendered as a pseudo-link, without a border. Med and wide layouts only */
export const BorderlessLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'hidden',
      'sm:flex',
      'gap-2',
      'items-center',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
      'whitespace-nowrap',
      'hover:underline',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);
