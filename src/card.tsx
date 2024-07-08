import { PropsWithChildren, forwardRef } from 'react';

import clsx from 'clsx';

/**
 * Renders a padded card with white background and drop shadow. "isFlat" uses
 * a yellow background and no shadow instead. Children are placed in a
 * 1-column grid.
 */
export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    id?: string;
    theme?: 'white' | 'grey';
    padding: 'small' | 'medium' | 'large';
  }>
>(({ id, theme, children, padding }, ref) => (
  <div
    ref={ref}
    id={id}
    className={clsx(
      'rounded-xl',
      'min-w-52',
      theme === 'grey' && 'bg-grey-100 border border-grey-200',
      (!theme || theme === 'white') && 'bg-white shadow',
    )}
  >
    <div
      className={clsx(
        'grid',
        'grid-cols-1',
        'gap-4',
        padding === 'large' && 'px-4 py-8',
        padding === 'medium' && 'p-4 sm:p-6',
        padding === 'small' && 'p-4',
      )}
    >
      {children}
    </div>
  </div>
));
