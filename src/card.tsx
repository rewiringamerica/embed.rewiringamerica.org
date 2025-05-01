import { PropsWithChildren, forwardRef } from 'react';

import clsx from 'clsx';

/**
 * Renders a padded card with white background and drop shadow. "isFlat" uses
 * no shadow instead. Children are placed in a 1-column grid.
 */
export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    id?: string;
    isFlat?: boolean;
    padding: 'small' | 'medium' | 'large';
    theme?: 'white' | 'grey';
  }>
>(({ children, id, isFlat, padding, theme }, ref) => (
  <div
    ref={ref}
    id={id}
    className={clsx(
      'rounded-xl min-w-52 border border-grey-200',
      theme === 'grey' && 'bg-[#efefef]',
      (!theme || theme === 'white') && 'bg-white',
      isFlat ? 'shadow-none' : 'shadow',
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
