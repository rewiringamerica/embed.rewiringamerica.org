import { useTranslated } from './i18n/use-translated';

const toNbsp = (s: string) => s.replace(' ', '\u00a0');

export const FooterCopy = () => {
  const { msg } = useTranslated();
  return (
    <p>
      {toNbsp(msg('Calculator by', { desc: 'followed by "Rewiring America"' }))}{' '}
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
  );
};

export const CalculatorFooter = () => (
  <slot name="footer">
    <div className="min-w-50 mt-4 text-center leading-normal">
      <FooterCopy />
    </div>
  </slot>
);
