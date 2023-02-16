import { css, html } from 'lit';
import { questionIcon } from './icons';

// TODO: clean up variables that will be passed through in styles
// TODO: encapsulate as a real LitElement

// TODO: maybe more like https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role ?
// OR: https://lit.dev/tutorials/tooltip/
export const tooltip = (text: string, w: number, h: number, align: string = 'left') => html`
  <span data-tooltip="${text}" data-tooltip-align="${align}">${questionIcon(w, h)}</span>
`;

// Hat-tip: https://dev.to/link2twenty/native-html-tooltips-3od1
export const tooltipStyles = css`
[data-tooltip] {
  position: relative;
  cursor: help;
  --tooltip-width: 400px;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
}

[data-tooltip]::after {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  content: attr(data-tooltip);
  left: 0;
  top: calc(100% + 10px);

  width: var(--tooltip-width);
  padding: 20px;

  background-color: white;
  border-radius: 8px;
  border: 1px solid rgb(226, 226, 226);
  /* box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px; */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;

  z-index: 10; /* TODO: top layer? */
  transform: translateY(-20px);
  transition: all 150ms cubic-bezier(.25, .8, .25, 1);
}

[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateY(0);
  transition-duration: 300ms;
}

[data-tooltip-align=middle]::after {
  left: calc(-0.5 * var(--tooltip-width));
  right: inherit;
}

[data-tooltip-align=right]::after {
  left: inherit;
  right: 0;
}
`;
