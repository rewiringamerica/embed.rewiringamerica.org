import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { TooltipButton } from './tooltip';

/**
 * Styles the all-uppercase label for a form field. The label element should be
 * passed in as the child. Optionally renders a tooltip button after the label.
 */
export const FormLabel: FC<
  PropsWithChildren<{
    hidden?: boolean;
    tooltipText?: string;
  }>
> = ({ hidden, tooltipText, children }) => (
  <div
    className={clsx(
      'relative',
      'w-fit',
      'flex',
      'items-center',
      'gap-1',
      'my-2',
      'leading-5',
      hidden && 'hidden',
    )}
  >
    <span className="text-xsm font-bold uppercase tracking-[0.55px]">
      {children}
    </span>
    {tooltipText && <TooltipButton text={tooltipText} />}
  </div>
);
