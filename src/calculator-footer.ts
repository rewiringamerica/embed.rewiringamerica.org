import { html } from 'lit';
import { msg } from '@lit/localize';

const toNbsp = (s: string) => s.replace(' ', '\u00a0');

export const CALCULATOR_FOOTER = () => html`<slot name="footer">
  <div class="calculator__footer">
    <p>
      ${toNbsp(
        msg('Calculator by', { desc: 'followed by "Rewiring America"' }),
      )}
      <a target="_blank" href="https://www.rewiringamerica.org"
        >Rewiring&nbsp;America</a
      >
      •
      <a
        target="_blank"
        href="https://content.rewiringamerica.org/view/privacy-policy.pdf"
        >${toNbsp(msg('Privacy Policy'))}</a
      >
      •
      <a
        target="_blank"
        href="https://content.rewiringamerica.org/api/terms.pdf"
        >${toNbsp(msg('Terms', { desc: 'as in terms of service' }))}</a
      >
    </p>
  </div>
</slot>`;
