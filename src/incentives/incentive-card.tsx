import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import {
  BorderedLinkButton,
  BorderlessLinkButton,
} from '../components/buttons';
import { Card } from '../components/card';
import {
  ExclamationPoint,
  ExternalLink,
  UpRightArrow,
} from '../components/icons';

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
      <h4 className="text-grey-900 text-lg font-medium leading-normal">
        {headline}
      </h4>
      {/* Only appears on medium and wide layout */}
      <BorderlessLinkButton href={buttonUrl}>
        {buttonText} <ExternalLink w={20} h={20} />
      </BorderlessLinkButton>
    </div>
    <h5 className="text-grey-400 text-base font-medium leading-tight">
      {subHeadline}
    </h5>
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
