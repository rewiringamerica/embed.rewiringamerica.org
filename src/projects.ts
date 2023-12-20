import { msg } from '@lit/localize';
import { TemplateResult, svg } from 'lit';
import { ItemType } from './api/calculator-types-v1';

const RA_PURPLE = '#4a00c3';
const color = (selected: boolean) => (selected ? 'white' : RA_PURPLE);

const CLOTHES_DRYER_ICON = (
  selected: boolean,
  w: number = 20,
  h: number = 20,
) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 4C1.25 2.48122 2.48122 1.25 4 1.25H16C17.5188 1.25 18.75 2.48122 18.75 4V16C18.75 17.5188 17.5188 18.75 16 18.75H4C2.48122 18.75 1.25 17.5188 1.25 16V4ZM4 2.75C3.30964 2.75 2.75 3.30964 2.75 4V16C2.75 16.6904 3.30964 17.25 4 17.25H16C16.6904 17.25 17.25 16.6904 17.25 16V4C17.25 3.30964 16.6904 2.75 16 2.75H4Z" fill="${color(
      selected,
    )}"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.83661 9.14218C6.23341 7.20617 7.94665 5.75 10 5.75C11.9683 5.75 13.624 7.08799 14.1073 8.90404C14.0816 8.93243 14.0543 8.96198 14.0255 8.99245C13.7797 9.2523 13.4418 9.56029 13.0516 9.79441C12.6602 10.0293 12.2585 10.1648 11.8659 10.1491C11.4933 10.1342 11.0408 9.98011 10.5303 9.46969C9.79075 8.7301 8.99327 8.38415 8.19404 8.35218C7.41473 8.32101 6.72267 8.59178 6.17663 8.9194C6.05831 8.9904 5.94484 9.06525 5.83661 9.14218ZM5.89267 11.096C6.37602 12.912 8.03176 14.25 10 14.25C12.0533 14.25 13.7665 12.7939 14.1634 10.8579C14.0552 10.9348 13.9417 11.0097 13.8234 11.0807C13.2773 11.4083 12.5853 11.679 11.806 11.6479C11.0068 11.6159 10.2093 11.2699 9.46968 10.5304C8.95927 10.0199 8.50674 9.86589 8.13409 9.85098C7.74153 9.83528 7.33984 9.97077 6.94838 10.2056C6.55818 10.4398 6.22035 10.7478 5.97455 11.0076C5.94573 11.0381 5.91841 11.0676 5.89267 11.096ZM10 4.25C6.82436 4.25 4.25 6.82436 4.25 10C4.25 13.1756 6.82436 15.75 10 15.75C13.1756 15.75 15.75 13.1756 15.75 10C15.75 6.82436 13.1756 4.25 10 4.25Z" fill="${color(
      selected,
    )}"/>
    </svg>`;

const COOKING_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 4C1.25 2.48122 2.48122 1.25 4 1.25H16C17.5188 1.25 18.75 2.48122 18.75 4V16C18.75 17.5188 17.5188 18.75 16 18.75H4C2.48122 18.75 1.25 17.5188 1.25 16V4ZM4 2.75C3.30964 2.75 2.75 3.30964 2.75 4V16C2.75 16.6904 3.30964 17.25 4 17.25H16C16.6904 17.25 17.25 16.6904 17.25 16V4C17.25 3.30964 16.6904 2.75 16 2.75H4Z" fill="${color(
    selected,
  )}"/>
  <path d="M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7Z" fill="${color(
    selected,
  )}"/>
  <path d="M15 13C15 14.1046 14.1046 15 13 15C11.8954 15 11 14.1046 11 13C11 11.8954 11.8954 11 13 11C14.1046 11 15 11.8954 15 13Z" fill="${color(
    selected,
  )}"/>
  <path d="M9 13C9 14.1046 8.10457 15 7 15C5.89543 15 5 14.1046 5 13C5 11.8954 5.89543 11 7 11C8.10457 11 9 11.8954 9 13Z" fill="${color(
    selected,
  )}"/>
  <path d="M15 7C15 8.10457 14.1046 9 13 9C11.8954 9 11 8.10457 11 7C11 5.89543 11.8954 5 13 5C14.1046 5 15 5.89543 15 7Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const EV_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5" cy="11" r="1" fill="${color(selected)}"/>
  <circle cx="15" cy="11" r="1" fill="${color(selected)}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.77639 2.77016C4.24222 1.83851 5.19445 1.25 6.23607 1.25H13.7639C14.8056 1.25 15.7578 1.83851 16.2236 2.77016L17.8385 6L19 6C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H18.7092C18.7363 8.15542 18.75 8.31337 18.75 8.47214V14C18.75 15.166 18.0243 16.1625 17 16.5625V18C17 18.5523 16.5523 19 16 19H15C14.4477 19 14 18.5523 14 18V16.75H6V18C6 18.5523 5.55228 19 5 19H4C3.44772 19 3 18.5523 3 18V16.5625C1.97566 16.1625 1.25 15.166 1.25 14L1.25 8.75L1.25 8.47214L1.25 8.47141V8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H2.16147L3.77639 2.77016ZM2.75 8.75V14C2.75 14.6904 3.30964 15.25 4 15.25H5.375L5.72361 14.5528C5.893 14.214 6.23926 14 6.61803 14H13.382C13.7607 14 14.107 14.214 14.2764 14.5528L14.625 15.25H16C16.6904 15.25 17.25 14.6904 17.25 14V8.75L2.75 8.75ZM16.7865 7.25L3.21353 7.25L5.11803 3.44098C5.32977 3.0175 5.7626 2.75 6.23607 2.75H13.7639C14.2374 2.75 14.6702 3.0175 14.882 3.44098L16.7865 7.25Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const ELECTRICAL_WIRING_ICON = (
  selected: boolean,
  w: number = 20,
  h: number = 20,
) => svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 4C2.25 2.48122 3.48122 1.25 5 1.25H15C16.5188 1.25 17.75 2.48122 17.75 4V16C17.75 17.5188 16.5188 18.75 15 18.75H5C3.48122 18.75 2.25 17.5188 2.25 16V15.5H3.75V16C3.75 16.6904 4.30964 17.25 5 17.25H15C15.6904 17.25 16.25 16.6904 16.25 16V4C16.25 3.30964 15.6904 2.75 15 2.75H5C4.30964 2.75 3.75 3.30964 3.75 4V4.5H2.25V4Z" fill="${color(
  selected,
)}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 7C1.25 6.58579 1.58579 6.25 2 6.25H4C4.41421 6.25 4.75 6.58579 4.75 7C4.75 7.41421 4.41421 7.75 4 7.75H3.75L3.75 12.25H4C4.41421 12.25 4.75 12.5858 4.75 13C4.75 13.4142 4.41421 13.75 4 13.75H2C1.58579 13.75 1.25 13.4142 1.25 13C1.25 12.5858 1.58579 12.25 2 12.25H2.25L2.25 7.75H2C1.58579 7.75 1.25 7.41421 1.25 7Z" fill="${color(
  selected,
)}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.2494 4.37592C11.594 4.60568 11.6871 5.07134 11.4574 5.41598L8.90139 9.24996H12.5C12.7766 9.24996 13.0307 9.4022 13.1613 9.64606C13.2918 9.88993 13.2775 10.1858 13.124 10.416L9.79071 15.416C9.56094 15.7606 9.09529 15.8538 8.75064 15.624C8.406 15.3942 8.31287 14.9286 8.54263 14.5839L11.0986 10.75H7.5C7.2234 10.75 6.96926 10.5977 6.83875 10.3539C6.70823 10.11 6.72254 9.81407 6.87596 9.58393L10.2093 4.58393C10.4391 4.23929 10.9047 4.14616 11.2494 4.37592Z" fill="${color(
  selected,
)}"/>
</svg>`;

