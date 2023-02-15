import { css } from 'lit';

export const baseStyles = css`
:host * {
  box-sizing: border-box;
  font-smoothing: antialiased;
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
  margin-bottom: 24px;
  margin-top: 0px;
}
`;

export const cardStyles = css`
.card {
  margin: 40px;
  padding: 40px 30px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 20px;
  box-shadow: rgba(0,0,0,0.1) 0px 4px 50px;
}
.logo {
  text-align: center;
}
`;


export const gridStyles = css`
.grid-3-2 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  align-items: end;
}
`;

export const formStyles = css`
label {
   font-size: 16px;
   line-height: 28px;
   font-weight: 500;
}

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
  line-height: 24px;
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
  background-color: var(--rewiring-yellow);
  border: 1px solid var(--rewiring-yellow);
  border-radius: 4px;
  font-weight: 600;
  margin-top: 4px;
}
`;

export const selectStyles = css`
/* // @link https://moderncss.dev/custom-select-styles-with-pure-css/ */

select {
  /*   // A reset of styles, including removing the default dropdown arrow */
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;

/*   // Stack above custom arrow */
  z-index: 1;

/*   // Remove focus outline, will add on alternate element */
  outline: none;

}

/*   // Remove dropdown arrow in IE10 & IE11
  // @link https://www.filamentgroup.com/lab/select-css.html */
select::-ms-expand {
  display: none;
}

.select {
  display: grid;
  grid-template-areas: "select";
  align-items: center;
  position: relative;

  min-width: 15ch;
  /* max-width: 30ch; */

  width: 100%;
  border: var(--select-border);
  border-radius: 4px;
  padding: 8px;

/*   font-size: 1.25rem; */
  cursor: pointer;
/*   line-height: 1.1; */

  /*   // Optional styles
  // remove for transparency */
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);

  margin-top: 4px;
}

.select select,
.select::after {
  grid-area: select;
}

/*   // Custom arrow */
.select:not(.select--multiple)::after {
  content: "";
  justify-self: end;
  width: 0.6em;
  height: 0.4em;
  background-color: var(--select-arrow);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

/* // Interim solution until :focus-within has better support */
select:focus + .focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 2px solid var(--select-focus);
  border-radius: inherit;
}

select[multiple] {
  padding-right: 0;

  /*
   * Safari will not reveal an option
   * unless the select height has room to
   * show all of it
   * Firefox and Chrome allow showing
   * a partial option
   */
  height: 6rem;

  /*
   * Experimental - styling of selected options
   * in the multiselect
   * Not supported crossbrowser
   */
  /*   //   &:not(:disabled) option {
  //     border-radius: 12px;
  //     transition: 120ms all ease-in;

  //     &:checked {
  //       background: linear-gradient(hsl(242, 61%, 76%), hsl(242, 61%, 71%));
  //       padding-left: 0.5em;
  //       color: black !important;
  //     }
  //   } */
}

select[multiple] option {
  white-space: normal;

  // Only affects Chrome
  outline-color: var(--select-focus);
}

.select--disabled {
  cursor: not-allowed;
  background-color: #eee;
  background-image: linear-gradient(to top, #ddd, #eee 33%);
}
`;

// https://dev.to/link2twenty/native-html-tooltips-3od1
// TODO: left/right align to avoid overflow
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
