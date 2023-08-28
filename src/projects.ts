import { TemplateResult, svg } from 'lit';
import { ItemType } from './api/calculator-types-v1';

const CLOTHES_DRYER_ICON = (
  selected: boolean,
  w: number = 48,
  h: number = 48,
) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 8C7 5.79086 8.79086 4 11 4H36.8828C39.092 4 40.8828 5.79086 40.8828 8V36.8215C40.8828 39.0307 39.092 40.8215 36.8828 40.8215H11C8.79086 40.8215 7 39.0307 7 36.8215V8Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="23.9414" cy="26.5569" r="10.5" fill="#F9D65B"/>
<circle cx="23.9746" cy="8.35742" r="1.74121" stroke="white" stroke-width="1.5"/>
<circle cx="29.8506" cy="8.35742" r="1.74121" stroke="white" stroke-width="1.5"/>
<circle cx="35.7266" cy="8.35742" r="1.74121" stroke="white" stroke-width="1.5"/>
<path d="M34.4377 27.0209C34.4402 26.9272 34.4414 26.8331 34.4414 26.7388C34.4414 26.264 34.4099 25.7966 34.3489 25.3385C34.2874 25.3766 34.2224 25.4161 34.1539 25.4569C33.5579 25.8113 32.7075 26.2512 31.6907 26.5944C29.6556 27.2814 27.0172 27.5639 24.3884 26.085C21.2645 24.3275 18.1502 24.6923 15.8708 25.4617C14.9042 25.788 14.0764 26.1901 13.4432 26.545C13.442 26.6094 13.4414 26.674 13.4414 26.7388C13.4414 27.2452 13.4773 27.7433 13.5466 28.2306C13.648 28.1658 13.7619 28.0951 13.8874 28.0204C14.4834 27.666 15.3338 27.2261 16.3506 26.8829C18.3858 26.1959 21.0241 25.9134 23.6529 27.3923C26.7768 29.1498 29.8912 28.785 32.1705 28.0156C33.0574 27.7162 33.8276 27.353 34.4377 27.0209Z" fill="#4A00C3"/>
<path d="M7.44238 12.7195H40.4492" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M11.1582 8.35742L15.4404 8.35742" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M8.78418 40.0195V42.4536C8.78418 43.0059 9.23189 43.4536 9.78418 43.4536H38.1699C38.7222 43.4536 39.1699 43.0059 39.1699 42.4536V40.0195" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 8C7 5.79086 8.79086 4 11 4H36.8828C39.092 4 40.8828 5.79086 40.8828 8V36.8215C40.8828 39.0307 39.092 40.8215 36.8828 40.8215H11C8.79086 40.8215 7 39.0307 7 36.8215V8Z" stroke="#4A00C3" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="23.9414" cy="26.5569" r="10.5" fill="#F9D65B"/>
<circle cx="23.9746" cy="8.35742" r="1.74121" stroke="#4A00C3" stroke-width="1.5"/>
<circle cx="29.8506" cy="8.35742" r="1.74121" stroke="#4A00C3" stroke-width="1.5"/>
<circle cx="35.7266" cy="8.35742" r="1.74121" stroke="#4A00C3" stroke-width="1.5"/>
<path d="M34.4377 27.0209C34.4402 26.9272 34.4414 26.8331 34.4414 26.7388C34.4414 26.264 34.4099 25.7966 34.3489 25.3385C34.2874 25.3766 34.2224 25.4161 34.1539 25.4569C33.5579 25.8113 32.7075 26.2512 31.6907 26.5944C29.6556 27.2814 27.0172 27.5639 24.3884 26.085C21.2645 24.3275 18.1502 24.6923 15.8708 25.4617C14.9042 25.788 14.0764 26.1901 13.4432 26.545C13.442 26.6094 13.4414 26.674 13.4414 26.7388C13.4414 27.2452 13.4773 27.7433 13.5466 28.2306C13.648 28.1658 13.7619 28.0951 13.8874 28.0204C14.4834 27.666 15.3338 27.2261 16.3506 26.8829C18.3858 26.1959 21.0241 25.9134 23.6529 27.3923C26.7768 29.1498 29.8912 28.785 32.1705 28.0156C33.0574 27.7162 33.8276 27.353 34.4377 27.0209Z" fill="#4A00C3"/>
<path d="M7.44238 12.7195H40.4492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M11.1582 8.35742L15.4404 8.35742" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M8.78418 40.0195V42.4536C8.78418 43.0059 9.23189 43.4536 9.78418 43.4536H38.1699C38.7222 43.4536 39.1699 43.0059 39.1699 42.4536V40.0195" stroke="#4A00C3" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

