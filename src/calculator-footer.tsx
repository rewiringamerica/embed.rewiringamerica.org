import { msg } from '@lit/localize';

const toNbsp = (s: string) => s.replace(' ', '\u00a0');

export const CalculatorFooter = () => (
  <slot name="footer">
    <div className="calculator-footer">
      <p>
        {toNbsp(
          msg('Calculator by', { desc: 'followed by "Rewiring America"' }),
        )}{' '}
        <a
          className="underline text-color-action-primary"
          target="_blank"
          href="https://www.rewiringamerica.org"
        >
          Rewiring&nbsp;America
        </a>
        {' • '}
        <a
          className="underline text-color-action-primary"
          target="_blank"
          href="https://content.rewiringamerica.org/view/privacy-policy.pdf"
        >
          {toNbsp(msg('Privacy Policy'))}
        </a>
        {' • '}
        <a
          className="underline text-color-action-primary"
          target="_blank"
          href="https://content.rewiringamerica.org/api/terms.pdf"
        >
          {toNbsp(msg('Terms', { desc: 'as in terms of service' }))}
        </a>
      </p>
    </div>
  </slot>
);
