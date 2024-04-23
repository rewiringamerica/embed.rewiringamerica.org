import clsx from 'clsx';
import { FC, PropsWithChildren, forwardRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  APIResponse,
  AmountUnit,
  Incentive,
  ItemType,
} from './api/calculator-types-v1';
import { getYear, isInFuture } from './api/dates';
import { PrimaryButton, TextButton } from './buttons';
import { Card, CardStyle } from './card';
import { TextInput } from './components/text-input';
import { wasEmailSubmitted } from './email-signup';
import { str } from './i18n/str';
import { MsgFn, useTranslated } from './i18n/use-translated';
import { IconTabBar } from './icon-tab-bar';
import { ExclamationPoint, UpRightArrow } from './icons';
import { IRARebate, getRebatesFor } from './ira-rebates';
import { PartnerLogos } from './partner-logos';
import { PROJECTS, Project, shortLabel } from './projects';
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
  const item = itemName(incentive.item.type, msg);
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

/**
 * TODO this is an internationalization sin. Figure out something better!
 */
const itemName = (itemType: ItemType, msg: MsgFn) =>
  itemType === 'battery_storage_installation'
    ? msg('battery storage', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'electric_panel'
    ? msg('an electric panel', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'electric_stove'
    ? msg('an electric/induction stove', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'electric_vehicle_charger'
    ? msg('an EV charger', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'electric_wiring'
    ? msg('electric wiring', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'geothermal_heating_installation'
    ? msg('geothermal heating installation', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'heat_pump_air_conditioner_heater'
    ? msg('a heat pump', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'heat_pump_clothes_dryer'
    ? msg('a heat pump clothes dryer', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'heat_pump_water_heater'
    ? msg('a heat pump water heater', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'new_electric_vehicle'
    ? msg('a new electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'rooftop_solar_installation'
    ? msg('rooftop solar', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'used_electric_vehicle'
    ? msg('a used electric vehicle', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : itemType === 'weatherization'
    ? msg('weatherization', { desc: 'e.g. "$100 off [this string]"' })
    : itemType === 'efficiency_rebates'
    ? msg('an energy efficiency retrofit', {
        desc: 'e.g. "$100 off [this string]"',
      })
    : null;

const formatIncentiveType = (incentive: Incentive, msg: MsgFn) =>
  incentive.payment_methods[0] === 'tax_credit'
    ? msg('Tax credit')
    : incentive.payment_methods[0] === 'pos_rebate'
    ? msg('Upfront discount')
    : incentive.payment_methods[0] === 'rebate'
    ? msg('Rebate')
    : incentive.payment_methods[0] === 'account_credit'
    ? msg('Account credit')
    : incentive.payment_methods[0] === 'performance_rebate'
    ? msg('Performance rebate')
    : msg('Incentive');

const getStartYearIfInFuture = (incentive: Incentive) =>
  incentive.start_date && isInFuture(incentive.start_date, new Date())
    ? getYear(incentive.start_date)
    : null;

const isIRARebate = (incentive: Incentive) =>
  incentive.authority_type === 'federal' &&
  (incentive.payment_methods.includes('pos_rebate') ||
    incentive.payment_methods.includes('performance_rebate'));

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
      isWarning &&
        'bg-yellow-200 text-[#806c23] py-[0.1875rem] pl-[0.1875rem] pr-2.5',
      !isWarning && 'bg-purple-100 text-grey-700 px-2.5 py-1',
    )}
  >
    {isWarning ? <ExclamationPoint w={16} h={16} /> : null}
    {children}
  </div>
);

const LinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'flex',
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

const IncentiveCard: FC<{
  cardStyle: CardStyle;
  typeChip: string;
  headline: string;
  subHeadline: string;
  body: string;
  warningChip: string | null;
  buttonUrl: string;
  buttonContent: string | React.ReactElement;
}> = ({
  cardStyle,
  typeChip,
  headline,
  subHeadline,
  body,
  warningChip,
  buttonUrl,
  buttonContent,
}) => (
  <Card cardStyle={cardStyle}>
    <div className="flex flex-col gap-4 h-full">
      <Chip>{typeChip}</Chip>
      <div className="text-grey-700 text-xl leading-normal">{headline}</div>
      <div className="text-grey-700 font-medium leading-tight">
        {subHeadline}
      </div>
      <Separator hideOnSmall={true} />
      <div
        className={clsx(
          'leading-normal',
          cardStyle === CardStyle.HIGHLIGHTED && 'text-grey-500',
          cardStyle !== CardStyle.HIGHLIGHTED && 'text-grey-400',
        )}
      >
        {body}
      </div>
      {warningChip && <Chip isWarning={true}>{warningChip}</Chip>}
      <LinkButton href={buttonUrl}>{buttonContent}</LinkButton>
    </div>
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
    <Card cardStyle={CardStyle.FLAT}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
      {incentives
        // Sort incentives that haven't started yet at the end
        .sort(
          (a, b) =>
            (getStartYearIfInFuture(a) ?? 0) - (getStartYearIfInFuture(b) ?? 0),
        )
        .map((incentive, index) => {
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

          const [buttonUrl, buttonContent] = incentive.more_info_url
            ? [incentive.more_info_url, msg('Learn more')]
            : [
                incentive.program_url,
                <>
                  {msg('Visit site')}
                  <UpRightArrow w={20} h={20} />
                </>,
              ];
          return (
            <IncentiveCard
              key={`incentive${index}`}
              cardStyle={CardStyle.NORMAL}
              typeChip={formatIncentiveType(incentive, msg)}
              headline={formatTitle(incentive, msg)!}
              subHeadline={incentive.program}
              body={`${incentive.short_description} ${locationEligibilityText}`}
              warningChip={
                futureStartYear
                  ? msg(str`Expected in ${futureStartYear}`)
                  : null
              }
              buttonUrl={buttonUrl}
              buttonContent={buttonContent}
            />
          );
        })
        .concat(
          iraRebates.map((rebate, index) => (
            <IncentiveCard
              key={`ira${index}`}
              cardStyle={CardStyle.HIGHLIGHTED}
              typeChip={msg('Rebate')}
              headline={rebate.headline}
              subHeadline={rebate.program}
              body={rebate.description}
              warningChip={null}
              buttonUrl={rebate.url}
              buttonContent={msg('Learn more')}
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
  tabs: Project[];
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
    return tabs.length > 0 ? (
      <div className="min-w-50" ref={ref}>
        <h2 className="mb-6 text-grey-700 text-center text-balance text-3xl font-medium leading-tight">
          {heading}
        </h2>
        <IconTabBar
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelected={onTabSelected}
        />
        {incentives.length > 0 || iraRebates.length > 0
          ? renderCardCollection(incentives, iraRebates)
          : renderNoResults(emailSubmitter)}
      </div>
    ) : null;
  },
);

type Props = {
  firstResultsRef?: React.Ref<HTMLDivElement>;
  secondResultsRef?: React.Ref<HTMLDivElement>;
  response: APIResponse;
  selectedProjects: Project[];
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
  firstResultsRef,
  secondResultsRef,
  response,
  selectedProjects,
  emailSubmitter,
}) => {
  const { msg } = useTranslated();

  // We're filtering out IRA rebates in favor of state-specific handling.
  const allEligible = response.incentives
    .filter(i => i.eligible)
    .filter(i => !isIRARebate(i));

  const incentivesByProject = Object.fromEntries(
    Object.entries(PROJECTS).map(([project, info]) => [
      project,
      allEligible.filter(i => info.items.includes(i.item.type)),
    ]),
  ) as Record<Project, Incentive[]>;

  const projectsWithIncentives = (
    Object.entries(incentivesByProject) as [Project, Incentive[]][]
  )
    .filter(([, incentives]) => incentives.length > 0)
    .map(([project]) => project);

  const interestedProjects = selectedProjects.sort((a, b) =>
    shortLabel(a, msg).localeCompare(shortLabel(b, msg)),
  );

  const otherProjects = projectsWithIncentives
    .filter(project => !interestedProjects.includes(project))
    .sort((a, b) => shortLabel(a, msg).localeCompare(shortLabel(b, msg)));

  // If a nonexistent tab is selected, pretend the first one is selected.
  const [projectTab, setProjectTab] = useState(interestedProjects[0]);
  const [otherTab, setOtherTab] = useState(otherProjects[0]);

  const selectedIncentives = incentivesByProject[projectTab] ?? [];
  const selectedOtherIncentives = incentivesByProject[otherTab] ?? [];

  const iraRebates = response.is_under_150_ami
    ? getRebatesFor(response.location.state, msg)
    : [];
  const selectedIraRebates = iraRebates.filter(r => r.project === projectTab);
  const selectedOtherIraRebates = iraRebates.filter(
    r => r.project === otherTab,
  );

  return (
    <>
      <IncentiveGrid
        ref={firstResultsRef}
        heading={msg('Incentives you’re interested in')}
        incentives={selectedIncentives}
        iraRebates={selectedIraRebates}
        tabs={interestedProjects}
        selectedTab={projectTab}
        onTabSelected={setProjectTab}
        emailSubmitter={emailSubmitter}
      />
      <IncentiveGrid
        ref={secondResultsRef}
        heading={msg('Other incentives available to you')}
        incentives={selectedOtherIncentives}
        iraRebates={selectedOtherIraRebates}
        tabs={otherProjects}
        selectedTab={otherTab}
        onTabSelected={setOtherTab}
        // We won't show the empty state in this seciton, so no email submission
        emailSubmitter={null}
      />
      <PartnerLogos response={response} />
    </>
  );
};
