import { html, svg } from 'lit';

// FIXME: does this need to be nested like this?
export const downIcon = (w: number, h: number) => html`<svg
  focusable="false"
  aria-hidden="true"
  viewBox="0 0 24 24"
  style="width: ${w}px; height: ${h}px; opacity: 0.5; fill: currentColor; vertical-align: text-top;"
>
  <svg viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.90137 1.92651L8.98672 7.62669C9.0241 7.65676 9.07756 7.65605 9.11413 7.62499L15.8241 1.92651"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
    <path
      d="M1.90137 7.67859L8.98672 13.3788C9.0241 13.4088 9.07756 13.4081 9.11413 13.3771L15.8241 7.67859"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
    ></path>
  </svg>
</svg>`;

export const questionIcon = (w: number, h: number) => html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${w}"
  height="${h}"
  viewBox="0 0 24 24"
  opacity="0.5"
  style="vertical-align:text-top;"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
  <line x1="12" y1="17" x2="12.01" y2="17"></line>
</svg>`;

export const calculatorTableIcon = (w: number = 43, h: number = 43) => html`<svg
  width="${w}"
  height="${h}"
  viewBox="0 0 43 43"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle cx="21.6223" cy="21.425" r="21.2058" fill="#F9D65B" />
  <path
    d="M16.7109 23.4374L22.917 15.2061L21.2661 21.3486L26.533 21.3787L20.6411 29.5298L22.0715 23.3739L16.7109 23.4374Z"
    fill="#400AB7"
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M20.8799 7.38469C21.2899 6.97464 21.9547 6.97463 22.3648 7.38469L35.1313 20.1512C35.7928 20.8127 35.3243 21.9437 34.3889 21.9437H31.776V32.8611C31.776 33.441 31.3059 33.9111 30.726 33.9111H12.3704C11.7905 33.9111 11.3204 33.441 11.3204 32.8611V21.9437H8.85582C7.92037 21.9437 7.45189 20.8127 8.11335 20.1512L20.8799 7.38469ZM21.6223 8.76354L9.94221 20.4437H11.7704C12.3503 20.4437 12.8204 20.9138 12.8204 21.4937V32.4111H30.276V21.4937C30.276 20.9138 30.7461 20.4437 31.326 20.4437H33.3025L21.6223 8.76354Z"
    fill="#400AB7"
  />
</svg>`;

export const lightningBolt = (w: number = 38, h: number = 64) => html`<svg
  width="${w}"
  height="${h}"
  viewBox="0 0 38 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M0.808594 36.8235L23.6951 0.682129L17.6068 27.6524L37.0301 27.7845L15.3021 63.5737L20.577 36.5447L0.808594 36.8235Z"
    fill="#F9D65B"
  />
</svg>`;

export const exclamationPoint = (w: number = 16, h: number = 16) => html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${w}"
  height="${h}"
  viewBox="0 0 16 16"
  fill="none"
>
  <rect width="16" height="16" rx="2" fill="#846F24" />
  <rect
    x="9.12494"
    y="8.12549"
    width="2.25"
    height="5.25"
    rx="1.125"
    transform="rotate(-180 9.12494 8.12549)"
    fill="#FEF2CA"
    stroke="#FEF2CA"
    stroke-width="0.25"
  />
  <rect
    x="9.12494"
    y="13.1255"
    width="2.25"
    height="2.25"
    rx="1.125"
    transform="rotate(-180 9.12494 13.1255)"
    fill="#FEF2CA"
    stroke="#FEF2CA"
    stroke-width="0.25"
  />
</svg>`;

export const upRightArrow = (w: number = 20, h: number = 20) => html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${w}"
  height="${h}"
  viewBox="0 0 20 20"
  fill="none"
>
  <path
    d="M5.83325 14.1667L14.1666 5.83337"
    stroke="#4A00C3"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M5.83325 5.83337H14.1666V14.1667"
    stroke="#4A00C3"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;
