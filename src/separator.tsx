import { FC } from 'react';

export const Separator: FC<{ hideOnSmall?: boolean }> = ({ hideOnSmall }) => (
  <div
    className={
      'bg-grey-200 w-full h-px' + (hideOnSmall ? ' hidden sm:block' : '')
    }
  ></div>
);
