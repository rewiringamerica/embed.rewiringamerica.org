import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { TooltipButton } from '../tooltip';

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
      'w-fit',
      'flex',
      'gap-1',
      'my-2',
      'text-xsm',
      'leading-5',
      'font-bold',
      'uppercase',
      'tracking-[0.55px]',
      hidden && 'hidden',
    )}
  >
    {children}
    {tooltipText && <TooltipButton text={tooltipText} iconSize={13} />}
  </div>
);
