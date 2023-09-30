import { css, html, nothing } from 'lit';
import { APIResponse, Incentive, ItemType } from './api/calculator-types-v1';
import { exclamationPoint, questionIcon, upRightArrow } from './icons';
import { PROJECTS, Project, shortLabel } from './projects';
import { iconTabBarTemplate } from './icon-tab-bar';
import { authorityLogosTemplate } from './authority-logos';

export const stateIncentivesStyles = css`
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
    color: #846f24;
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

  .nowrap {
    white-space: nowrap;
  }

  .grid-3-2-1,
  .grid-4-2-1 {
    display: grid;
    gap: 1rem;
    align-items: end;
  }
  .grid-3-2-1--align-start,
  .grid-4-2-1--align-start {
    align-items: start;
  }

  @media only screen and (max-width: 640px) {
    .grid-3-2-1,
    .grid-4-2-1 {
      grid-template-columns: 1fr;
    }
  }

  @media only screen and (min-width: 641px) and (max-width: 768px) {
    .grid-3-2-1,
    .grid-4-2-1 {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media only screen and (min-width: 769px) {
    .grid-3-2-1 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .grid-4-2-1 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }

  .grid-section .card {
    margin: 0;
  }

  @media only screen and (max-width: 640px) {
    .grid-section {
      margin: 0 1rem;
      min-width: 200px;
    }
  }

  .grid-section__header {
    margin-bottom: 1.5rem;

    color: #111;
    text-align: center;

    font-size: 2rem;
    font-weight: 500;
    line-height: 125%;
  }

  .summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    flex: 1 0 0;
    padding: 0.75rem;
  }

  .summary__title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .summary__caption {
    color: #111;

    font-size: 0.6875rem;
    font-weight: 700;
    line-height: 125%;
    letter-spacing: 0.03438rem;
    text-transform: uppercase;
  }

  .summary__body {
    color: #111;

    font-size: 1.5rem;
    font-weight: 400;
    line-height: 165%;
  }
`;

export const cardStyles = css`
  .card {
    margin: 0;

    border: var(--ra-embed-card-border);
    border-radius: 0.5rem;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.08);
    background-color: var(--ra-embed-card-background);
    overflow: clip;
  }

  /* Extra small devices */
  @media only screen and (max-width: 640px) {
    .card {
      margin: 0 1rem;
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
`;

export const separatorStyles = css`
  .separator {
    background: #e2e2e2;
    width: 100%;
    height: 1px;
  }

  @media only screen and (max-width: 640px) {
    .separator {
      display: none;
    }
  }
`;

const titleTemplate = (incentive: Incentive) => {
  const item = itemName(incentive.item.type);
  const amount = incentive.amount;
  if (amount.type === 'dollar_amount') {
    return amount.maximum
      ? `Up to $${amount.maximum.toLocaleString()} off ${item}`
      : `$${amount.number.toLocaleString()} off ${item}`;
  } else if (amount.type === 'percent') {
    const percentStr = `${Math.round(amount.number * 100)}%`;
    return amount.maximum
      ? `${percentStr} of cost of ${item}, up to $${amount.maximum.toLocaleString()}`
      : `${percentStr} of cost of ${item}`;
  } else if (amount.type === 'dollars_per_unit') {
    const perUnitStr = `$${amount.number.toLocaleString()}/${amount.unit}`;
    return amount.maximum
      ? `${perUnitStr} off ${item}, up to $${amount.maximum.toLocaleString()}`
      : `${perUnitStr} off ${item}`;
  } else {
    return nothing;
  }
};

/**
 * TODO this is an internationalization sin. Figure out something better!
 */
const itemName = (itemType: ItemType) =>
  itemType === 'battery_storage_installation'
    ? 'battery storage'
    : itemType === 'electric_panel'
    ? 'an electric panel'
    : itemType === 'electric_stove'
    ? 'an electric/induction stove'
    : itemType === 'electric_vehicle_charger'
    ? 'an EV charger'
    : itemType === 'electric_wiring'
    ? 'electric wiring'
    : itemType === 'geothermal_heating_installation'
    ? 'geothermal heating installation'
    : itemType === 'heat_pump_air_conditioner_heater'
    ? 'a heat pump'
    : itemType === 'heat_pump_clothes_dryer'
    ? 'a heat pump clothes dryer'
    : itemType === 'heat_pump_water_heater'
    ? 'a heat pump water heater'
    : itemType === 'new_electric_vehicle'
    ? 'a new electric vehicle'
    : itemType === 'rooftop_solar_installation'
    ? 'rooftop solar'
    : itemType === 'used_electric_vehicle'
    ? 'a used electric vehicle'
    : itemType === 'weatherization'
    ? 'weatherization'
    : null;

const formatIncentiveType = (incentive: Incentive) =>
  incentive.type === 'tax_credit'
    ? 'Tax credit'
    : incentive.type === 'pos_rebate'
    ? 'Upfront discount'
    : incentive.type === 'rebate'
    ? 'Rebate'
    : incentive.type === 'account_credit'
    ? 'Account credit'
    : incentive.type === 'performance_rebate'
    ? 'Performance rebate'
    : 'Incentive';

/** TODO get real dates in the data! */
const startDateTemplate = (incentive: Incentive) =>
  incentive.type === 'pos_rebate'
    ? html`<div class="incentive__chip incentive__chip--warning">
        ${exclamationPoint()} Available early 2024
      </div>`
    : nothing;

