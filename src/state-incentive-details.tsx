import clsx from 'clsx';
import { FC, PropsWithChildren, forwardRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  APIResponse,
  AmountUnit,
  Incentive,
  IncentiveType,
} from './api/calculator-types-v1';
import { getYear, isInFuture } from './api/dates';
import { PrimaryButton, TextButton } from './buttons';
import { Card } from './card';
import { Option, Select } from './components/select';
import { TextInput } from './components/text-input';
import { wasEmailSubmitted } from './email-signup';
import { str } from './i18n/str';
import { MsgFn, useTranslated } from './i18n/use-translated';
import { ExclamationPoint, ExternalLink, UpRightArrow } from './icons';
import { IRARebate, getRebatesFor } from './ira-rebates';
import { itemName } from './item-name';
import { PartnerLogos } from './partner-logos';
import { PROJECTS, Project } from './projects';
import { Separator } from './separator';

const formatUnit = (unit: AmountUnit, msg: MsgFn) =>
  unit === 'btuh10k'
    ? msg('10,000 Btuh')
    : unit === 'kilowatt'
    ? msg('kilowatt')
    : unit === 'kilowatt_hour'
    ? msg('kilowatt-hour')
    : unit === 'square_foot'
    ? msg('square foot')
    : unit === 'ton'
    ? msg('ton')
    : unit === 'watt'
    ? msg('watt')
    : unit;

const formatTitle = (incentive: Incentive, msg: MsgFn) => {
  const item = itemName(incentive.items, msg);
  if (!item) {
    return null;
  }

  const amount = incentive.amount;
  if (amount.type === 'dollar_amount') {
    return amount.maximum
      ? msg(str`Up to $${amount.maximum.toLocaleString()} off ${item}`, {
          desc: 'e.g. "up to $3000 off a heat pump',
        })
      : msg(str`$${amount.number.toLocaleString()} off ${item}`, {
          desc: 'e.g. "$3000 off a heat pump"',
        });
  } else if (amount.type === 'percent') {
    const percentStr = `${Math.round(amount.number * 100)}%`;
    return amount.maximum
      ? msg(
          str`${percentStr} of cost of ${item}, up to $${amount.maximum.toLocaleString()}`,
          {
            desc: 'e.g. "50% of cost of a heat pump, up to $3000"',
          },
        )
      : msg(str`${percentStr} of cost of ${item}`, {
          desc: 'e.g. "50% of cost of a heat pump"',
        });
  } else if (amount.type === 'dollars_per_unit') {
    return amount.maximum
      ? msg(
          str`$${amount.number.toLocaleString()}/${formatUnit(
            amount.unit!,
            msg,
          )} off ${item}, up to $${amount.maximum.toLocaleString()}`,
          {
            desc: 'e.g. "$1000/ton off a heat pump, up to $3000"',
          },
        )
      : msg(
          str`$${amount.number.toLocaleString()}/${formatUnit(
            amount.unit!,
            msg,
          )} off ${item}`,
          {
            desc: 'e.g. "$1000/ton off a heat pump',
          },
        );
  } else {
    return null;
  }
};

const formatIncentiveType = (payment_methods: IncentiveType[], msg: MsgFn) =>
  payment_methods[0] === 'tax_credit'
    ? msg('Tax credit')
    : payment_methods[0] === 'pos_rebate'
    ? msg('Upfront discount')
    : payment_methods[0] === 'rebate'
    ? msg('Rebate')
    : payment_methods[0] === 'account_credit'
    ? msg('Account credit')
    : payment_methods[0] === 'performance_rebate'
    ? msg('Performance rebate')
    : msg('Incentive');

const getStartYearIfInFuture = (incentive: Incentive) =>
  incentive.start_date && isInFuture(incentive.start_date, new Date())
    ? getYear(incentive.start_date)
    : null;

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

/** Rendered as a button, with a border. */
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
      'text-purple-500',
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

/** Rendered as a pseudo-link, without a border */
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
      'text-purple-500',
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

