import { css } from 'lit';

export const inputStyles = css`
  input {
    padding: var(--ra-input-padding);
    font-size: var(--ra-input-font-size);
    line-height: var(--ra-input-line-height);
    border: var(--ra-input-border);
    border-radius: var(--ra-input-border-radius);
    width: 100%;
    margin-top: 4px;
    margin-left: 0;
    margin-right: 0;
  }

  input:focus {
    box-shadow: 0 0 0 2px var(--ra-input-focus-color) inset;
    outline: none;
  }
`;