const COOKING_ICON = (selected: boolean, w: number = 48, h: number = 48) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30.8809" cy="15.8267" r="5.99316" fill="#F9D65B"/>
<circle cx="17.1914" cy="28.7786" r="5.99316" fill="#F9D65B"/>
<rect x="7" y="7" width="33.6" height="33.6" rx="2" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="14.8563" cy="15.8267" r="3.65801" stroke="white" stroke-width="1.5"/>
<circle cx="32.1975" cy="28.6301" r="3.65801" transform="rotate(-180 32.1975 28.6301)" stroke="white" stroke-width="1.5"/>
<path d="M32.0606 12.4316C33.5402 12.8755 34.5156 14.181 34.5156 15.8686C34.5156 17.6363 33.4768 18.9 32.0606 19.3439" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.7001 12.4316C28.2205 12.8755 27.2451 14.181 27.2451 15.8686C27.2451 17.6363 28.284 18.9 29.7001 19.3439" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3711 25.5276C19.8507 25.9715 20.8262 27.277 20.8262 28.9646C20.8262 30.7322 19.7873 31.996 18.3711 32.4398" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M16.0107 25.5276C14.5311 25.9715 13.5557 27.277 13.5557 28.9646C13.5557 30.7322 14.5945 31.996 16.0107 32.4398" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M21.2051 37.5476H17.8848" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.3945 37.5476H24.1768" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.7148 37.5476H28.4971" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30.8809" cy="15.8267" r="5.99316" fill="#F9D65B"/>
<circle cx="17.1914" cy="28.7786" r="5.99316" fill="#F9D65B"/>
<rect x="7" y="7" width="33.6" height="33.6" rx="2" stroke="#4A00C3" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="14.8563" cy="15.8267" r="3.65801" stroke="#4A00C3" stroke-width="1.5"/>
<circle cx="32.1975" cy="28.6301" r="3.65801" transform="rotate(-180 32.1975 28.6301)" stroke="#4A00C3" stroke-width="1.5"/>
<path d="M32.0606 12.4316C33.5402 12.8755 34.5156 14.181 34.5156 15.8686C34.5156 17.6363 33.4768 18.9 32.0606 19.3439" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.7001 12.4316C28.2205 12.8755 27.2451 14.181 27.2451 15.8686C27.2451 17.6363 28.284 18.9 29.7001 19.3439" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3711 25.5276C19.8507 25.9715 20.8262 27.277 20.8262 28.9646C20.8262 30.7322 19.7873 31.996 18.3711 32.4398" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M16.0107 25.5276C14.5311 25.9715 13.5557 27.277 13.5557 28.9646C13.5557 30.7322 14.5945 31.996 16.0107 32.4398" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M21.2051 37.5476H17.8848" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.3945 37.5476H24.1768" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.7148 37.5476H28.4971" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const EV_ICON = (selected: boolean, w: number = 48, h: number = 48) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.9531 27.5291H31.2773" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M5.18759 17.8668L3.33773 20.3885C3.32514 20.4057 3.31836 20.4264 3.31836 20.4477V29.5154C3.31836 30.6199 4.21379 31.5154 5.31836 31.5154H28.5744C29.679 31.5154 30.5744 30.6199 30.5744 29.5154V20.4443C30.5744 20.4251 30.5689 20.4064 30.5586 20.3903L28.9375 17.8645C28.9346 17.8601 28.9321 17.8554 28.93 17.8505L26.4672 12.2008C26.1493 11.4715 25.4294 11 24.6339 11H9.4933C8.69771 11 7.97778 11.4715 7.65989 12.2009L5.19863 17.8476C5.19568 17.8544 5.19197 17.8608 5.18759 17.8668Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.0459 31.2328L11.1944 29.051C11.5704 28.6693 12.0837 28.4543 12.6195 28.4543H21.3826C21.913 28.4543 22.4218 28.6651 22.7968 29.0402L24.9894 31.2328" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M4.5166 31.6604V33.8491C4.5166 34.9537 5.41203 35.8491 6.5166 35.8491H6.74786C7.85243 35.8491 8.74786 34.9537 8.74786 33.8491V31.6604" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.1191 31.6604V33.8491C25.1191 34.9537 26.0146 35.8491 27.1191 35.8491H27.3504C28.455 35.8491 29.3504 34.9537 29.3504 33.8491V31.6604" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="8.23436" cy="23.7954" r="1.47264" stroke="white" stroke-width="1.5"/>
<circle cx="25.7588" cy="23.7954" r="1.47264" stroke="white" stroke-width="1.5"/>
<path d="M5.28613 18.1963C5.55946 18.2304 21.0434 18.2105 28.7514 18.1963" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M4.51602 16.1016V18.2577C4.51602 18.5338 4.29216 18.7577 4.01602 18.7577H1.5C1.22386 18.7577 1 18.5338 1 18.2577V16.1016C1 15.8254 1.22386 15.6016 1.5 15.6016H4.01602C4.29216 15.6016 4.51602 15.8254 4.51602 16.1016Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M33.0355 16.1016V18.2577C33.0355 18.5338 32.8117 18.7577 32.5355 18.7577H30.0195C29.7434 18.7577 29.5195 18.5338 29.5195 18.2577V16.1016C29.5195 15.8254 29.7434 15.6016 30.0195 15.6016H32.5355C32.8117 15.6016 33.0355 15.8254 33.0355 16.1016Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M41.6997 25.7263L40.2917 28.9081C40.2624 28.9742 40.3108 29.0486 40.3831 29.0486H42.5813C42.6535 29.0486 42.7019 29.1228 42.6728 29.1889L41.3072 32.288" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<mask id="path-12-inside-1_7406_47306" fill="white">
<rect x="38.4561" y="19.5242" width="6.05053" height="4.09731" rx="1"/>
</mask>
<rect x="38.4561" y="19.5242" width="6.05053" height="4.09731" rx="1" stroke="#4A00C3" stroke-width="3" mask="url(#path-12-inside-1_7406_47306)"/>
<path d="M37 20.5C37 19.7777 37.1423 19.0625 37.4187 18.3952C37.6951 17.7279 38.1002 17.1216 38.6109 16.6109C39.1216 16.1002 39.728 15.6951 40.3952 15.4187C41.0625 15.1423 41.7777 15 42.5 15C43.2223 15 43.9375 15.1423 44.6048 15.4187C45.272 15.6951 45.8784 16.1002 46.3891 16.6109C46.8998 17.1216 47.3049 17.7279 47.5813 18.3952C47.8577 19.0625 48 19.7777 48 20.5L48 21.5L42.5 21.5L37 21.5L37 20.5Z" fill="#F9D65B"/>
<rect x="37" y="36" width="${w}" height="${h}" transform="rotate(-90 37 36)" fill="#F9D65B"/>
<path d="M42.6997 25.8384L41.2917 29.0202C41.2624 29.0863 41.3108 29.1607 41.3831 29.1607H43.5813C43.6535 29.1607 43.7019 29.2349 43.6728 29.301L42.3072 32.4001" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<rect x="40" y="20" width="5" height="3" rx="1" fill="#4A00C3"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.9531 27.5291H31.2773" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M5.18759 17.8668L3.33773 20.3885C3.32514 20.4057 3.31836 20.4264 3.31836 20.4477V29.5154C3.31836 30.6199 4.21379 31.5154 5.31836 31.5154H28.5744C29.679 31.5154 30.5744 30.6199 30.5744 29.5154V20.4443C30.5744 20.4251 30.5689 20.4064 30.5586 20.3903L28.9375 17.8645C28.9346 17.8601 28.9321 17.8554 28.93 17.8505L26.4672 12.2008C26.1493 11.4715 25.4294 11 24.6339 11H9.4933C8.69771 11 7.97778 11.4715 7.65989 12.2009L5.19863 17.8476C5.19568 17.8544 5.19197 17.8608 5.18759 17.8668Z" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.0459 31.2328L11.1944 29.051C11.5704 28.6693 12.0837 28.4543 12.6195 28.4543H21.3826C21.913 28.4543 22.4218 28.6651 22.7968 29.0402L24.9894 31.2328" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M4.5166 31.6604V33.8491C4.5166 34.9537 5.41203 35.8491 6.5166 35.8491H6.74786C7.85243 35.8491 8.74786 34.9537 8.74786 33.8491V31.6604" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M25.1191 31.6604V33.8491C25.1191 34.9537 26.0146 35.8491 27.1191 35.8491H27.3504C28.455 35.8491 29.3504 34.9537 29.3504 33.8491V31.6604" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="8.23436" cy="23.7954" r="1.47264" stroke="#4A00C3" stroke-width="1.5"/>
<circle cx="25.7588" cy="23.7954" r="1.47264" stroke="#4A00C3" stroke-width="1.5"/>
<path d="M5.28613 18.1963C5.55946 18.2304 21.0434 18.2105 28.7514 18.1963" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M4.51602 16.1016V18.2577C4.51602 18.5338 4.29216 18.7577 4.01602 18.7577H1.5C1.22386 18.7577 1 18.5338 1 18.2577V16.1016C1 15.8254 1.22386 15.6016 1.5 15.6016H4.01602C4.29216 15.6016 4.51602 15.8254 4.51602 16.1016Z" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M33.0355 16.1016V18.2577C33.0355 18.5338 32.8117 18.7577 32.5355 18.7577H30.0195C29.7434 18.7577 29.5195 18.5338 29.5195 18.2577V16.1016C29.5195 15.8254 29.7434 15.6016 30.0195 15.6016H32.5355C32.8117 15.6016 33.0355 15.8254 33.0355 16.1016Z" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M41.6997 25.7263L40.2917 28.9081C40.2624 28.9742 40.3108 29.0486 40.3831 29.0486H42.5813C42.6535 29.0486 42.7019 29.1228 42.6728 29.1889L41.3072 32.288" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M37 20.5C37 19.7777 37.1423 19.0625 37.4187 18.3952C37.6951 17.728 38.1002 17.1216 38.6109 16.6109C39.1216 16.1002 39.7279 15.6951 40.3952 15.4187C41.0625 15.1423 41.7777 15 42.5 15C43.2223 15 43.9375 15.1423 44.6048 15.4187C45.272 15.6951 45.8784 16.1002 46.3891 16.6109C46.8998 17.1216 47.3049 17.728 47.5813 18.3952C47.8577 19.0625 48 19.7777 48 20.5L48 22.5L42.5 22.5L37 22.5L37 20.5Z" fill="#F9D65B"/>
<rect x="37" y="36" width="${w}" height="${h}" transform="rotate(-90 37 36)" fill="#F9D65B"/>
<path d="M42.6997 25.8384L41.2917 29.0202C41.2624 29.0863 41.3108 29.1607 41.3831 29.1607H43.5813C43.6535 29.1607 43.7019 29.2349 43.6728 29.301L42.3072 32.4001" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<rect x="40" y="20" width="5" height="3" rx="1" fill="#4A00C3"/>
</svg>`;

const ELECTRICAL_WIRING_ICON = (
  selected: boolean,
  w: number = 48,
  h: number = 48,
) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_7406_47248" fill="white">
<rect x="8" y="2" width="32.4729" height="38.2202" rx="1"/>
</mask>
<rect x="8" y="2" width="32.4729" height="38.2202" rx="1" stroke="white" stroke-width="3" stroke-linejoin="round" mask="url(#path-1-inside-1_7406_47248)"/>
<mask id="path-2-inside-2_7406_47248" fill="white">
<rect x="11.6484" y="5.10156" width="24.9935" height="31.6525" rx="1"/>
</mask>
<rect x="11.6484" y="5.10156" width="24.9935" height="31.6525" rx="1" stroke="white" stroke-width="3" stroke-linejoin="round" mask="url(#path-2-inside-2_7406_47248)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.8977 9.52383C24.7613 9.29788 24.5162 9.16024 24.2523 9.16138C23.9884 9.16253 23.7445 9.3023 23.6101 9.52943L16.2198 22.0186C16.0826 22.2504 16.0803 22.538 16.2137 22.772C16.3472 23.006 16.5958 23.1505 16.8652 23.1505H31.7934C32.0639 23.1505 32.3135 23.0048 32.4465 22.7692C32.5795 22.5336 32.5753 22.2446 32.4355 22.013L24.8977 9.52383Z" fill="#F9D65B"/>
<path d="M24.2998 15.4709L23.317 17.6918C23.2878 17.7579 23.3362 17.8323 23.4085 17.8323H24.8821C24.9543 17.8323 25.0027 17.9065 24.9736 17.9726L24.0208 20.1347" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3457 26.9438H30.3135" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M36.0439 9.70142L36.0439 13.4954" stroke="white" stroke-width="3" stroke-linecap="round"/>
<path d="M36.0439 26.9438L36.0439 30.7378" stroke="white" stroke-width="3" stroke-linecap="round"/>
<path d="M18.3457 29.5327H30.3135" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3457 32.1216H30.3135" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M20.7188 39.6902L20.7187 45.415" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.9932 39.6902L24.9932 45.415" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.3486 39.6902L29.3486 45.415" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_4926_40650" fill="white">
<rect x="8" y="2" width="32.4729" height="38.2202" rx="1"/>
</mask>
<rect x="8" y="2" width="32.4729" height="38.2202" rx="1" stroke="#4A00C3" stroke-width="3" stroke-linejoin="round" mask="url(#path-1-inside-1_4926_40650)"/>
<mask id="path-2-inside-2_4926_40650" fill="white">
<rect x="11.6484" y="5.10156" width="24.9935" height="31.6525" rx="1"/>
</mask>
<rect x="11.6484" y="5.10156" width="24.9935" height="31.6525" rx="1" stroke="#4A00C3" stroke-width="3" stroke-linejoin="round" mask="url(#path-2-inside-2_4926_40650)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.8977 9.52383C24.7613 9.29788 24.5162 9.16024 24.2523 9.16138C23.9884 9.16253 23.7445 9.3023 23.6101 9.52943L16.2198 22.0186C16.0826 22.2504 16.0803 22.538 16.2137 22.772C16.3472 23.006 16.5958 23.1505 16.8652 23.1505H31.7934C32.0639 23.1505 32.3135 23.0048 32.4465 22.7692C32.5795 22.5336 32.5753 22.2446 32.4355 22.013L24.8977 9.52383Z" fill="#F9D65B"/>
<path d="M24.2998 15.4709L23.317 17.6918C23.2878 17.7579 23.3362 17.8323 23.4085 17.8323H24.8821C24.9543 17.8323 25.0027 17.9065 24.9736 17.9726L24.0208 20.1347" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3457 26.9438H30.3135" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M36.0439 9.70142L36.0439 13.4954" stroke="#4A00C3" stroke-width="3" stroke-linecap="round"/>
<path d="M36.0439 26.9438L36.0439 30.7378" stroke="#4A00C3" stroke-width="3" stroke-linecap="round"/>
<path d="M18.3457 29.5327H30.3135" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M18.3457 32.1216H30.3135" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M20.7188 39.6902L20.7187 45.415" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.9932 39.6902L24.9932 45.415" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.3486 39.6902L29.3486 45.415" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const HVAC_ICON = (selected: boolean, w: number = 48, h: number = 48) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.23251 27.5454H9.64975C9.70498 27.5454 9.74975 27.5901 9.74975 27.6454V42.8233C9.74975 42.8786 9.79452 42.9233 9.84975 42.9233H38.6664C38.7217 42.9233 38.7664 42.8786 38.7664 42.8233V27.6454C38.7664 27.5901 38.8112 27.5454 38.8664 27.5454H45.4233C45.511 27.5454 45.5562 27.4405 45.496 27.3767L24.4351 5.07685C24.3957 5.03512 24.3293 5.03506 24.2898 5.07673L3.15993 27.3766C3.09954 27.4403 3.14472 27.5454 3.23251 27.5454Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="24.3276" cy="33.0674" r="6.45753" fill="#F9D65B"/>
<rect x="21.1367" y="12.3733" width="6.19574" height="20.9033" rx="3.09787" fill="#F9D65B"/>
<path d="M22.4971 18.1978H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22.4971 20.7551H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.4111 22.3945H26.0633" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.4111 25.4382H26.0633" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22.4971 23.4302H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.3555 15.7881V31.0727" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="24.3277" cy="33.0674" r="1.68998" stroke="#4A00C3" stroke-width="1.5"/>
</svg>
`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.23251 27.5454H9.64975C9.70498 27.5454 9.74975 27.5901 9.74975 27.6454V42.8233C9.74975 42.8786 9.79452 42.9233 9.84975 42.9233H38.6664C38.7217 42.9233 38.7664 42.8786 38.7664 42.8233V27.6454C38.7664 27.5901 38.8112 27.5454 38.8664 27.5454H45.4233C45.511 27.5454 45.5562 27.4405 45.496 27.3767L24.4351 5.07685C24.3957 5.03512 24.3293 5.03506 24.2898 5.07673L3.15993 27.3766C3.09954 27.4403 3.14472 27.5454 3.23251 27.5454Z" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="24.3276" cy="33.0674" r="6.45753" fill="#F9D65B"/>
<rect x="21.1367" y="12.3733" width="6.19574" height="20.9033" rx="3.09787" fill="#F9D65B"/>
<path d="M22.4971 18.1978H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22.4971 20.7551H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.4111 22.3945H26.0633" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.4111 25.4382H26.0633" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22.4971 23.4302H24.1492" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M24.3555 15.7881V31.0727" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="24.3277" cy="33.0674" r="1.68998" stroke="#4A00C3" stroke-width="1.5"/>
</svg>
`;

const RENEWABLES_ICON = (selected: boolean, w: number = 48, h: number = 48) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.8267 17.6152H19.4862C19.2325 17.6152 19.019 17.8052 18.9896 18.0572L17.9099 27.2954C17.8752 27.5925 18.1074 27.8534 18.4066 27.8534H28.3525C28.6398 27.8534 28.868 27.6118 28.8517 27.325L28.3259 18.0868C28.3108 17.8221 28.0918 17.6152 27.8267 17.6152Z" fill="#F9D65B"/>
<path d="M11.2 9H36.4L40.6 38.4H7L11.2 9Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M28.1312 9L29.9687 38.4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M19.4688 9L17.6312 38.4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10.1494 17.3999L37.4494 17.3999" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.09961 27.8999L38.4996 27.8999" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.8267 17.6152H19.4862C19.2325 17.6152 19.019 17.8052 18.9896 18.0572L17.9099 27.2954C17.8752 27.5925 18.1074 27.8534 18.4066 27.8534H28.3525C28.6398 27.8534 28.868 27.6118 28.8517 27.325L28.3259 18.0868C28.3108 17.8221 28.0918 17.6152 27.8267 17.6152Z" fill="#F9D65B"/>
<path d="M11.2 9H36.4L40.6 38.4H7L11.2 9Z" stroke="#4A00C3" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M28.1312 9L29.9687 38.4" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M19.4688 9L17.6312 38.4" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M10.1494 17.3999L37.4494 17.3999" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M9.09961 27.8999L38.4996 27.8999" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const WATER_HEATER_ICON = (selected: boolean, w: number = 48, h: number = 48) =>
  selected
    ? svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 5C17 3.34315 18.3431 2 20 2H30C31.6569 2 33 3.34315 33 5V18H17V5Z" fill="#F9D65B"/>
<path d="M15 21.9551H16.8827" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M17.1582 5.99999C17.1582 3.79086 18.9476 2.00001 21.1568 2C22.2032 2 23.4332 2 24.8205 2C26.3858 2 27.8078 2 29.0114 2C31.2205 2.00001 33.0099 3.79087 33.0099 6V42.2584C33.0099 43.8511 32.0594 45.2909 30.5135 45.6742C29.0742 46.0312 27.099 46.3738 24.8205 46.3738C22.5894 46.3738 20.7652 46.0453 19.4572 45.6965C18.0081 45.3101 17.1582 43.9384 17.1582 42.4386V5.99999Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<rect x="23.9629" y="21.0376" width="2.26537" height="5.83466" rx="1.13268" stroke="white" stroke-width="1.5"/>
<rect x="23.332" y="6.62207" width="3.39174" height="6.67851" rx="1.25" stroke="#4A00C3" stroke-width="1.5"/>
<rect x="23.9629" y="31.4443" width="2.26537" height="5.83466" rx="1.13268" stroke="white" stroke-width="1.5"/>
<circle cx="25" cy="42" r="1" fill="white"/>
</svg>`
    : svg`<svg width="${w}" height="${h}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 5C17 3.34315 18.3431 2 20 2H30C31.6569 2 33 3.34315 33 5V18H17V5Z" fill="#F9D65B"/>
<path d="M15 21.9551H16.8827" stroke="#4A00C3" stroke-width="1.5" stroke-linecap="round"/>
<path d="M17.1582 5.99999C17.1582 3.79086 18.9476 2.00001 21.1568 2C22.2032 2 23.4332 2 24.8205 2C26.3858 2 27.8078 2 29.0114 2C31.2205 2.00001 33.0099 3.79087 33.0099 6V42.2584C33.0099 43.8511 32.0594 45.2909 30.5135 45.6742C29.0742 46.0312 27.099 46.3738 24.8205 46.3738C22.5894 46.3738 20.7652 46.0453 19.4572 45.6965C18.0081 45.3101 17.1582 43.9384 17.1582 42.4386V5.99999Z" stroke="#4A00C3" stroke-width="1.5" stroke-linejoin="round"/>
<rect x="23.9629" y="21.0376" width="2.26537" height="5.83466" rx="1.13268" stroke="#4A00C3" stroke-width="1.5"/>
<rect x="23.332" y="6.62207" width="3.39174" height="6.67851" rx="1.25" stroke="#4A00C3" stroke-width="1.5"/>
<rect x="23.9629" y="31.4443" width="2.26537" height="5.83466" rx="1.13268" stroke="#4A00C3" stroke-width="1.5"/>
<circle cx="25" cy="42" r="1" fill="#4A00C3"/>
</svg>`;

