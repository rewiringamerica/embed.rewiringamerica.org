import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

/** A button that looks like a real button; white text on purple. */
export const PrimaryButton: FC<PropsWithChildren<{ id?: string }>> = ({
  id,
  children,
}) => (
  <button
    id={id}
    className={clsx(
      'w-full',
      'text-base',
      'leading-7',
      'p-2',
      'bg-color-background-button',
      'text-color-text-button',
      'rounded',
      'font-semibold',
      'hover:bg-gradient-to-r',
      'hover:from-color-shadow-primary/25 hover:from-0%',
      'hover:via-color-shadow-primary/25 hover:via-100%',
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
  PropsWithChildren<{ onClick?: (e: React.MouseEvent) => void }>
> = ({ children, onClick }) => (
  <button
    className="text-color-text-link text-base font-medium leading-tight hover:underline"
    onClick={onClick}
  >
    {children}
  </button>
);
