import { css } from 'lit';

export const baseStyles = css`
:host * {
  box-sizing: border-box;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
}

:host {
  font-family: "GT America", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 24px;
  --select-border: 1px solid #cccccc;
  --input-border: 1px solid #cccccc;
  --select-arrow: #222;
  --select-focus: blue;
  --rewiring-yellow: rgb(249, 214, 91);
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
`;

export const cardStyles = css`
.card {
  margin: 48px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 24px;
  box-shadow: rgba(0,0,0,0.1) 0px 4px 50px;
  background-color: white;
  overflow: clip;
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
.card-title {
  padding: 32px;
  background-color: rgb(241, 237, 249);
}
.card-title--intense {
  padding: 32px;
  background-color: rgb(74, 0, 195);
  color: white;
}
.card-title__icon-grid {
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 16px;
  align-items: start;
}
.logo {
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
  }
  th {
    font-weight: 500;
    text-transform: uppercase;
  }
  .cell--right {
    text-align: right;
  }
`

export const gridStyles = css`
.grid-3-2 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  align-items: end;
}
`;

export const formStyles = css`
/* TODO: use a CSS reset */
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
  outline: 2px solid var(--select-focus);
  outline-radius: 4px;
}

button {
  padding: 8px;
  font-size: 16px;
  line-height: 28px;
  /* TODO: primary-action-color */
  background-color: var(--rewiring-yellow);
  border: 1px solid var(--rewiring-yellow);
  border-radius: 4px;
  font-weight: 600;
  margin-top: 4px;
  cursor: pointer;
}

button:hover {
  /* TODO: use a filter to darken this based on the primary-action-color */
  background-color: rgb(242, 199, 46);
}
`;