const IncentiveCard: FC<{
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

function scrollToForm(event: React.MouseEvent) {
  const calculator = (
    event.currentTarget.getRootNode() as ShadowRoot
  )?.getElementById('calc-root');

  if (!calculator) {
    return;
  }
  scrollIntoView(calculator, {
    behavior: 'smooth',
    block: 'start',
    inline: 'start',
    scrollMode: 'always',
  });
}

const renderNoResults = (emailSubmitter: ((email: string) => void) | null) => {
  const { msg } = useTranslated();
  const [email, setEmail] = useState('');

  const emailForm =
    emailSubmitter === null ? null : wasEmailSubmitted() ? (
      <>
        <Separator />
        <div className="text-grey-700 font-bold leading-normal">
          {msg('You’re subscribed to our newsletter!')}
        </div>
        <div className="text-grey-500 leading-normal">
          {msg(
            'You’ll get updates on incentives, rebates, and more from Rewiring America.',
          )}
        </div>
      </>
    ) : (
      <>
        <Separator />
        <div className="text-grey-700 font-bold leading-normal">
          {msg(
            'To get updates on new incentives, subscribe to our newsletter!',
          )}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (email) {
              emailSubmitter(email);
            }
          }}
        >
          <div className="grid gap-4 auto-rows-min">
            <TextInput
              type="email"
              autoComplete="email"
              placeholder={msg('you@example.com', {
                desc: 'example email address',
              })}
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label={msg('Email address')}
              required
            />
            <PrimaryButton>
              {msg('Subscribe', { desc: 'button text' })}
            </PrimaryButton>
          </div>
        </form>
      </>
    );

  return (
    <Card isFlat={true} padding="large">
      <h1 className="text-grey-700 text-xl font-normal leading-tight text-balance">
        {msg('No incentives available for this project')}
      </h1>
      <p className="leading-normal">
        {msg(
          'This could be because there are no incentives in your area, or you don’t financially qualify for any incentives.',
        )}
      </p>
      <TextButton onClick={scrollToForm}>
        {msg('Back to calculator')}
      </TextButton>
      {emailForm}
    </Card>
  );
};

const renderCardCollection = (
  incentives: Incentive[],
  iraRebates: IRARebate[],
) => {
  const { msg } = useTranslated();
  return (
    <div className="flex flex-col gap-4">
      {incentives
        // Sort incentives that haven't started yet at the end
        .sort(
          (a, b) =>
            (getStartYearIfInFuture(a) ?? 0) - (getStartYearIfInFuture(b) ?? 0),
        )
        .map((incentive, index) => {
          const headline = formatTitle(incentive, msg);
          if (!headline) {
            // We couldn't generate a headline either because the items are
            // unknown, or the amount type is unknown. Don't show a card.
            return null;
          }

          const futureStartYear = getStartYearIfInFuture(incentive);

          // The API cannot precisely tell, from zip code alone, whether the
          // user is in a specific city or county; it takes a permissive
          // approach and returns incentives for localities the user *might* be
          // in. So this indicates that the user should check for themselves.
          //
          // This is a blunt-instrument approach; in many cases there's actually
          // no ambiguity as to which city or county a zip code is in, but the
          // API currently doesn't take that into account.
          const locationEligibilityText = ['city', 'county', 'other'].includes(
            incentive.authority_type,
          )
            ? msg('Eligibility depends on residence location.')
            : '';

          const [buttonUrl, buttonText] = incentive.more_info_url
            ? [incentive.more_info_url, msg('Learn more')]
            : [
                incentive.program_url,
                futureStartYear ? msg('Learn more') : msg('Learn how to apply'),
              ];
          return (
            <IncentiveCard
              key={`incentive${index}`}
              typeChip={formatIncentiveType(incentive.payment_methods, msg)}
              headline={headline}
              subHeadline={incentive.program}
              body={`${incentive.short_description} ${locationEligibilityText}`}
              warningChip={
                futureStartYear
                  ? msg(str`Expected in ${futureStartYear}`)
                  : null
              }
              buttonUrl={buttonUrl}
              buttonText={buttonText}
            />
          );
        })
        .concat(
          iraRebates.map((rebate, index) => (
            <IncentiveCard
              key={`ira${index}`}
              typeChip={formatIncentiveType([rebate.paymentMethod], msg)}
              headline={rebate.headline}
              subHeadline={rebate.program}
              body={rebate.description}
              warningChip={rebate.timeline}
              buttonUrl={rebate.url}
              buttonText={msg('Learn more')}
            />
          )),
        )}
    </div>
  );
};

