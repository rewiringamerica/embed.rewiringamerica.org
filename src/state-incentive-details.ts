import { css, html, nothing } from 'lit';
import { APIResponse, Amount, Incentive } from './api/calculator-types-v1';
import { exclamationPoint } from './icons';

export const stateIncentivesStyles = css`
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
    width: fit-content;
  }

  .incentive__chip--warning {
    background-color: #fef2ca;
    padding: 0.1875rem 0.625rem 0.1875rem 0.1875rem;
    color: #846f24;
  }

  .incentive__title {
    font-weight: 500;
    line-height: 125%;
  }

  .incentive__blurb {
    color: #757575;
    line-height: 150%;
  }

  .incentive__amount {
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

  .grid-3-2--align-start {
    align-items: start;
  }

  .grid-section-header {
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
  @media only screen and (max-width: 600px) {
    .card {
      margin: 0 1rem;
      min-width: 200px;
    }
  }

  .card-content {
    padding: 1rem;
    display: grid;
    grid-template-rows: min-content;
    gap: 1rem;
  }
`;

export const dividerStyles = css`
  .divider {
    display: flex;
    flex-wrap: wrap;

    & h1 {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 125%;
    }

    & .spacer {
      flex-grow: 1;
      height: 2rem;
    }
  }

  .divider__section {
    width: 25rem;
  }

  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .divider {
      margin: 0 1rem;
      min-width: 200px;

      & .card {
        margin: 0;
      }
    }
  }
`;

export const separatorStyles = css`
  .separator {
    background: #e2e2e2;
    width: 100%;
    height: 1px;
  }
`;

/** To make the layout more realistic until we have descriptions in API */
const DUMMY_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices ' +
  'facilisis erat sit amet posuere. Nunc ex dolor, tincidunt sed efficitur ' +
  'eget, pharetra at sapien mauris quis.';

const nowrap = (text: string) => html`<span class="nowrap">${text}</span>`;

const amountTemplate = (amount: Amount) =>
  amount.type === 'dollar_amount'
    ? amount.maximum
      ? nowrap(`Up to $${amount.maximum.toLocaleString()}`)
      : `$${amount.number.toLocaleString()}`
    : amount.type === 'percent'
    ? amount.maximum
      ? html`${nowrap(`${Math.round(amount.number * 100)}% of cost`)},
        ${nowrap(`up to $${amount.maximum.toLocaleString()}`)}`
      : `${Math.round(amount.number * 100)}% of cost`
    : amount.type === 'dollars_per_unit'
    ? amount.maximum
      ? html`${nowrap(`$${amount.number.toLocaleString()}/${amount.unit}`)},
        ${nowrap(`up to $${amount.maximum.toLocaleString()}`)} `
      : `$${amount.number.toLocaleString()}/${amount.unit}`
    : nothing;

const formatIncentiveType = (incentive: Incentive) =>
  incentive.type === 'tax_credit'
    ? 'TAX CREDIT'
    : incentive.amount.type === 'dollar_amount'
    ? 'FLAT-RATE REBATE'
    : incentive.amount.type === 'percent'
    ? 'COST REBATE'
    : incentive.amount.type === 'dollars_per_unit'
    ? 'CAPACITY REBATE'
    : 'REBATE';

/** TODO get real dates in the data! */
const startDateTemplate = (incentive: Incentive) =>
  incentive.type === 'pos_rebate'
    ? html`<div class="incentive__chip incentive__chip--warning">
        ${exclamationPoint()} AVAILABLE EARLY 2024
      </div>`
    : nothing;

const incentiveBoxTemplate = (incentive: Incentive) => html`
  <div class="card">
    <div class="card-content">
      <div class="incentive">
        <div class="incentive__chip">${formatIncentiveType(incentive)}</div>
        <div class="incentive__amount">${amountTemplate(incentive.amount)}</div>
        <div class="incentive__title">
          ${incentive.authority_name
            ? html`${incentive.authority_name}<br />`
            : nothing}
          ${incentive.program}
        </div>
        <div class="separator"></div>
        <div class="incentive__blurb">${DUMMY_TEXT}</div>
        ${startDateTemplate(incentive)}
        <a
          class="incentive__link-button"
          target="_blank"
          href="${incentive.item.url}"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
`;

export const summaryBoxTemplate = (caption: string, body: string) => html`
  <div class="card">
    <div class="summary">
      <div class="summary__caption">${caption}</div>
      <div class="summary__body">${body}</div>
    </div>
  </div>
`;

export const atAGlanceTemplate = (
  response: APIResponse,
  eligibleCount: number,
) => {
  return html`
    <h2 class="grid-section-header">Incentives at a glance</h2>
    <div class="grid-3-2 grid-3-2--align-start">
      ${summaryBoxTemplate(
        'Total available incentives',
        eligibleCount.toLocaleString(),
      )}
      ${summaryBoxTemplate(
        'Upfront discounts',
        `$${response.pos_savings.toLocaleString()}`,
      )}
      ${summaryBoxTemplate(
        'Tax credits',
        `$${response.tax_savings.toLocaleString()}`,
      )}
    </div>
  `;
};

export const gridTemplate = (heading: string, incentives: Incentive[]) => {
  return incentives.length > 0
    ? html`
        <h2 class="grid-section-header">${heading}</h2>
        <div class="grid-3-2 grid-3-2--align-start">
          ${incentives.map(incentiveBoxTemplate)}
        </div>
      `
    : nothing;
};

export const stateIncentivesTemplate = (
  response: APIResponse,
  selectedProject: string,
) => {
  const allEligible = [
    ...response.pos_rebate_incentives,
    ...response.tax_credit_incentives,
  ].filter(i => i.eligible);

  const selected = allEligible.filter(i => i.item.type === selectedProject);
  const other = allEligible.filter(i => i.item.type !== selectedProject);

  return html` ${atAGlanceTemplate(response, allEligible.length)}
  ${gridTemplate("Incentives you're interested in", selected)}
  ${gridTemplate('Other incentives available to you', other)}`;
};
