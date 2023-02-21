import { css, html } from 'lit';
import { calculatorTableIcon } from './icons';
import { tableStlyes } from './styles';
import { AmountType, ICalculatedIncentiveResults, IIncentiveRecord, IncentiveType } from './calculator-types';

const linkButtonStyles = css`
  a.more-info-button, a.more-info-button:link, a.more-info-button:visited {
    display: inline-block;
    text-decoration: none;
    color: black;
    background-color: rgb(238, 238, 238);
    border-radius: 4px;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    position: relative;
    padding: 8px 40px 8px 16px;
  }
  a.more-info-button:hover, a.more-info-button:active {
    background-color: rgb(218, 218, 218);
  }
  a.more-info-button::after {
    content: "";
    display: inline-block;
    position: absolute;
    border-color: black;
    border-style: solid;
    border-top-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 0px;
    width: 10px;
    height: 10px;
    right: 16px;
    transform: rotate(316deg);
    margin-top: 8px;
  }

  a.more-info-link, a.more-info-link:link, a.more-info-link:visited {
    text-decoration: none;
    color: black;
  }

  /* Extra small devices */
  @media only screen and (max-width: 768px) {
    .hide-on-mobile {
      display:none;
    }
    a.more-info-link, a.more-info-link:link, a.more-info-link:visited {
      text-decoration: underline;
      color: unset;
    }
  }
`;

export const detailsStyles = [linkButtonStyles, tableStlyes]

function formatAmount(amount: number, amount_type: AmountType) {
  if (amount_type == 'percent') {
    return `${Math.round(amount * 100)}%`;
  } else if (amount_type == 'dollar_amount') {
    if (amount == 0) {
      return 'N/A';
    } else {
      return `$${amount.toLocaleString()}`;
    }
  } else {
    return amount.toString();
  }
}

function formatStartDate(start_date: number, type: IncentiveType) {
  if (start_date == 2022) {
    return html`<em>Available Now!</em>`;
  } else if (start_date == 2023) {
    if (type == 'pos_rebate') {
      return html`Late 2023`;
    } else {
      return html`<em>Available Now!</em>`;
    }
  } else {
    return html`${start_date.toString()}`;
  }
}

const detailRow = (incentive: IIncentiveRecord) => html`
  <tr class=${incentive.eligible ? '' : 'row--dimmed'}>
    <td><a class="more-info-link" target="_blank" href="https://www.rewiringamerica.org/${incentive.more_info_url}">${incentive.item}</a></td>
    <td class="cell--right">${formatAmount(incentive.amount, incentive.amount_type)}</td>
    <td class="cell--right">${formatStartDate(incentive.start_date, incentive.type)}</td>
    <td class="cell--right hide-on-mobile"><a class="more-info-button" target="_blank" href="https://www.rewiringamerica.org/${incentive.more_info_url}">More Info</a></td>
  </tr>
`;

const detailsTable = (incentives: Array<IIncentiveRecord>) => html`
  <table>
    <thead>
      <tr>
        <th class="cell--primary">Item</th>
        <th class="cell--right">Amount</th>
        <th class="cell--right">Timeline</th>
        <th class="hide-on-mobile"></th>
      </tr>
    </thead>
    <tbody>
      ${incentives && incentives.map(item => detailRow(item))}
    </tbody>
  </table>
`;

export const detailsTemplate = (results: ICalculatedIncentiveResults) => html`
  <div class="card">
    <div class="card__heading--intense">
      <div class="card__heading__icon-grid">
        ${calculatorTableIcon()}
        <div>
          <h2>Household Electrification Incentives</h2>
          <p>All the savings you may be eligible for!</p>
        </div>
      </div>
    </div>
    <div class="card-content--full-bleed">
      <h1 class="card-content--full-bleed__title">Electrification Rebates</h1>
      ${detailsTable(results.pos_rebate_incentives)}
      <h1 class="card-content--full-bleed__title">Tax Credits</h1>
      ${detailsTable(results.tax_credit_incentives)}
    </div>
  </div>
`;
