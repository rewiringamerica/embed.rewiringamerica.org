import { css } from 'lit';

export const fontStyles = css`
@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Regular.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:400
}

@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Regular-Italic.woff2) format("woff2");
  font-style: italic;
  font-display: block;
  font-weight:400
}

@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Medium.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:500
}

@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Medium-Italic.woff2) format("woff2");
  font-style: italic;
  font-display: block;
  font-weight:500
}

@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Bold.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:700
}

@font-face {
  font-family: GT America;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Standard-Bold-Italic.woff2) format("woff2");
  font-style: italic;
  font-display: block;
  font-weight:700
}

@font-face {
  font-family: GT America Condensed;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Condensed-Bold.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:700
}

@font-face {
  font-family: GT America Condensed;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Condensed-Bold-Italic.woff2) format("woff2");
  font-style: italic;
  font-display: block;
  font-weight:700
}

@font-face {
  font-family: GT America Mono;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Mono-Regular.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:40
}

@font-face {
  font-family: GT America Mono;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Mono-Medium.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight:500
}

@font-face {
  font-family: GT America Mono;
  src: url(https://www.rewiringamerica.org/fonts/GT-America-Mono-Bold.woff2) format("woff2");
  font-style: normal;
  font-display: block;
  font-weight: 700
}

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
  font-weight: 400;
  margin-bottom: 24px;
  margin-top: 0px;
}
`;

export const cardStyles = css`
.card {
  margin: 24px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 4px 4px 32px #ddd;
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
  /* font-family: inherit;
   font-size: 16px;
   font-weight: inherit; */
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
