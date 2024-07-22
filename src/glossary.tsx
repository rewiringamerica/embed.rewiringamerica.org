import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { useEffect, useId, useRef } from 'react';
import { lock, unlock } from 'tua-body-scroll-lock';
import { IncentiveType } from './api/calculator-types-v1';
import { useTranslated } from './i18n/use-translated';
import { CircledChevron, Cross } from './icons';

/** A single accordion section. */
function Section({
  title,
  paragraphs,
  defaultExpanded,
}: {
  title: string;
  paragraphs: string[];
  defaultExpanded?: boolean;
}) {
  return (
    <Disclosure
      as="div"
      defaultOpen={defaultExpanded}
      className={clsx(
        'group',
        'flex',
        'flex-col',
        'py-4',
        'gap-4',
        'border-b',
        'last:border-b-0',
        'border-color-border-secondary',
      )}
    >
      <Disclosure.Button
        autoFocus={defaultExpanded}
        className="flex items-center text-left"
      >
        <h2 className="grow text-lg font-medium leading-tight">{title}</h2>
        <span className="group-data-open:rotate-180">
          <CircledChevron
            w={40}
            h={40}
            fillClass="fill-[#ebebeb] group-data-open:fill-color-action-primary"
            strokeClass="stroke-grey-900 group-data-open:stroke-color-text-primary-on-dark"
          />
        </span>
      </Disclosure.Button>
      <Disclosure.Panel className="flex flex-col gap-4">
        <p className="font-medium leading-normal">{paragraphs[0]}</p>
        {paragraphs.slice(1).map((text, index) => (
          <p key={title + index} className="leading-normal">
            {text}
          </p>
        ))}
      </Disclosure.Panel>
    </Disclosure>
  );
}

export function Glossary({
  expandedSection,
  onClose,
}: {
  expandedSection: IncentiveType;
  onClose: () => void;
}) {
  const { msg } = useTranslated();

  const sections: { key: IncentiveType; title: string; body: string[] }[] = [
    {
      key: 'account_credit',
      title: msg('Account credit'),
      body: [
        msg(
          `An account credit is a credit applied to the total amount owed on a \
utility account bill.`,
        ),
        msg(
          `Typically, you receive an account credit after meeting income \
eligibility or participating in an energy saving program.`,
        ),
        msg(
          `Your utility will apply the credit to your billing account, which \
will reduce the amount you owe on your next bill.`,
        ),
      ],
    },
    {
      key: 'assistance_program',
      title: msg('Assistance program'),
      body: [
        msg(
          `An assistance program is a program funded by government agencies, \
utility companies, or non-profit organizations that provides products or \
services like EV chargers and weatherization for free.`,
        ),
        msg(
          `Typically, you are eligible to receive assistance based on income \
level, household size, and energy usage.`,
        ),
        msg(
          `You may receive this assistance directly in the form of a home \
service or appliance installation, or you may receive a voucher or coupon to \
complete the purchase yourself.`,
        ),
      ],
    },
    {
      key: 'performance_rebate',
      title: msg('Performance rebate'),
      body: [
        msg(
          `A post-purchase rebate that depends on measured or modeled \
efficiency improvements.`,
        ),
      ],
    },
    {
      key: 'rebate',
      title: msg('Rebate (post-purchase)'),
      body: [
        msg(
          `A post-purchase rebate reduces the overall cost of a product by \
providing a partial or full reimbursement after the purchase.`,
        ),
        msg(
          `You will receive this rebate directly in the form of a \
reimbursement, either as a check or a refund to the original payment method.`,
        ),
      ],
    },
    {
      key: 'tax_credit',
      title: msg('Tax credit'),
      body: [
        msg(
          `A tax credit reduces the amount of tax you owe, or increases your \
refund amount.`,
        ),
        msg(
          `Typically, claiming a tax credit requires purchasing and installing \
eligible energy-efficient products or making eligible home improvements in a \
specific timeframe.`,
        ),
        msg('You will claim tax credits when filing your tax returns.'),
      ],
    },
    {
      key: 'pos_rebate',
      title: msg('Upfront discount'),
      body: [
        msg(
          `An upfront discount, or point-of-sale rebate, reduces the overall \
cost of a product by providing an instant discount at the time of purchase.`,
        ),
        msg(
          `Typically, these rebates will apply to products you can purchase on \
your own, like an induction stove or EV charger.`,
        ),
        msg(
          `You will receive this rebate directly in the form of a discount \
applied when you purchase the product in-person or online.`,
        ),
      ],
    },
  ];

  // Sort by title post-localization
  sections.sort((a, b) => a.title.localeCompare(b.title));

  const titleId = useId();
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  // Stop the main document from scrolling while the modal is up
  useEffect(() => {
    lock([scrollableDivRef.current!]);
    return () => unlock(scrollableDivRef.current!);
  });

  return (
    <FocusTrap
      focusTrapOptions={{
        // The appropriate disclosure button will focus itself on mount, by way
        // of its autoFocus prop.
        initialFocus: false,
        // This functionality doesn't play nice with shadow DOM. Parent must
        // handle this itself.
        returnFocusOnDeactivate: false,
      }}
    >
      <div
        className={clsx(
          'fixed',
          'z-10',
          'top-0',
          'left-0',
          'w-full',
          'h-full',
          'flex',
          'items-center',
          'justify-center',
          'backdrop-blur-sm',
          'bg-purple-100/80',
        )}
        // Clicking off the body of the modal, or hitting Escape, closes it
        onClick={onClose}
        onKeyDown={e => {
          // "Escape" is standard; some older browsers use "Esc"
          if (e.key === 'Escape' || e.key === 'Esc') {
            onClose();
          }
        }}
      >
        <div
          className={clsx(
            'flex',
            'flex-col',
            'w-full',
            'h-full',
            'sm:max-w-2xl',
            'sm:h-5/6',
            'sm:rounded-xl',
            'bg-color-background-primary',
            'shadow-modal',
            'overflow-hidden',
          )}
          // Prevent clicks on the body from closing the modal
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-labelledby={titleId}
          aria-modal={true}
        >
          <div
            className={clsx(
              'flex',
              'p-6',
              'shadow-modalHeader',
              'text-color-text-primary',
              'text-lg',
              'font-bold',
              'leading-tight',
            )}
          >
            <h2 id={titleId} className="grow">
              {msg('Savings Programs Glossary')}
            </h2>
            <button
              type="button"
              aria-label={msg('Close glossary', { desc: 'button caption' })}
              onClick={onClose}
            >
              <Cross w={20} h={20} />
            </button>
          </div>
          <div
            ref={scrollableDivRef}
            className="h-full overflow-y-auto p-6 text-color-text-primary"
          >
            <p className="leading-normal">
              {msg(
                `There are tons of savings programs that help people purchase \
electric appliances and reduce their energy costs. This glossary explains how \
different programs work!`,
              )}
            </p>
            {sections.map(({ key, title, body }) => (
              <Section
                key={key}
                title={title}
                paragraphs={body}
                defaultExpanded={key === expandedSection}
              />
            ))}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
