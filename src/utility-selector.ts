import { css, html } from 'lit';
import { questionIcon } from './icons';
import { OptionParam, select } from './select';
import { StateInfo } from './states';

export const utilitySelectorStyles = css`
  .utility-selector {
    display: grid;
    align-items: center;
  }

  .utility-selector__map {
    position: relative;
    text-align: center;
    max-width: 100%;
  }

  .utility-selector__map svg {
    vertical-align: top;
  }

  .utility-selector__title {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    font-weight: 700;
    line-height: 125%;

    text-align: center;
    font-size: 1.75rem;
  }

  .utility-selector__spacer {
    /* Only relevant on small layout */
    height: 1.5rem;
  }

  .utility-selector__selector {
    height: min-content;
  }

  /* Extra small devices: map above selector */
  @media only screen and (max-width: 640px) {
    .utility-selector {
      grid-template-columns: 1fr;

      margin-left: 1rem;
      margin-right: 1rem;
      min-width: 200px;
    }

    .utility-selector .card {
      /* Margin is provided by the outer element */
      margin: 0;
      max-width: 100%;
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
    .utility-selector__title {
      text-align: left;
      font-size: 2.25rem;
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
        </label>
        ${select({
          id: 'utility',
          required: true,
          disabled: utilityOptions.length < 2,
          options: utilityOptions,
          currentValue: utilityId,
          tabIndex: 0,
          onChange: event => onChange((event.target as HTMLInputElement).value),
        })}
      </div>
    </form>
  `;
};

/**
 * The state map + utility selector section. They're displayed side-by-side on
 * large and medium layouts, and map above selector on small.
 *
 * Because the utility selector is outside the main calculator form, changing
 * the selection should immediately reload incentives (as opposed to waiting for
 * a button press), so there's a callback for it here.
 */
export const utilitySelectorTemplate = (
  stateInfo: StateInfo,
  utilityId: string,
  utilityOptions: OptionParam[],
  onChange: (utilityId: string) => void,
) =>
  html` <div class="utility-selector">
    <div class="utility-selector__map">
      ${stateInfo.icon()}
      <h1 class="utility-selector__title">
        Incentives available to you in ${stateInfo.name}
      </h1>
    </div>
    <div class="utility-selector__spacer"></div>
    <div class="card card-content utility-selector__selector">
      ${utilityFormTemplate(utilityId, utilityOptions, onChange)}
    </div>
  </div>`;
