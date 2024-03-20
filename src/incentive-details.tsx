import { css } from 'lit';
import { FC } from 'react';
import {
  AmountType,
  ICalculatedIncentiveResults,
  IIncentiveRecord,
} from './calculator-types';
import { CalculatorTableIcon } from './icons';
import { tableStyles } from './styles';

const linkButtonStyles = css`
  a.more-info-button,
  a.more-info-button:link,
  a.more-info-button:visited {
    display: inline-block;
    text-decoration: none;
    color: var(--ra-embed-text-color);
    background-color: rgb(238, 238, 238);
    border-radius: 4px;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    position: relative;
    padding: 8px 40px 8px 16px;
  }

  a.more-info-button:hover,
  a.more-info-button:active {
    background-color: rgb(218, 218, 218);
  }

  a.more-info-button::after {
    content: '';
    display: inline-block;
    position: absolute;
    border-color: var(--ra-embed-text-color);
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

  a.more-info-link,
  a.more-info-link:link,
  a.more-info-link:visited {
    text-decoration: none;
    color: var(--ra-embed-text-color);
  }

  /* Extra small devices */
  @media only screen and (max-width: 768px) {
    .hide-on-mobile {
      display: none;
    }
    a.more-info-link,
    a.more-info-link:link,
    a.more-info-link:visited {
      text-decoration: underline;
      color: unset;
    }
  }
`;

export const detailsStyles = [linkButtonStyles, tableStyles];

function formatAmount(amount: number, amount_type: AmountType) {
  if (amount_type === 'percent') {
    return `${Math.round(amount * 100)}%`;
  } else if (amount_type === 'dollar_amount') {
    if (amount === 0) {
      return 'N/A';
    } else {
      return `$${amount.toLocaleString()}`;
    }
  } else {
    return `$${amount.toLocaleString()}`;
  }
}

function formatStartDate(start_date: number) {
  const thisYear = new Date().getFullYear();
  if (start_date <= thisYear) {
    return <em>Available Now!</em>;
  } else {
    return start_date.toString();
  }
}

const absoluteRewiringURL = (path: string) =>
  new URL(path, 'https://www.rewiringamerica.org').toString();

const renderDetailRow = (key: number, incentive: IIncentiveRecord) => (
  <tr key={key} className={incentive.eligible ? '' : 'row--dimmed'}>
    <td>
      <a
        className="more-info-link"
        target="_blank"
        href={absoluteRewiringURL(incentive.more_info_url)}
      >
        {incentive.item}
      </a>
    </td>
    <td className="cell--right">
      {formatAmount(incentive.amount, incentive.amount_type)}
    </td>
    <td className="cell--right">{formatStartDate(incentive.start_date)}</td>
    <td className="cell--right hide-on-mobile">
      <a
        className="more-info-button"
        target="_blank"
        href={absoluteRewiringURL(incentive.more_info_url)}
      >
        More Info
      </a>
    </td>
  </tr>
);
const renderDetailsTable = (incentives: Array<IIncentiveRecord>) => (
  <table>
    <thead>
      <tr>
        <th className="cell--primary">Item</th>
        <th className="cell--right">Amount</th>
        <th className="cell--right">Timeline</th>
        <th className="hide-on-mobile"></th>
      </tr>
    </thead>
    <tbody>
      {incentives &&
        incentives.map((item, index) => renderDetailRow(index, item))}
    </tbody>
  </table>
);
export const IncentiveDetails: FC<{ results: ICalculatedIncentiveResults }> = ({
  results,
}) => (
  <div className="card">
    <div className="card__heading--intense">
      <div className="card__heading__icon-grid">
        <CalculatorTableIcon w={43} h={43} />
        <div>
          <h2>Household Electrification Incentives</h2>
          <p>All the savings you may be eligible for!</p>
        </div>
      </div>
    </div>
    <div className="card-content--full-bleed">
      <h1 className="card-content--full-bleed__title">
        Electrification Rebates
      </h1>
      {renderDetailsTable(results.pos_rebate_incentives)}
      <h1 className="card-content--full-bleed__title">Tax Credits</h1>
      {renderDetailsTable(results.tax_credit_incentives)}
    </div>
  </div>
);
