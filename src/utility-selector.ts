import { css, html } from 'lit';
import { questionIcon } from './icons';
import { OptionParam, select } from './select';
import { STATES } from './states';

export const utilitySelectorStyles = css`
  .utility-selector {
    display: grid;
    align-items: center;

    & .map {
      position: relative;
      text-align: center;

      & svg {
        vertical-align: top;
      }
    }

    & h1 {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);

      font-weight: 700;
      line-height: 125%;

      text-align: center;
      font-size: 1.75rem;
    }

    & .spacer {
      height: 1.5rem;
    }

    & .selector {
      height: min-content;
    }
  }

  /* Extra small devices: map above selector */
  @media only screen and (max-width: 640px) {
    .utility-selector {
      grid-template-columns: 1fr;

      margin-left: 1rem;
      margin-right: 1rem;
      min-width: 200px;

      & .card {
        /* Margin is provided by the outer element */
        margin: 0;
      }
    }
  }

  /* Medium and large: map and selector side by side */
  @media only screen and (min-width: 641px) {
    .utility-selector {
      grid-template-columns: 5fr 2fr 5fr;
    }
  }

  /* Large: bigger text, left-aligned */
  @media only screen and (min-width: 769px) {
    .utility-selector {
      & h1 {
        text-align: left;
        font-size: 2.25rem;
      }
    }
  }
`;

const utilityFormTemplate = (
  utilityId: string,
  utilityOptions: OptionParam[],
  onChange: (utilityId: string) => void,
) => {
  return html`
    <form>
      <div>
        <label for="utility">
          Electric Utility
          <sl-tooltip
            content="Choose the company you pay your electric bill to."
            hoist
          >
            ${questionIcon(18, 18)}
          </sl-tooltip>
          <br />
          ${select({
            id: 'utility',
            required: true,
            disabled: utilityOptions.length < 2,
            options: utilityOptions,
            currentValue: utilityId,
            tabIndex: 0,
            onChange: event =>
              onChange((event.target as HTMLInputElement).value),
          })}
        </label>
      </div>
    </form>
  `;
};

export const utilitySelectorTemplate = (
  state: string,
  utilityId: string,
  utilityOptions: OptionParam[],
  onChange: (utilityId: string) => void,
) =>
  html` <div class="utility-selector">
    <div class="map">
      ${STATES[state].icon()}
      <h1>Incentives available to you in ${STATES[state].name}</h1>
    </div>
    <div class="spacer"></div>
    <div class="card card-content selector">
      ${utilityFormTemplate(utilityId, utilityOptions, onChange)}
    </div>
  </div>`;
