import { useTranslated } from './i18n/use-translated';

const toNbsp = (s: string) => s.replace(' ', '\u00a0');

// The semantic class applies on the old embed; Tailwind classes on the new.
export const CalculatorFooter = () => {
  const { msg } = useTranslated();
  return (
    <slot name="footer">
      <div className="calculator-footer min-w-50 mt-6 text-center">
        <p className="leading-normal">
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
            href="https://www.rewiringamerica.org/privacy-policy"
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
};
