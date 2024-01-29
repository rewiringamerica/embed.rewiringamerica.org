import clsx from 'clsx';
import { FC } from 'react';

export const Spinner: FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(className, 'animate-spinnerContainer')}
    role="progressbar"
  >
    <svg className="w-full h-full" viewBox="22 22 44 44">
      <circle
        className="animate-spinnerIndicator"
        cx="44"
        cy="44"
        r="20.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
      />
    </svg>
  </div>
);
