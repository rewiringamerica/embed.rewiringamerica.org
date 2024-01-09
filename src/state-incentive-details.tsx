import { msg, str } from '@lit/localize';
import { css } from 'lit';
import { FC, Key, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, Incentive, ItemType } from './api/calculator-types-v1';
import { AuthorityLogos } from './authority-logos';
import { wasEmailSubmitted } from './email-signup';
import { IconTabBar } from './icon-tab-bar';
import { ExclamationPoint, UpRightArrow } from './icons';
import { PROJECTS, Project, shortLabel } from './projects';

export const stateIncentivesStyles = css`
  /* for now, override these variables just for the state calculator */
  :host {
    /* cards */
    --ra-embed-card-border: none;
    --ra-embed-card-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.08);
    --ra-embed-card-border-radius: 0.75rem;
    --ra-embed-card-shadow--null: none;
    --ra-embed-card-background--null: var(--rewiring-light-yellow);
    /* labels */
    --ra-form-label-font-size: 11px;
    --ra-form-label-line-height: 20px;
    --ra-form-label-font-weight: 700;
    --ra-form-label-font-style: normal;
    --ra-form-label-margin: 8px 0 8px 0;
    --ra-form-label-text-transform: uppercase;
    --ra-form-label-letter-spacing: 0.55px;
    /* button */
    --ra-embed-primary-button-background-color: var(--rewiring-purple);
    --ra-embed-primary-button-background-hover-color: var(
      --rewiring-purple-darker
    );
    --ra-embed-primary-button-text-color: white;
    /* select */
    --ra-select-border: 1px solid #e2e2e2;
    --ra-select-focus-color: var(--rewiring-purple);
    --ra-select-background-image: none;
    --ra-select-margin: 0;
    /* input */
    --ra-input-border: 1px solid #e2e2e2;
    --ra-input-focus-color: var(--rewiring-purple);
    --ra-input-margin: 0;
    --ra-input-padding: 0.5rem 0.75rem;
  }

  .loading {
    text-align: center;
    font-size: 2rem;
  }

  .incentive {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .incentive__chip {
    display: flex;
    gap: 0.625rem;
    justify-content: center;
    align-items: center;

    background-color: #f0edf8;
    border-radius: 0.25rem;
    font-weight: 700;
    font-size: 0.6875rem;
    letter-spacing: 0.03438rem;
    line-height: 125%;
    padding: 0.25rem 0.625rem;
    color: #111;
    text-transform: uppercase;
    width: fit-content;
  }

  .incentive__chip--warning {
    background-color: #fef2ca;
    padding: 0.1875rem 0.625rem 0.1875rem 0.1875rem;
    color: #806c23; // spec is #846f24 but this was not WCAG 2.1 AA compliant
  }

  .incentive__subtitle {
    color: #111;
    font-weight: 500;
    line-height: 125%;
  }

  .incentive__blurb {
    color: #757575;
    line-height: 150%;
  }

  .incentive__title {
    color: #111;
    font-size: 1.5rem;
    line-height: 150%;
  }

  .incentive__link-button {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    align-self: stretch;

    height: 2.25rem;
    padding: 0.375rem 0.875rem;

    border-radius: 0.25rem;
    border: 1px solid #9b9b9b;

    color: var(--rewiring-purple);
    font-size: 1rem;
    font-weight: 500;
    line-height: 125%;
    text-decoration: none;
  }

  .noresults__title {
    color: #111;
    font-size: 1.5rem;
    font-weight: 400;
  }

  .noresults__cta {
    color: #111;
    font-weight: bold;
    line-height: 150%;
  }

  .noresults__subtext {
    color: #6b6b6b;
    font-size: 1rem;
    font-weight: 400;
    line-height: 150%;
  }

  .noresults__form {
    display: grid;
    grid-template-rows: min-content;
    gap: 1rem;
  }

  .nowrap {
    white-space: nowrap;
  }

  .grid-2-2-1,
  .grid-3-2-1,
  .grid-4-2-1 {
    display: grid;
    gap: 1rem;
    align-items: end;
  }
  .grid-2-2-1--align-start,
  .grid-3-2-1--align-start,
  .grid-4-2-1--align-start {
    align-items: start;
  }

  @media only screen and (max-width: 640px) {
    .grid-2-2-1,
    .grid-3-2-1,
    .grid-4-2-1 {
      grid-template-columns: 1fr;
    }
  }

  @media only screen and (min-width: 641px) and (max-width: 768px) {
    .grid-2-2-1,
    .grid-3-2-1,
    .grid-4-2-1 {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media only screen and (min-width: 769px) {
    .grid-2-2-1 {
      grid-template-columns: 1fr 1fr;
    }
    .grid-3-2-1 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .grid-4-2-1 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }

  @media only screen and (max-width: 640px) {
    .grid-section {
      min-width: 200px;
    }
  }

  .grid-section__header {
    margin-bottom: 1.5rem;

    color: #111;
    text-align: center;
    text-wrap: balance;

    font-size: 2rem;
    font-weight: 500;
    line-height: 125%;
  }
`;

