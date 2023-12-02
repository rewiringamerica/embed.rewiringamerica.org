import { css } from 'lit';

export const baseStyles = css`
  /* private 'semantic' defaults to use in themes */
  :host {
    --rewiring-yellow: rgb(249, 214, 91);
    --rewiring-yellow-darker: rgb(242, 199, 46);
    --rewiring-purple: rgb(74, 0, 195);
    --rewiring-purple-darker: rgb(56, 8, 151);
    --rewiring-light-purple: rgb(241, 237, 249);
    --rewiring-light-yellow: rgb(254, 242, 202);
  }

  /* these are documented as themable and should be backwards compatible if changed */
  :host {
    /* Most of the text */
    --ra-embed-font-family: 'GT America', system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --ra-embed-font-size: 16px;
    --ra-embed-line-height: 28px;
    --ra-embed-font-weight: 400;
    --ra-embed-text-color: black;
    --ra-embed-emphasis-text-color: var(--rewiring-purple);
    /* the Calculate! button */
    --ra-embed-primary-button-background-color: var(--rewiring-yellow);
    --ra-embed-primary-button-background-hover-color: var(
      --rewiring-yellow-darker
    );
    --ra-embed-primary-button-text-color: black;
    /* card styles: */
    --ra-embed-card-background: white;
    --ra-embed-card-shadow: rgba(0, 0, 0, 0.1) 0px 4px 50px;
    --ra-embed-card-border: 1px solid rgb(217, 217, 217);
    --ra-embed-card-border-radius: 24px;
    /* the lavender card heading: */
    --ra-embed-card-heading-background: var(--rewiring-light-purple);
    --ra-embed-card-heading-text-color: black;
    /* the rich purple card heading: */
    --ra-embed-card-heading-intense-background: var(--rewiring-purple);
    --ra-embed-card-heading-intense-text-color: white;
    /* info section for high income customers */
    --ra-embed-card-info-border: var(--rewiring-yellow);
    --ra-embed-card-info-background: rgb(255, 250, 231);
    /* tooltip styles */
    --ra-tooltip-max-width: 280px;
    --ra-tooltip-arrow-size: 0px;
    --ra-tooltip-padding: 24px;
    --ra-tooltip-background-color: var(--ra-embed-card-background);
    --ra-tooltip-color: var(--ra-embed-text-color);
    --ra-tooltip-border-radius: 8px;
    --ra-tooltip-border: var(--ra-embed-card-border);
    --ra-tooltip-box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px,
      rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
    /* form label styles */
    --ra-form-label-font-size: 16px;
    --ra-form-label-line-height: 28px;
    --ra-form-label-font-weight: 500;
    --ra-form-label-font-style: normal;
    --ra-form-label-margin: 0;
    --ra-form-label-text-transform: none;
    --ra-form-label-letter-spacing: normal;
    /* select styles */
    --ra-select-border: 1px solid #cccccc;
    --ra-select-background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
    --ra-select-border-radius: 4px;
    --ra-select-background-color: #fff;
    --ra-select-padding: 0.5rem 1rem;
    --ra-select-arrow-color: #222;
    --ra-select-focus-color: blue;
    --ra-select-margin: 4px 0 0 0;
    /* input styles */
    --ra-input-border: 1px solid #cccccc;
    --ra-input-focus-color: blue;
    --ra-input-padding: 0.5rem 1rem;
    --ra-input-font-size: var(--ra-embed-font-size);
    --ra-input-line-height: var(--ra-embed-line-height);
    --ra-input-border-radius: 4px;
    --ra-input-margin: 4px 0 0 0;
  }

  :host {
    all: initial; /* https://lamplightdev.com/blog/2019/03/26/why-is-my-web-component-inheriting-styles/ */
    color: var(--ra-embed-text-color);
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    font-family: var(--ra-embed-font-family);
    font-size: var(--ra-embed-font-size);
    line-height: var(--ra-embed-line-height);
    font-weight: var(--ra-embed-font-weight);
    margin: 0 auto; /* center on page */
    display: block; /* required for max-width to kick in */
    width: 100%;
    max-width: 1280px;
  }

  * {
    box-sizing: border-box;
  }

  h1 {
    font-size: 24px;
    line-height: 125%;
    font-weight: 500;
    margin: 0;
    text-wrap: balance;
  }

  h2 {
    font-size: 22px;
    line-height: 125%;
    font-weight: 500;
    margin: 0;
  }

  p {
    font-size: 16px;
    line-height: 150%;
    font-weight: normal;
    font-style: normal;
    margin: 0;
  }

  label,
  div.select-label {
    display: block;
    font-size: var(--ra-form-label-font-size);
    line-height: var(--ra-form-label-line-height);
    font-weight: var(--ra-form-label-font-weight);
    font-style: var(--ra-form-label-font-style);
    margin: var(--ra-form-label-margin);
    text-transform: var(--ra-form-label-text-transform);
    letter-spacing: var(--ra-form-label-letter-spacing);
  }

  em {
    color: var(--ra-embed-emphasis-text-color);
    font-style: normal;
  }

  .calculator {
    display: grid;
    grid-template-rows: min-content;
  }

  .calculator-footer {
    min-width: 200px;
    text-align: center;
    margin-top: 16px;
  }

  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .calculator {
      gap: 16px;
    }
  }
  /* (portrait tablets and large phones and up) */
  @media only screen and (min-width: 600px) {
    .calculator {
      gap: 24px;
    }
  }
  @media only screen and (min-width: 1024px) {
    .calculator {
      gap: 48px;
    }
  }
`;

