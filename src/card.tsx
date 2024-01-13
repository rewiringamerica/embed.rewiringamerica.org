import { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';

/**
 * Renders a padded card with white background and drop shadow. "isFlat" uses
 * a yellow background and no shadow instead. Children are placed in a
 * 1-column grid.
 */
export const Card: FC<PropsWithChildren<{ id?: string; isFlat?: boolean }>> = ({
  id,
  isFlat,
  children,
}) => (
  <div
    id={id}
    className={clsx(
      'rounded-xl',
      'overflow-clip',
      'min-w-52',
      { shadow: !isFlat },
      isFlat ? 'bg-yellow-200' : 'bg-white',
    )}
  >
    <div
      className={clsx(
        'grid',
        'grid-cols-1',
        'gap-4',
        isFlat ? ['px-4', 'py-8'] : ['p-4', 'sm:p-6'],
        { 'mx-auto': isFlat },
        { 'text-center': isFlat },
        { 'max-w-78': isFlat },
      )}
    >
      {children}
    </div>
  </div>
);
