import { css } from 'lit';

export const inputStyles = css`
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
`;
