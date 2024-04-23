import { PropsWithChildren, forwardRef } from 'react';

import clsx from 'clsx';

export enum CardStyle {
  NORMAL,
  HIGHLIGHTED,
  FLAT,
}

/**
 * Renders a padded card with white background and drop shadow. "isFlat" uses
 * a yellow background and no shadow instead. Children are placed in a
 * 1-column grid.
 */
export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ id?: string; cardStyle?: CardStyle }>
>(({ id, cardStyle, children }, ref) => {
  const style = cardStyle ?? CardStyle.NORMAL;
  return (
    <div
      ref={ref}
      id={id}
      className={clsx(
        'rounded-xl',
        'min-w-52',
        style === CardStyle.FLAT && 'bg-yellow-200',
        style !== CardStyle.FLAT && 'shadow',
        style === CardStyle.NORMAL && 'bg-white',
        style === CardStyle.HIGHLIGHTED &&
          'bg-yellow-100 border border-yellow-500',
      )}
    >
      <div
        className={clsx(
          'grid',
          'grid-cols-1',
          'gap-4',
          style === CardStyle.FLAT && 'mx-auto text-center max-w-78',
          style === CardStyle.FLAT && 'px-4 py-8',
          style !== CardStyle.FLAT && 'p-4 sm:p-6',
        )}
      >
        {children}
      </div>
    </div>
  );
});
