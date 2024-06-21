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
    isFlat?: boolean;
    padding: 'small' | 'medium' | 'large';
  }>
>(({ id, isFlat, children, padding }, ref) => (
  <div
    ref={ref}
    id={id}
    className={clsx(
      'rounded-xl',
      'min-w-52',
      isFlat && 'bg-yellow-200',
      !isFlat && 'bg-white shadow',
    )}
  >
    <div
      className={clsx(
        'grid',
        'grid-cols-1',
        'gap-4',
        isFlat && 'mx-auto text-center max-w-78',
        padding === 'large' && 'px-4 py-8',
        padding === 'medium' && 'p-4 sm:p-6',
        padding === 'small' && 'p-4',
      )}
    >
      {children}
    </div>
  </div>
));
