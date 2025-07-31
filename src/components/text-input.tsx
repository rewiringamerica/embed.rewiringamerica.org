import clsx from 'clsx';
import { JSX, forwardRef } from 'react';

/**
 * This styles text/email input elements with Tailwind styles.
 *
 * Although this code is used from the old embed as well, the old embed doesn't
 * have the Tailwind base layers, so those classes have no effect. Instead the
 * styles in input.ts are in effect.
 */
export const TextInput = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements['input'] & { type: 'text' | 'email'; error?: boolean }
>((props, ref) => (
  <input
    ref={ref}
    className={clsx(
      'w-full',
      'h-12',
      'px-3',
      'pt-px',
      'rounded',
      'bg-white',
      'text-grey-700',
      'placeholder:text-grey-400',
      'border',
      'border-grey-200',
      !props.disabled && 'hover:border-grey-600',
      !!props.error && 'border-red-500',
      'outline-offset-[-1px]',
      'focus:outline',
      'focus:outline-2',
      'focus:outline-purple-500',
      props.inputMode === 'numeric' && 'tabular-nums',
    )}
    {...{ ...props, error: undefined }}
  />
));
