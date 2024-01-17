import { PropsWithChildren, forwardRef } from 'react';

import clsx from 'clsx';

/**
 * Renders a padded card with white background and drop shadow. "isFlat" uses
 * a yellow background and no shadow instead. Children are placed in a
 * 1-column grid.
 */
export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ isFlat?: boolean }>
>(({ isFlat, children }, ref) => (
  <div
    ref={ref}
    className={clsx(
      'rounded-xl',
      'overflow-clip',
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
        isFlat && 'px-4 py-8',
        !isFlat && 'p-4 sm:p-6',
      )}
    >
      {children}
    </div>
  </div>
));