export const cardStyles = css`
  .card {
    border: var(--ra-embed-card-border);
    border-radius: var(--ra-embed-card-border-radius);
    box-shadow: var(--ra-embed-card-shadow);
    background-color: var(--ra-embed-card-background);
    overflow: clip;
  }

  .card--null {
    background-color: var(--ra-embed-card-background--null);
    box-shadow: var(--ra-embed-card-shadow--null);
  }

  /* Extra small devices */
  @media only screen and (max-width: 640px) {
    .card {
      min-width: 200px;
    }
  }

  .card-content {
    padding: 1.5rem;
    display: grid;
    grid-template-rows: min-content;
    gap: 1rem;
  }

  /* Extra small devices */
  @media only screen and (max-width: 640px) {
    .card-content {
      padding: 1rem;
    }
  }

  .card-content--null {
    padding: 2rem 1rem;
    text-align: center;
    max-width: 312px;
    margin: 0 auto;
  }
`;

export const separatorStyles = css`
  .separator {
    background: #e2e2e2;
    width: 100%;
    height: 1px;
  }

  @media only screen and (max-width: 640px) {
    .separator--nosmall {
      display: none;
    }
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
    <div className="incentive__chip incentive__chip--warning">
      <ExclamationPoint w={16} h={16} /> {msg('Expected in 2024')}
    </div>
  ) : null;

const renderIncentiveCard = (key: Key, incentive: Incentive) => (
  <div className="card" key={key}>
    <div className="card-content">
      <div className="incentive">
        <div className="incentive__chip">{formatIncentiveType(incentive)}</div>
        <div className="incentive__title">{formatTitle(incentive)}</div>
        <div className="incentive__subtitle">{incentive.program}</div>
        <div className="separator separator--nosmall"></div>
        <div className="incentive__blurb">{incentive.short_description}</div>
        {renderStartDate(incentive)}
        <a
          className="incentive__link-button"
          target="_blank"
          href={incentive.program_url ?? incentive.item.url}
        >
          {incentive.program_url ? msg('Visit site') : msg('Learn more')}
          {incentive.program_url ? <UpRightArrow w={20} h={20} /> : null}
        </a>
      </div>
    </div>
  </div>
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
        <div className="separator"></div>
        <div className="noresults__cta">
          {msg('You’re subscribed to our newsletter!')}
        </div>
        <div className="noresults__subtext">
          {msg(
            'You’ll get updates on incentives, rebates, and more from Rewiring America.',
          )}
        </div>
      </>
    ) : (
      <>
        <div className="separator"></div>
        <div className="noresults__cta">
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
          <div className="noresults__form">
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
    <div className="card card--null">
      <div className="card-content card-content--null">
        <h1 className="noresults__title">
          {msg('No incentives available for this project')}
        </h1>
        <p>
          {msg(
            'This could be because there are no incentives in your area, or you don’t financially qualify for any incentives.',
          )}
        </p>
        <button className="text-button" onClick={scrollToForm}>
          {msg('Back to calculator')}
        </button>
        {emailForm}
      </div>
    </div>
  );
};

const renderCardCollection = (incentives: Incentive[]) => (
  <div className="grid-3-2-1 grid-3-2-1--align-start">
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
    <div className="grid-section" id={htmlId}>
      <h2 className="grid-section__header">{heading}</h2>
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