type ProjectInfo = {
  label: string;
  shortLabel?: string;
  icon: (selected: boolean, w?: number, h?: number) => TemplateResult<2>;
  items: ItemType[];
};

export type Project =
  | 'heat_pump_clothes_dryer'
  | 'hvac'
  | 'ev'
  | 'renewables'
  | 'heat_pump_water_heater'
  | 'cooking'
  | 'wiring';

export const PROJECTS: Record<Project, ProjectInfo> = {
  heat_pump_clothes_dryer: {
    items: ['heat_pump_clothes_dryer'],
    label: 'Clothes dryer',
    icon: CLOTHES_DRYER_ICON,
  },
  hvac: {
    items: [
      'heat_pump_air_conditioner_heater',
      'geothermal_heating_installation',
    ],
    label: 'Heating, ventilation & cooling',
    shortLabel: 'HVAC',
    icon: HVAC_ICON,
  },
  ev: {
    items: [
      'new_electric_vehicle',
      'used_electric_vehicle',
      'electric_vehicle_charger',
    ],
    label: 'Electric vehicle',
    shortLabel: 'EV',
    icon: EV_ICON,
  },
  renewables: {
    items: ['rooftop_solar_installation', 'battery_storage_installation'],
    label: 'Renewables',
    icon: RENEWABLES_ICON,
  },
  heat_pump_water_heater: {
    items: ['heat_pump_water_heater'],
    label: 'Water heater',
    icon: WATER_HEATER_ICON,
  },
  cooking: {
    items: ['electric_stove'],
    label: 'Cooking stove/range',
    shortLabel: 'Cooking',
    icon: COOKING_ICON,
  },
  wiring: {
    items: ['electric_panel', 'electric_wiring'],
    label: 'Electrical wiring',
    shortLabel: 'Electrical',
    icon: ELECTRICAL_WIRING_ICON,
  },
};
