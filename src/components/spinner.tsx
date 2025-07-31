import clsx from 'clsx';
import { forwardRef } from 'react';

export const Spinner = forwardRef<
  HTMLDivElement,
  { className?: string; labelId?: string }
>(({ className, labelId }, ref) => (
  <div
    ref={ref}
    className={clsx(className, 'animate-spinnerContainer outline-none')}
    role="progressbar"
    tabIndex={-1}
    aria-labelledby={labelId}
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
));