const HVAC_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0017 0.250124C10.2013 0.250583 10.3924 0.330514 10.5328 0.472237L19.5328 9.55541C19.7459 9.77044 19.8088 10.0925 19.6923 10.3719C19.5758 10.6513 19.3027 10.8333 19 10.8333H17.25V16.3335C17.25 16.9744 16.9954 17.5891 16.5422 18.0423C16.089 18.4955 15.4743 18.7501 14.8334 18.7501H5.16669C4.52575 18.7501 3.91106 18.4955 3.45785 18.0423C3.00463 17.5891 2.75002 16.9744 2.75002 16.3335H3.50002H4.25002C4.25002 16.5766 4.3466 16.8097 4.51851 16.9816C4.69042 17.1535 4.92357 17.2501 5.16669 17.2501H14.8334C15.0765 17.2501 15.3096 17.1535 15.4815 16.9816C15.6534 16.8097 15.75 16.5766 15.75 16.3335V10.0833C15.75 9.66908 16.0858 9.33329 16.5 9.33329H17.2011L9.99758 2.06323L2.75279 9.30802L3.52496 9.33371C3.92924 9.34716 4.25002 9.67879 4.25002 10.0833V16.3335H3.50002H2.75002V10.8088L0.975085 10.7497C0.676437 10.7398 0.41218 10.5535 0.302436 10.2756C0.192691 9.99764 0.258399 9.68108 0.469692 9.46979L9.46969 0.469792C9.61077 0.328717 9.80224 0.249665 10.0017 0.250124Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 6C10.75 5.58579 10.4142 5.25 10 5.25C9.58579 5.25 9.25 5.58579 9.25 6L9.25 11.1454C8.51704 11.4421 8 12.1607 8 13C8 14.1046 8.89543 15 10 15C11.1046 15 12 14.1046 12 13C12 12.1607 11.483 11.4421 10.75 11.1454L10.75 6Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const BATTERY_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.25V2C8 1.44772 8.44772 1 9 1H11C11.5523 1 12 1.44772 12 2V2.25H14C15.5188 2.25 16.75 3.48122 16.75 5V16C16.75 17.5188 15.5188 18.75 14 18.75H6C4.48122 18.75 3.25 17.5188 3.25 16V5C3.25 3.48122 4.48122 2.25 6 2.25H8ZM4.75 5C4.75 4.30964 5.30964 3.75 6 3.75H14C14.6904 3.75 15.25 4.30964 15.25 5V16C15.25 16.6904 14.6904 17.25 14 17.25H6C5.30964 17.25 4.75 16.6904 4.75 16V5Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 7C6.25 6.58579 6.58579 6.25 7 6.25L13 6.25C13.4142 6.25 13.75 6.58579 13.75 7C13.75 7.41421 13.4142 7.75 13 7.75L7 7.75C6.58579 7.75 6.25 7.41421 6.25 7Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 14C6.25 13.5858 6.58579 13.25 7 13.25L13 13.25C13.4142 13.25 13.75 13.5858 13.75 14C13.75 14.4142 13.4142 14.75 13 14.75L7 14.75C6.58579 14.75 6.25 14.4142 6.25 14Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75L13 9.75C13.4142 9.75 13.75 10.0858 13.75 10.5C13.75 10.9142 13.4142 11.25 13 11.25L7 11.25C6.58579 11.25 6.25 10.9142 6.25 10.5Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const SOLAR_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25754 2.89393C3.31033 2.52445 3.62677 2.25 4.00001 2.25H16C16.3732 2.25 16.6897 2.52445 16.7425 2.89393L18.7425 16.8939C18.7732 17.1092 18.709 17.3272 18.5666 17.4914C18.4241 17.6557 18.2174 17.75 18 17.75H2C1.78259 17.75 1.57587 17.6557 1.43341 17.4914C1.29096 17.3272 1.2268 17.1092 1.25754 16.8939L3.25754 2.89393ZM4.65048 3.75L2.86476 16.25H17.1352L15.3495 3.75H4.65048Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9843 17.7486C12.5709 17.7744 12.2148 17.4602 12.1889 17.0468L11.3139 3.04681C11.2881 2.6334 11.6023 2.27732 12.0157 2.25149C12.4291 2.22565 12.7852 2.53983 12.811 2.95324L13.686 16.9532C13.7119 17.3666 13.3977 17.7227 12.9843 17.7486Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.98426 2.25149C8.39767 2.27732 8.71185 2.6334 8.68601 3.04681L7.81101 17.0468C7.78518 17.4602 7.4291 17.7744 7.01569 17.7486C6.60228 17.7227 6.2881 17.3666 6.31393 16.9532L7.18894 2.95324C7.21477 2.53983 7.57085 2.22565 7.98426 2.25149Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 7C2.75 6.58579 3.08579 6.25 3.5 6.25L16.5 6.25C16.9142 6.25 17.25 6.58579 17.25 7C17.25 7.41421 16.9142 7.75 16.5 7.75L3.5 7.75C3.08579 7.75 2.75 7.41421 2.75 7Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 12C2.25 11.5858 2.58579 11.25 3 11.25L17 11.25C17.4142 11.25 17.75 11.5858 17.75 12C17.75 12.4142 17.4142 12.75 17 12.75L3 12.75C2.58579 12.75 2.25 12.4142 2.25 12Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const WATER_HEATER_ICON = (selected: boolean, w: number = 20, h: number = 20) =>
  svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99898 2.75C6.30912 2.75 5.75 3.30915 5.75 4V16C5.75 16.6909 6.30912 17.25 6.99898 17.25H13.001C13.6909 17.25 14.25 16.6909 14.25 16V4C14.25 3.30915 13.6909 2.75 13.001 2.75H6.99898ZM4.25 4C4.25 2.48171 5.4797 1.25 6.99898 1.25H13.001C14.5203 1.25 15.75 2.48171 15.75 4V16C15.75 17.5183 14.5203 18.75 13.001 18.75H6.99898C5.4797 18.75 4.25 17.5183 4.25 16V4Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 6C4.25 5.58579 4.58579 5.25 5 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H5C4.58579 6.75 4.25 6.41421 4.25 6Z" fill="${color(
    selected,
  )}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.75 10C5.75 10.4142 5.41421 10.75 5 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H5C5.41421 9.25 5.75 9.58579 5.75 10Z" fill="${color(
    selected,
  )}"/>
  <path d="M13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10Z" fill="${color(
    selected,
  )}"/>
  <path d="M13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14Z" fill="${color(
    selected,
  )}"/>
  </svg>`;

const WEATHERIZATION_ICON = (
  selected: boolean,
  w: number = 20,
  h: number = 20,
) => svg`<svg width="${w}" height="${h}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.25 3C2.25 2.58579 2.58579 2.25 3 2.25H7C7.41421 2.25 7.75 2.58579 7.75 3C7.75 3.41421 7.41421 3.75 7 3.75H3.75V7C3.75 7.41421 3.41421 7.75 3 7.75C2.58579 7.75 2.25 7.41421 2.25 7V3Z"
      fill="${color(selected)}"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17 17.75L13 17.75C12.5858 17.75 12.25 17.4142 12.25 17C12.25 16.5858 12.5858 16.25 13 16.25L16.25 16.25L16.25 13C16.25 12.5858 16.5858 12.25 17 12.25C17.4142 12.25 17.75 12.5858 17.75 13L17.75 17C17.75 17.1989 17.671 17.3897 17.5303 17.5303C17.3897 17.671 17.1989 17.75 17 17.75Z"
      fill="${color(selected)}"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.5303 2.46967C17.671 2.61032 17.75 2.80109 17.75 3L17.75 7C17.75 7.41421 17.4142 7.75 17 7.75C16.5858 7.75 16.25 7.41421 16.25 7L16.25 3.75L13 3.75C12.5858 3.75 12.25 3.41421 12.25 3C12.25 2.58579 12.5858 2.25 13 2.25L17 2.25C17.1989 2.25 17.3897 2.32902 17.5303 2.46967Z"
      fill="${color(selected)}"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.25 17L2.25 13C2.25 12.5858 2.58579 12.25 3 12.25C3.41421 12.25 3.75 12.5858 3.75 13L3.75 16.25L7 16.25C7.41421 16.25 7.75 16.5858 7.75 17C7.75 17.4142 7.41421 17.75 7 17.75L3 17.75C2.80109 17.75 2.61032 17.671 2.46967 17.5303C2.32902 17.3897 2.25 17.1989 2.25 17Z"
      fill="${color(selected)}"
    />
    <path
      d="M5.96853 9.1284L9.66555 5.80108C9.8557 5.62995 10.1444 5.62995 10.3345 5.80108L14.0315 9.1284C14.3721 9.43495 14.1553 10 13.697 10H13V14H11V11H9.00003V14H7.00003V10H6.30301C5.84477 10 5.62792 9.43495 5.96853 9.1284Z"
      fill="${color(selected)}"
    />
  </svg>
