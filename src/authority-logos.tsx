import { APIResponse } from './api/calculator-types-v1';
import { useTranslated } from './i18n/use-translated';

type Props = { response: APIResponse };

/**
 * Displays the white area at the bottom of the calculator results with logos
 * of the authorities whose incentives are displayed.
 */
export const AuthorityLogos = ({ response }: Props) => {
  const { msg } = useTranslated();
  const authoritiesWithLogo = Object.entries(response.authorities).filter(
    ([, auth]) => !!auth.logo,
  );
  if (authoritiesWithLogo.length === 0) {
    return <></>;
  }

  const logos = authoritiesWithLogo.map(([id, auth]) => (
    <img
      key={id}
      alt={auth.name}
      src={auth.logo!.src}
      width={auth.logo!.width}
      height={auth.logo!.height}
    />
  ));

  const title = msg('Incentive data brought to you by', {
    desc: 'followed by authority logos',
  });

  return (
    <div className="w-full max-w-7xl bg-white">
      <h2 className="mx-6 mt-8 sm:mt-12 mb-12 sm:mb-16 text-center text-grey-700 text-xl sm:text-3xl leading-tight font-medium">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center items-start gap-16 mb-20">
        {logos}
      </div>
    </div>
  );
};
