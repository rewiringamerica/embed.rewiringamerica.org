import { msg, str } from '@lit/localize';
import { css } from 'lit';
import { FC, Key, PropsWithChildren, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, Incentive, ItemType } from './api/calculator-types-v1';
import { AuthorityLogos } from './authority-logos';
import { TextButton } from './buttons';
import { Card } from './card';
import { wasEmailSubmitted } from './email-signup';
import { IconTabBar } from './icon-tab-bar';
import { ExclamationPoint, UpRightArrow } from './icons';
import { PROJECTS, Project, shortLabel } from './projects';
import { Separator } from './separator';

export const stateIncentivesStyles = css`
  /* for now, override these variables just for the state calculator */
  :host {
    /* select */
    --ra-select-focus-color: var(--rewiring-purple);
    /* input */
    --ra-input-border: 1px solid #e2e2e2;
    --ra-input-focus-color: var(--rewiring-purple);
    --ra-input-margin: 0;
    --ra-input-padding: 0.5rem 0.75rem;
  }
`;

const formatTitle = (incentive: Incentive) => {
  const item = itemName(incentive.item.type);
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
          str`$${amount.number.toLocaleString()}/${
            amount.unit
          } off ${item}, up to $${amount.maximum.toLocaleString()}`,
          {
            desc: 'e.g. "$1000/ton off a heat pump, up to $3000"',
          },
        )
      : msg(
          str`$${amount.number.toLocaleString()}/${amount.unit} off ${item}`,
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
const itemName = (itemType: ItemType) =>
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

const formatIncentiveType = (incentive: Incentive) =>
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

/** We're special-casing these to hardcode an availability start date */
const isIRARebate = (incentive: Incentive) =>
  incentive.payment_methods[0] === 'pos_rebate' &&
  incentive.authority_type === 'federal';

/** TODO get real dates in the data! */
const renderStartDate = (incentive: Incentive) =>
  isIRARebate(incentive) ? (
    <Chip isWarning={true}>{msg('Expected in 2024')}</Chip>
  ) : null;

const Chip: FC<PropsWithChildren<{ isWarning?: boolean }>> = ({
  isWarning,
  children,
}) => {
  const classes = [
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
  ];
  if (isWarning) {
    classes.push(
      'bg-yellow-200',
      'text-[#806c23]',
      'py-[0.1875rem]',
      'pl-[0.1875rem]',
      'pr-2.5',
    );
  } else {
    classes.push('bg-purple-100', 'text-gray-700', 'px-2.5', 'py-1');
  }
  return (
    <div className={classes.join(' ')}>
      {isWarning ? <ExclamationPoint w={16} h={16} /> : null}
      {children}
    </div>
  );
};

const LinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  const classes = [
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
  ];
  return (
    <a className={classes.join(' ')} target="_blank" href={href}>
      {children}
    </a>
  );
};

const renderIncentiveCard = (key: Key, incentive: Incentive) => (
  <Card key={key}>
    <div className="flex flex-col gap-4 h-full">
      <Chip>{formatIncentiveType(incentive)}</Chip>
      <div className="text-gray-700 text-xl leading-normal">
        {formatTitle(incentive)}
      </div>
      <div className="text-gray-700 font-medium leading-tight">
        {incentive.program}
      </div>
      <Separator hideOnSmall={true} />
      <div className="text-grey-400 leading-normal">
        {incentive.short_description}
      </div>
      {renderStartDate(incentive)}
      <LinkButton href={incentive.program_url ?? incentive.item.url}>
        {incentive.program_url ? msg('Visit site') : msg('Learn more')}
        {incentive.program_url ? <UpRightArrow w={20} h={20} /> : null}
      </LinkButton>
    </div>
  </Card>
);
function scrollToForm(event: React.MouseEvent) {
  const calculator = (
    event.currentTarget.getRootNode() as ShadowRoot
  )?.querySelector('.calculator');

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

// TODO: don't reuse card CSS here, make something standalone
const renderNoResults = (emailSubmitter: ((email: string) => void) | null) => {
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
            <input
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
            <button className="primary">
              {msg('Subscribe', { desc: 'button text' })}
            </button>
          </div>
        </form>
      </>
    );

  return (
    <Card isFlat={true}>
      <h1 className="text-grey-700 text-xl font-normal">
        {msg('No incentives available for this project')}
      </h1>
      <p>
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

const renderCardCollection = (incentives: Incentive[]) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
    {incentives
      // Put IRA rebates after everything else
      .sort((a, b) => +isIRARebate(a) - +isIRARebate(b))
      .map((incentive, index) => renderIncentiveCard(index, incentive))}
  </div>
);

type IncentiveGridProps = {
  heading: string;
  htmlId: string;
  incentives: Incentive[];
  tabs: Project[];
  selectedTab: Project;
  onTabSelected: (newSelection: Project) => void;
  emailSubmitter: ((email: string) => void) | null;
};

const IncentiveGrid: FC<IncentiveGridProps> = ({
  heading,
  htmlId,
  incentives,
  tabs,
  selectedTab,
  onTabSelected,
  emailSubmitter,
}) => {
  return tabs.length > 0 ? (
    <div className="min-w-50" id={htmlId}>
      <h2 className="mb-6 text-grey-700 text-center text-balance text-3xl font-medium leading-tight">
        {heading}
      </h2>
      <IconTabBar
        tabs={tabs}
        selectedTab={selectedTab}
        onTabSelected={onTabSelected}
      />
      {incentives.length > 0
        ? renderCardCollection(incentives)
        : renderNoResults(emailSubmitter)}
    </div>
  ) : null;
};

type Props = {
  response: APIResponse;
  selectedProjects: Project[];
  onOtherTabSelected: (newOtherSelection: Project) => void;
  onTabSelected: (newSelection: Project) => void;
  emailSubmitter: ((email: string) => void) | null;
  selectedOtherTab?: Project;
  selectedProjectTab?: Project;
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
  response,
  selectedProjects,
  onOtherTabSelected,
  onTabSelected,
  emailSubmitter,
  selectedOtherTab,
  selectedProjectTab,
}) => {
  const allEligible = response.incentives.filter(i => i.eligible);

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
    shortLabel(a).localeCompare(shortLabel(b)),
  );

  const otherProjects = projectsWithIncentives
    .filter(project => !interestedProjects.includes(project))
    .sort((a, b) => shortLabel(a).localeCompare(shortLabel(b)));

  // If a nonexistent tab is selected, pretend the first one is selected.
  const projectTab =
    selectedProjectTab && interestedProjects.includes(selectedProjectTab)
      ? selectedProjectTab
      : interestedProjects[0];

  const otherTab =
    selectedOtherTab && otherProjects.includes(selectedOtherTab)
      ? selectedOtherTab
      : otherProjects[0];

  const selectedIncentives = incentivesByProject[projectTab] ?? [];
  const selectedOtherIncentives = incentivesByProject[otherTab] ?? [];

  return (
    <>
      <IncentiveGrid
        heading={msg('Incentives you’re interested in')}
        htmlId="interested-incentives"
        incentives={selectedIncentives}
        tabs={interestedProjects}
        selectedTab={projectTab}
        onTabSelected={onTabSelected}
        emailSubmitter={emailSubmitter}
      />
      <IncentiveGrid
        heading={msg('Other incentives available to you')}
        htmlId="other-incentives"
        incentives={selectedOtherIncentives}
        tabs={otherProjects}
        selectedTab={otherTab}
        onTabSelected={onOtherTabSelected}
        // We won't show the empty state in this seciton, so no email submission
        emailSubmitter={null}
      />
      <AuthorityLogos response={response} />
    </>
  );
};
