import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

/** A button that looks like a real button; white text on purple. */
export const PrimaryButton: FC<
  PropsWithChildren<{ id?: string; onClick?: (e: React.MouseEvent) => void }>
> = ({ id, children, onClick }) => (
  <button
    id={id}
    className={clsx(
      'w-full',
      'text-base',
      'leading-7',
      'p-2',
      'bg-purple-500',
      'border-purple-500',
      'border',
      'text-white',
      'rounded',
      'font-semibold',
      'hover:bg-[--rewiring-purple-darker]',
      'focus:bg-[--rewiring-purple-darker]',
      'outline-0',
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

/** A button that looks like a link; no border or background. */
export const TextButton: FC<
  PropsWithChildren<{
    extraClasses?: string[];
    type?: 'submit' | 'reset' | 'button';
    onClick?: (e: React.MouseEvent) => void;
  }>
> = ({ children, extraClasses, type, onClick }) => (
  <button
    className={clsx(
      'text-purple-500',
      'text-base',
      'font-medium',
      'leading-tight',
      'hover:underline',
      ...(extraClasses ?? []),
    )}
    onClick={onClick}
    type={type ?? 'button'}
  >
    {children}
  </button>
);