type IncentiveGridProps = {
  heading: string;
  incentives: Incentive[];
  iraRebates: IRARebate[];
  tabs: { project: Project; count: number }[];
  selectedTab: Project;
  onTabSelected: (newSelection: Project) => void;
  emailSubmitter: ((email: string) => void) | null;
};

const IncentiveGrid = forwardRef<HTMLDivElement, IncentiveGridProps>(
  (
    {
      heading,
      incentives,
      iraRebates,
      tabs,
      selectedTab,
      onTabSelected,
      emailSubmitter,
    },
    ref,
  ) => {
    const { msg } = useTranslated();

    const options: Option<Project>[] = tabs.map(({ project, count }) => ({
      value: project,
      label: PROJECTS[project].label(msg),
      getIcon: PROJECTS[project].getIcon,
      badge: count,
      disabled: count === 0,
    }));

    return tabs.length > 0 ? (
      <>
        <div className="flex flex-col gap-4 min-w-50" ref={ref}>
          <h2 className="text-grey-700 text-center text-balance text-3xl font-medium leading-tight">
            {heading}
          </h2>
          <Select
            id="project-selector"
            labelText={msg('Project', { desc: 'label for a selector input' })}
            hiddenLabel={true}
            currentValue={selectedTab}
            options={options}
            onChange={project => onTabSelected(project)}
          />
        </div>
        {incentives.length > 0 || iraRebates.length > 0
          ? renderCardCollection(incentives, iraRebates)
          : renderNoResults(emailSubmitter)}
      </>
    ) : null;
  },
);

type Props = {
  resultsRef?: React.Ref<HTMLDivElement>;
  response: APIResponse;
  emailSubmitter: ((email: string) => void) | null;
};

/**
 * Renders a grid of tab-bar switchable incentive cards about the projects you
 * selected in the main form, then a grid of tab-bar switchable incentive cards
 * about other projects.
 *
 * @param selectedProject The project whose incentives should get hoisted into
 * their own section above all the others.
 * @param selectedOtherTab The project among the "others" section whose tab is
 * currently selected.
 */
export const StateIncentives: FC<Props> = ({
  resultsRef,
  response,
  emailSubmitter,
}) => {
  const { msg } = useTranslated();

  // Map each project to all incentives that involve it. An incentive may
  // be in multiple projects, if it has multiple items and those items pertain
  // to different projects.
  const incentivesByProject = Object.fromEntries(
    Object.entries(PROJECTS).map(([project, projectInfo]) => [
      project,
      response.incentives.filter(incentive =>
        incentive.items.some(item => projectInfo.items.includes(item)),
      ),
    ]),
  ) as Record<Project, Incentive[]>;

  const countOfProjects = Object.values(incentivesByProject).filter(
    incentives => incentives.length > 0,
  ).length;

  const iraRebates = getRebatesFor(response, msg);

  // Sort projects with nonzero incentives first, then alphabetically.
  const projectOptions = (Object.keys(PROJECTS) as Project[])
    .map(project => ({
      project,
      count:
        incentivesByProject[project].length +
        iraRebates.filter(r => r.project === project).length,
    }))
    .sort((a, b) => {
      // "false" compares before "true"
      const aStr = `${a.count === 0} ${PROJECTS[a.project].label(msg)}`;
      const bStr = `${b.count === 0} ${PROJECTS[b.project].label(msg)}`;
      return aStr.localeCompare(bStr);
    });

  // If a nonexistent tab is selected, pretend the first one is selected.
  const [projectTab, setProjectTab] = useState(projectOptions[0].project);

  const selectedIncentives = projectTab ? incentivesByProject[projectTab] : [];
  const selectedIraRebates = iraRebates.filter(r => r.project === projectTab);

  return (
    <>
      <IncentiveGrid
        ref={resultsRef}
        heading={msg(
          str`We found ${response.incentives.length} results across \
${countOfProjects} projects.`,
        )}
        incentives={selectedIncentives}
        iraRebates={selectedIraRebates}
        tabs={projectOptions}
        selectedTab={projectTab}
        onTabSelected={setProjectTab}
        emailSubmitter={emailSubmitter}
      />
      <PartnerLogos response={response} />
    </>
  );
};
