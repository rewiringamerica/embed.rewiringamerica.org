import { css } from 'lit';

export const baseStyles = css`
/* private 'semantic' defaults to use in themes */
:host {
  --rewiring-yellow: rgb(249, 214, 91);
  --rewiring-yellow-darker: rgb(242, 199, 46);
  --rewiring-purple: rgb(74, 0, 195);
  --rewiring-light-purple: rgb(241, 237, 249);
}

/* these are documented as themable and should be backwards compatible if changed */
:host {
  /* Most of the text */
  --ra-embed-text-color: black;
  --ra-embed-emphasis-text-color: var(--rewiring-purple);
  /* the Calculate! button */
  --ra-embed-primary-button-background-color: var(--rewiring-yellow);
  --ra-embed-primary-button-background-hover-color: var(--rewiring-yellow-darker);
  --ra-embed-primary-button-text-color: black;
  /* card styles: */
  --ra-embed-card-background: white;
  --ra-embed-card-shadow: rgba(0,0,0,0.1) 0px 4px 50px;
  --ra-embed-card-border: 1px solid rgb(217, 217, 217);
  --ra-embed-card-border-radius: 24px;
  /* the lavender card heading: */
  --ra-embed-card-heading-background: var(--rewiring-light-purple);
  --ra-embed-card-heading-text-color: black;
  /* the rich purple card heading: */
  --ra-embed-card-heading-intense-background: var(--rewiring-purple);
  --ra-embed-card-heading-intense-text-color: white;
}

:host {
  color: var(--ra-embed-text-color);
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  font-family: "GT America", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 16px;
  line-height: 28px;
  font-weight: 400;
  margin: 0 auto; /* center on page */
  display: block; /* required for max-width to kick in */
  max-width: 1280px;
  --select-border: 1px solid #cccccc;
  --input-border: 1px solid #cccccc;
  --select-arrow: #222;
  --select-focus: blue;
}

* {
  box-sizing: border-box;
}

h1 {
  font-size: 24px;
  line-height: 40px;
  font-weight: 500;
  margin: 0;
}

h2 {
  font-size: 22px;
  line-height: 24px;
  font-weight: 500;
  margin: 0;
}

p {
  font-size: 16px;
  line-height: 28px;
  font-weight: normal;
  font-style: normal;
  margin: 0;
}

label {
  font-size: 16px;
  line-height: 28px;
  font-weight: 500;
  font-style: normal;
  margin: 0;
}

em {
  color: var(--ra-embed-emphasis-text-color);
  font-style: normal;
}
`;

export const cardStyles = css`
/* Extra small devices */
@media only screen and (max-width: 600px) {
  .card {
    min-width: 200px;
    margin: 0;
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
    margin: 24px;
    border: var(--ra-embed-card-border);
    border-radius: var(--ra-embed-card-border-radius);
    box-shadow: var(--ra-embed-card-shadow);
    background-color: var(--ra-embed-card-background);
    overflow: clip;
  }
}

@media only screen and (min-width: 1024px) {
  .card {
    margin: 48px;
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
  padding: 16px 16px 0px;
}
.card__heading {
  padding: 32px;
  background-color: var(--ra-embed-card-heading-background);
  color:  var(--ra-embed-card-heading-text-color);
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
.footer {
  margin: 16px 16px 24px 16px;
  text-align: center;
}
`;

export const tableStlyes = css`
  table, thead, tbody, tfoot, tr, th, td {
    margin: 0;
    padding: 0;
    border: none;
    border-collapse:collapse;
    border-spacing:0;
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
  td, th {
    font-size: 16px;
    line-height: 28px;
    font-weight: normal;
    text-align: left;
    padding: 16px;
    max-width: 33%;
  }
  /* Extra small devices */
  @media only screen and (max-width: 600px) {
    td, th {
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
`

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

export const formStyles = css`
/* TODO: use a CSS reset? */
button {
  appearance: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: 0;
}

input {
  padding: 8px;
  font-size: 16px;
  line-height: 28px;
  border: var(--input-border);
  border-radius: 4px;
  width: 100%;
  margin-top: 4px;
  margin-left: 0;
  margin-right: 0;
}

input:focus {
  box-shadow: 0 0 0 2px var(--select-focus) inset;
  outline: none;
}

button {
  padding: 8px;
  font-size: 16px;
  line-height: 28px;
  background-color: var(--ra-embed-primary-button-background-color);
  border: 1px solid var(--ra-embed-primary-button-background-color);
  border-radius: 4px;
  font-weight: 600;
  margin-top: 4px;
  cursor: pointer;
  color: var(--ra-embed-primary-button-text-color);
}

button:hover {
  background-color: var(--ra-embed-primary-button-background-hover-color);
}
`;