export const cardStyles = css`
  .card {
    width: 100%;
    margin: 0;
  }

  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .card {
      min-width: 200px;
    }
    .card {
      border: none;
      border-radius: 0;
      box-shadow: none;
      background-color: var(--ra-embed-card-background);
      overflow: clip;
    }
  }
  /* (portrait tablets and large phones and up) */
  @media only screen and (min-width: 600px) {
    .card {
      border: var(--ra-embed-card-border);
      border-radius: var(--ra-embed-card-border-radius);
      box-shadow: var(--ra-embed-card-shadow);
      background-color: var(--ra-embed-card-background);
      overflow: clip;
    }
  }

  .card-content {
    padding: 32px;
    display: grid;
    grid-template-rows: min-content;
    gap: 16px;
  }
  .card-content--full-bleed {
    display: grid;
    grid-template-rows: min-content;
    gap: 16px;
  }
  .card-content--full-bleed__title {
    padding: 32px 32px 0px;
  }
  .card__heading {
    padding: 32px;
    background-color: var(--ra-embed-card-heading-background);
    color: var(--ra-embed-card-heading-text-color);
  }
  .card__heading--intense {
    padding: 32px;
    background-color: var(--ra-embed-card-heading-intense-background);
    color: var(--ra-embed-card-heading-intense-text-color);
  }
  .card__heading__icon-grid {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 16px;
    align-items: start;
  }
  .card__info {
    border: 1px solid var(--ra-embed-card-info-border);
    border-radius: 10px;
    padding: 18px 24px;
    background-color: var(--ra-embed-card-info-background);
  }
  .card__info a:link,
  .card__info a:visited,
  .card__info a:active,
  .card__info a:hover {
    color: var(--ra-embed-text-color);
  }
`;

export const tableStyles = css`
  table,
  thead,
  tbody,
  tfoot,
  tr,
  th,
  td {
    margin: 0;
    padding: 0;
    border: none;
    border-collapse: collapse;
    border-spacing: 0;
  }
  thead {
    background-color: rgb(241, 237, 249);
    border-top: 3px solid rgb(74, 0, 195);
  }
  tr {
    border-top: 1px solid rgb(217, 217, 217);
  }
  tr:last-of-type {
    border-bottom: 1px solid rgb(217, 217, 217);
  }
  td,
  th {
    font-size: 16px;
    line-height: 28px;
    font-weight: normal;
    text-align: left;
    padding: 16px;
    max-width: 33%;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    td,
    th {
      font-size: 14px;
      line-height: 16px;
      font-weight: normal;
      text-align: left;
      padding: 8px;
    }
  }
  th {
    font-weight: 500;
    text-transform: uppercase;
  }
  .cell--right {
    text-align: right;
  }
  .cell--primary {
    width: 33%;
  }
  .row--dimmed {
    opacity: 0.2;
  }
`;

export const gridStyles = css`
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    .grid-3-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: end;
    }
  }
  /* Portrait tablets and large phones and up */
  @media only screen and (min-width: 600px) {
    .grid-3-2 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      align-items: end;
    }
  }
`;