`;

type ProjectInfo = {
  label: () => string;
  shortLabel?: () => string;
  icon: (selected: boolean, w?: number, h?: number) => TemplateResult<2>;
  // The first argument for the URL must be a string literal for the correct Parcel behavior: https://parceljs.org/languages/javascript/#url-dependencies
  iconURL: URL;
  items: ItemType[];
};

export type Project =
  | 'heat_pump_clothes_dryer'
  | 'hvac'
  | 'ev'
  | 'solar'
  | 'battery'
  | 'heat_pump_water_heater'
  | 'cooking'
  | 'wiring'
  | 'weatherization_and_efficiency';

export const NO_PROJECT = '';

export const shortLabel = (p: Project) =>
  (PROJECTS[p].shortLabel ?? PROJECTS[p].label)();

/**
 * Icons, labels, and API `item` values for the various projects for which we
 * show incentives.
 */
export const PROJECTS: Record<Project, ProjectInfo> = {
  heat_pump_clothes_dryer: {
    items: ['heat_pump_clothes_dryer'],
    label: () => msg('Clothes dryer'),
    icon: CLOTHES_DRYER_ICON,
    iconURL: new URL('/static/icons/clothes-dryer.svg', import.meta.url),
  },
  hvac: {
    items: [
      'heat_pump_air_conditioner_heater',
      'geothermal_heating_installation',
    ],
    label: () => msg('Heating, ventilation & cooling'),
    shortLabel: () =>
      msg('HVAC', {
        desc: 'short label for "heating, ventilation & cooling"',
      }),
    icon: HVAC_ICON,
    iconURL: new URL('/static/icons/hvac.svg', import.meta.url),
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'electric_vehicle_charger',
    ],
    label: () => msg('Electric vehicle'),
    shortLabel: () => msg('EV', { desc: 'short label for "electric vehicle"' }),
    icon: EV_ICON,
    iconURL: new URL('/static/icons/ev.svg', import.meta.url),
  },
  solar: {
    items: ['rooftop_solar_installation'],
    label: () => msg('Solar', { desc: 'i.e. rooftop solar' }),
    icon: SOLAR_ICON,
    iconURL: new URL('/static/icons/solar.svg', import.meta.url),
  },
  battery: {
    items: ['battery_storage_installation'],
    label: () => msg('Battery storage'),
    icon: BATTERY_ICON,
    iconURL: new URL('/static/icons/battery.svg', import.meta.url),
  },
  heat_pump_water_heater: {
    items: ['heat_pump_water_heater'],
    label: () => msg('Water heater'),
    icon: WATER_HEATER_ICON,
    iconURL: new URL('/static/icons/water-heater.svg', import.meta.url),
  },
  cooking: {
    items: ['electric_stove'],
    label: () => msg('Cooking stove/range'),
    shortLabel: () =>
      msg('Cooking', { desc: 'short label for stove/range incentives' }),
    icon: COOKING_ICON,
    iconURL: new URL('/static/icons/cooking.svg', import.meta.url),
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring'],
    label: () => msg('Electrical panel & wiring'),
    shortLabel: () =>
      msg('Electrical', { desc: 'short for "electrical panel and wiring"' }),
    icon: ELECTRICAL_WIRING_ICON,
    iconURL: new URL('/static/icons/electrical-wiring.svg', import.meta.url),
  },
  weatherization_and_efficiency: {
    items: ['weatherization', 'efficiency_rebates'],
    label: () => msg('Weatherization & efficiency'),
    shortLabel: () => msg('Weatherization'),
    icon: WEATHERIZATION_ICON,
    iconURL: new URL('/static/icons/weatherization.svg', import.meta.url),
  },
};
