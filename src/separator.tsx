import clsx from 'clsx';
import { FC } from 'react';

export const Separator: FC<{ className?: string; hideOnSmall?: boolean }> = ({
  className,
  hideOnSmall,
}) => (
  <div
    className={clsx(
      'bg-grey-200',
      'w-full',
      'h-px',
      hideOnSmall && 'hidden sm:block',
      className,
    )}
  ></div>
);
