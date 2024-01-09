import { msg, str } from '@lit/localize';
import { css, html, nothing } from 'lit';
import scrollIntoView from 'scroll-into-view-if-needed';
import { APIResponse, Incentive, ItemType } from './api/calculator-types-v1';
import { AuthorityLogos } from './authority-logos';
import { wasEmailSubmitted } from './email-signup';
import { IconTabBar } from './icon-tab-bar';
import { exclamationPoint, upRightArrow } from './icons';
import { PROJECTS, Project, shortLabel } from './projects';
import { RewiringAmericaStateCalculator } from './state-calculator';

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

const titleTemplate = (incentive: Incentive) => {
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
    return nothing;
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
const startDateTemplate = (incentive: Incentive) =>
  isIRARebate(incentive)
    ? html`<div class="incentive__chip incentive__chip--warning">
        ${exclamationPoint()} ${msg('Expected in 2024')}
      </div>`
    : nothing;

const incentiveCardTemplate = (incentive: Incentive) => html`
  <div class="card">
    <div class="card-content">
      <div class="incentive">
        <div class="incentive__chip">${formatIncentiveType(incentive)}</div>
        <div class="incentive__title">${titleTemplate(incentive)}</div>
        <div class="incentive__subtitle">${incentive.program}</div>
        <div class="separator separator--nosmall"></div>
        <div class="incentive__blurb">${incentive.short_description}</div>
        ${startDateTemplate(incentive)}
        <a
          class="incentive__link-button"
          target="_blank"
          href="${incentive.program_url ?? incentive.item.url}"
        >
          ${incentive.program_url ? msg('Visit site') : msg('Learn more')}
          ${incentive.program_url ? upRightArrow() : nothing}
        </a>
      </div>
    </div>
  </div>
`;

function scrollToForm(this: RewiringAmericaStateCalculator) {
  const calculator = this.shadowRoot?.querySelector('.calculator');
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

const onSubmitEmail = (
  e: SubmitEvent,
  submitEmail: (email: string) => void,
) => {
  e.preventDefault();
  const email = new FormData(e.target as HTMLFormElement).get('email');
  if (email) {
    submitEmail!(email as string);
  }
};

// TODO: don't reuse card CSS here, make something standalone
const noResultsTemplate = (
  emailSubmitter: ((email: string) => void) | null,
) => {
  const emailForm =
    emailSubmitter === null
      ? nothing
      : wasEmailSubmitted()
      ? html`
          <div class="separator"></div>
          <div class="noresults__cta">
            ${msg('You’re subscribed to our newsletter!')}
          </div>
          <div class="noresults__subtext">
            ${msg(
              'You’ll get updates on incentives, rebates, and more from Rewiring America.',
            )}
          </div>
        `
      : html`
          <div class="separator"></div>
          <div class="noresults__cta">
            ${msg(
              'To get updates on new incentives, subscribe to our newsletter!',
            )}
          </div>
          <form @submit=${(e: SubmitEvent) => onSubmitEmail(e, emailSubmitter)}>
            <div class="noresults__form">
              <input
                type="email"
                autocomplete="email"
                placeholder=${msg('you@example.com', {
                  desc: 'example email address',
                })}
                name="email"
                aria-label=${msg('Email address')}
              />
              <button class="primary">
                ${msg('Subscribe', { desc: 'button text' })}
              </button>
            </div>
          </form>
        `;

  return html`<div class="card card--null">
    <div class="card-content card-content--null">
      <h1 class="noresults__title">
        ${msg('No incentives available for this project')}
      </h1>
      <p>
        ${msg(
          'This could be because there are no incentives in your area, or you don’t financially qualify for any incentives.',
        )}
      </p>
      <button class="text-button" @click=${scrollToForm}>
        ${msg('Back to calculator')}
      </button>
      ${emailForm}
    </div>
  </div>`;
};

const cardCollectionTemplate = (incentives: Incentive[]) =>
  html`<div class="grid-3-2-1 grid-3-2-1--align-start">
    ${incentives
      // Put IRA rebates after everything else
      .sort((a, b) => +isIRARebate(a) - +isIRARebate(b))
      .map(incentiveCardTemplate)}
  </div>`;

const gridTemplate = (
  registerReactElement: (rootId: string, element: React.ReactElement) => void,

  heading: string,
  htmlId: string,
  incentives: Incentive[],
  tabs: Project[],
  selectedTab: Project,
  onTabSelected: (newSelection: Project) => void,
  emailSubmitter: ((email: string) => void) | null,
) => {
  const iconsId = `${htmlId}-icons`;
  registerReactElement(
    iconsId,
    <IconTabBar
      tabs={tabs}
      selectedTab={selectedTab}
      onTabSelected={onTabSelected}
    />,
  );

  return tabs.length > 0
    ? html`
        <div class="grid-section" id="${htmlId}">
          <h2 class="grid-section__header">${heading}</h2>
          <div id="${iconsId}" class="react-root"></div>
          ${incentives.length > 0
            ? cardCollectionTemplate(incentives)
            : noResultsTemplate(emailSubmitter)}
        </div>
      `
    : nothing;
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
export const stateIncentivesTemplate = (
  registerReactElement: (rootId: string, element: React.ReactElement) => void,
  response: APIResponse,
  selectedProjects: Project[],
  onOtherTabSelected: (newOtherSelection: Project) => void,
  onTabSelected: (newSelection: Project) => void,
  emailSubmitter: ((email: string) => void) | null,
  selectedOtherTab?: Project,
  selectedProjectTab?: Project,
) => {
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

  // Render any React components
  registerReactElement(
    'authority-logos',
    <AuthorityLogos response={response} />,
  );

  return html`${gridTemplate(
      registerReactElement,
      msg('Incentives you’re interested in'),
      'interested-incentives',
      selectedIncentives,
      interestedProjects,
      projectTab,
      onTabSelected,
      emailSubmitter,
    )}
    ${gridTemplate(
      registerReactElement,
      msg('Other incentives available to you'),
      'other-incentives',
      selectedOtherIncentives,
      otherProjects,
      // If a nonexistent tab is selected, pretend the first one is selected.
      otherTab,
      onOtherTabSelected,
      // We won't show the empty state in this seciton, so no email submission
      null,
    )}
    <div id="authority-logos" class="react-root"></div>`;
};
