import { TemplateResult, css, html, nothing } from 'lit';
import { ICalculatedIncentiveResults } from './calculator-types';
import { lightningBolt } from './icons';

export const summaryStyles = css`
  .summary-numbers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-numbers {
      grid-template-columns: unset;
      grid-template-rows: min-content;
    }
  }
  .summary-number__border {
    border-left: 5px solid var(--rewiring-yellow);
    padding-left: 11px;
  }
  .summary-number__border--fancy {
    border-left: 5px solid var(--rewiring-purple);
    padding-left: 11px;
  }
  .summary-number__label {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    text-transform: uppercase;
    max-width: 10em; /* optical */
    margin-bottom: 8px;
  }
  .summary-number__value {
    font-size: 32px;
    line-height: 32px;
    font-weight: 700;
  }
  .summary-number__detail {
    padding-left: 16px;
    padding-top: 4px;
    margin-top: 8px;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-number__detail {
      margin: 0;
    }
  }

  .summary-number--total {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: baseline;
    gap: 16px;
  }
  .summary-number--total__value,
  .summary-number--total__label {
    font-size: 48px;
    line-height: 64px;
    font-weight: 500;
  }
  .summary-number--total__label__detail {
    display: none;
  }
  .summary-number--total__icon {
    vertical-align: middle;
    margin-left: 16px;
  }

  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .summary-number--total__icon {
      display: none;
    }
    .summary-number--total__label__detail {
      display: inline;
    }
    .summary-number--total__disclaimer {
      display: none;
    }
    .summary-number--total {
      border-left: 5px solid var(--rewiring-yellow);
      padding-left: 11px;
      display: block;
      grid-template-columns: unset;
      align-items: unset;
      gap: unset;
    }
    .summary-number--total__label {
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }
`;

const numberTemplate = (
  label: string,
  value: number,
  fancy?: boolean,
  extra?: TemplateResult | typeof nothing,
) => html`
  <div class="summary-number">
    <div
      class=${fancy
        ? 'summary-number__border--fancy'
        : 'summary-number__border'}
    >
      <div class="summary-number__label">${label}</div>
      <div class="summary-number__value">$${value.toLocaleString()}</div>
    </div>
    ${extra || nothing}
  </div>
`;

function nearestFifty(dollars: number) {
  return Math.round(dollars / 50) * 50;
}

const upfrontDiscountLabel = ({
  is_under_150_ami,
  is_under_80_ami,
}: ICalculatedIncentiveResults) => {
  if (is_under_80_ami) {
    return html`
      <div class="summary-number__detail">Covers up to 100% of costs</div>
      <!-- TODO: tooltip! -->
      <!-- Electrification rebates for your income bracket can be used to cover 100% of your total costs. For example, if your total project cost is $10,000, you can receive an electrification rebate of $10,000. -->
    `;
  } else if (is_under_150_ami) {
    return html`
      <div class="summary-number__detail">Covers up to 50% of costs</div>
      <!-- TODO: tooltip! -->
      <!-- Electrification rebates for your income bracket can be used to cover up to 50% of your total costs. For example, if your total project cost is $10,000, you can receive an electrification rebate of $5,000. -->
    `;
  } else {
    return nothing;
  }
};

export const summaryTemplate = (results: ICalculatedIncentiveResults) => html`
  <div class="card">
    <div class="card__heading">
      <h1>Your Personalized Incentives</h1>
      These are available to American homeowners and renters over the next 10
      years.
    </div>
    <div class="card-content">
      <div class="summary-numbers">
        ${numberTemplate(
          'Upfront Discounts',
          nearestFifty(results.pos_savings!),
          false,
          upfrontDiscountLabel(results),
        )}
        ${numberTemplate(
          'Available Tax Credits',
          nearestFifty(results.tax_savings!),
        )}
        ${numberTemplate(
          'Estimated Bill Savings Per Year',
          nearestFifty(results.estimated_annual_savings!),
          true,
        )}
      </div>
      <div>
        <div class="summary-number--total">
          <div class="summary-number--total__label">
            Total Incentives
            <span class="summary-number--total__label__detail"
              >(Estimated)</span
            >
          </div>
          <div class="summary-number--total__value">
            $${nearestFifty(
              results.pos_savings! + results.tax_savings!,
            ).toLocaleString()}<span class="summary-number--total__icon"
              >${lightningBolt()}</span
            >
          </div>
        </div>
        <p class="summary-number--total__disclaimer">
          Disclaimer: This is an estimate. We do not yet know how or when
          electrification rebates will be implemented in each state, so we
          cannot guarantee final amounts or timeline.
        </p>
      </div>
      ${results.is_over_150_ami
        ? html`<div class="card__info">
            Based on your household income, you may not qualify for tax credits,
            but you can take full advantage of the electrification rebates.
            <a
              href="https://content.rewiringamerica.org/reports/Rewiring%20America%20IRA%20Case%20Study%20-%20High%20Income.pdf"
              target="_blank"
              >Check out this relevant case study!</a
            >
          </div>`
        : nothing}
    </div>
  </div>
`;
