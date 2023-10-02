import { css } from 'lit';

export const inputStyles = css`
  input {
    font-family: inherit;
    padding: var(--ra-input-padding);
    font-size: var(--ra-input-font-size);
    line-height: var(--ra-input-line-height);
    border: var(--ra-input-border);
    border-radius: var(--ra-input-border-radius);
    width: 100%;
    margin: var(--ra-input-margin);
  }

  input:focus {
    box-shadow: 0 0 0 2px var(--ra-input-focus-color) inset;
    outline: none;
  }

  input[inputmode='numeric'] {
    font-variant-numeric: tabular-nums;
  }
`;
