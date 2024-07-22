import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { Card } from './card';
import { ExclamationPoint, ExternalLink, UpRightArrow } from './icons';

const Chip: FC<PropsWithChildren<{ isWarning?: boolean }>> = ({
  isWarning,
  children,
}) => (
  <div
    className={clsx(
      'flex',
      'w-fit',
      'gap-2.5',
      'items-center',
      'justify-center',
      'rounded',
      'font-bold',
      'text-xsm',
      'leading-tight',
      'tracking-[0.03438rem]',
      'uppercase',
      'whitespace-nowrap',
      isWarning &&
        'bg-yellow-200 text-[#806c23] py-[0.1875rem] pl-[0.1875rem] pr-2.5',
      !isWarning && 'bg-purple-100 text-grey-700 px-2.5 py-1',
    )}
  >
    {isWarning ? <ExclamationPoint w={16} h={16} /> : null}
    {children}
  </div>
);

/** Rendered as a button, with a border. Narrow layout only. */
const BorderedLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'flex',
      'sm:hidden',
      'gap-2',
      'justify-center',
      'items-center',
      'self-stretch',
      'h-9',
      'px-3.5',
      'py-1.5',
      'border',
      'rounded',
      'border-grey-300',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

/** Rendered as a pseudo-link, without a border. Med and wide layouts only */
const BorderlessLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'hidden',
      'sm:flex',
      'gap-2',
      'items-center',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
      'whitespace-nowrap',
      'hover:underline',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

export const IncentiveCard: FC<{
  typeChip: string;
  headline: string;
  subHeadline: string;
  body: string;
  warningChip: string | null;
  buttonUrl: string;
  buttonText: string;
}> = ({
  typeChip,
  headline,
  subHeadline,
  body,
  warningChip,
  buttonUrl,
  buttonText,
}) => (
  <Card padding="small">
    <div className="flex gap-4 justify-between items-baseline">
      <div className="text-grey-900 text-lg font-medium leading-normal">
        {headline}
      </div>
      {/* Only appears on medium and wide layout */}
      <BorderlessLinkButton href={buttonUrl}>
        {buttonText} <ExternalLink w={20} h={20} />
      </BorderlessLinkButton>
    </div>
    <div className="text-grey-400 text-base font-medium leading-tight">
      {subHeadline}
    </div>
    <div className="text-grey-600 text-base leading-normal">{body}</div>
    <div className="flex flex-wrap gap-2.5">
      <Chip>{typeChip}</Chip>
      {warningChip && <Chip isWarning={true}>{warningChip}</Chip>}
    </div>
    {/* Only appears on narrow layout */}
    <BorderedLinkButton href={buttonUrl}>
      {buttonText} <UpRightArrow w={20} h={20} />
    </BorderedLinkButton>
  </Card>
);