const incentiveCardTemplate = (incentive: Incentive) => html`
  <div class="card">
    <div class="card-content">
      <div class="incentive">
        <div class="incentive__chip">${formatIncentiveType(incentive)}</div>
        <div class="incentive__title">${titleTemplate(incentive)}</div>
        <div class="incentive__subtitle">${incentive.program}</div>
        <div class="separator"></div>
        <div class="incentive__blurb">${incentive.short_description}</div>
        ${startDateTemplate(incentive)}
        <a
          class="incentive__link-button"
          target="_blank"
          href="${incentive.program_url ?? incentive.item.url}"
        >
          ${incentive.program_url ? 'Visit site' : 'Learn more'}
          ${incentive.program_url ? upRightArrow() : nothing}
        </a>
      </div>
    </div>
  </div>
`;

const summaryBoxTemplate = (
  caption: string,
  body: string,
  tooltip: string,
) => html`
  <div class="card">
    <div class="summary">
      <div class="summary__title">
        <span class="summary__caption"> ${caption} </span>
        <sl-tooltip content="${tooltip}" hoist>
          ${questionIcon(18, 18)}
        </sl-tooltip>
      </div>
      <div class="summary__body">${body}</div>
    </div>
  </div>
`;

const atAGlanceTemplate = (response: APIResponse) => {
  return html`
    <div class="grid-section">
      <h2 class="grid-section__header">Incentives at a glance</h2>
      <div class="grid-4-2-1 grid-4-2-1--align-start">
        ${summaryBoxTemplate(
          'Upfront discounts',
          `$${response.savings.pos_rebate.toLocaleString()}`,
          "Money saved on a project's upfront costs.",
        )}
        ${summaryBoxTemplate(
          'Rebates',
          `$${response.savings.rebate.toLocaleString()}`,
          'Money paid back to you after a project is completed.',
        )}
        ${summaryBoxTemplate(
          'Account credits',
          `$${response.savings.account_credit.toLocaleString()}`,
          'Money credited to your utility account, going towards paying your next bills.',
        )}
        ${summaryBoxTemplate(
          'Tax credits',
          `$${response.savings.tax_credit.toLocaleString()}`,
          'Your taxes may be reduced by up to this amount.',
        )}
      </div>
    </div>
  `;
};

const gridTemplate = (
  heading: string,
  incentives: Incentive[],
  tabs: Project[],
  selectedTab: Project,
  onTabSelected: (newSelection: Project) => void,
) =>
  tabs.length > 0 && incentives.length > 0
    ? html`
        <div class="grid-section">
          <h2 class="grid-section__header">${heading}</h2>
          ${iconTabBarTemplate(tabs, selectedTab, onTabSelected)}
          <div class="grid-3-2-1 grid-3-2-1--align-start">
            ${incentives.map(incentiveCardTemplate)}
          </div>
        </div>
      `
    : nothing;
/**
 * Renders the "at a glance" summary section, a grid of incentive cards about
 * the project you selected in the main form, then a grid of tab-bar switchable
 * incentive cards about other projects.
 *
 * @param selectedProject The project whose incentives should get hoisted into
 * their own section above all the others.
 * @param selectedOtherTab The project among the "others" section whose tab is
 * currently selected.
 */
export const stateIncentivesTemplate = (
  response: APIResponse,
  selectedProjects: Project[],
  onOtherTabSelected: (newOtherSelection: Project) => void,
  onTabSelected: (newSelection: Project) => void,
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

  const nonSelectedProjects = Object.entries(PROJECTS)
    .filter(([project, _]) => !selectedProjects.includes(project as Project))
    .sort(([a], [b]) => shortLabel(a).localeCompare(shortLabel(b)))
    .map(([project, _]) => project);

  // Only offer "other" tabs if there are incentives for that project.
  const otherTabs = (
    Object.entries(incentivesByProject) as [Project, Incentive[]][]
  )
    .filter(
      ([project, incentives]) =>
        !selectedProjects.includes(project) && incentives.length > 0,
    )
    .sort(([a], [b]) => shortLabel(a).localeCompare(shortLabel(b)))
    .map(([project]) => project);

  const projectTab =
    selectedProjectTab &&
    selectedProjects.includes(selectedProjectTab as Project)
      ? selectedProjectTab
      : selectedProjects[0];
  const otherTab =
    selectedOtherTab &&
    nonSelectedProjects.includes(selectedOtherTab as Project)
      ? selectedOtherTab
      : nonSelectedProjects[0];

  const selectedIncentives = incentivesByProject[projectTab] ?? [];
  const selectedOtherIncentives =
    incentivesByProject[otherTab as Project] ?? [];

  const otherIncentivesLabel =
    selectedIncentives.length == 0
      ? 'Incentives available to you'
      : 'Other incentives available to you';

  return html` ${atAGlanceTemplate(response)}
  ${gridTemplate(
    "Incentives you're interested in",
    selectedIncentives,
    selectedProjects,
    projectTab,
    onTabSelected,
  )}
  ${gridTemplate(
    otherIncentivesLabel,
    selectedOtherIncentives,
    otherTabs,
    // If a nonexistent tab is selected, pretend the first one is selected.
    otherTab as Project,
    onOtherTabSelected,
  )}
  ${authorityLogosTemplate(response)}`;
};
