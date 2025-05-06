import { APIResponse } from './api/calculator-types-v1';
import { Card } from './card';
import { useTranslated } from './i18n/use-translated';

type Props = { response: APIResponse };

/**
 * Displays the white area at the bottom of the calculator results with logos
 * of the authorities whose incentives are displayed.
 */
export const PartnerLogos = ({ response }: Props) => {
  const { msg } = useTranslated();
  const authoritiesWithLogo = Object.entries(response.authorities).filter(
    ([, auth]) => !!auth.logo,
  );
  const partnersWithLogo = Object.entries(response.data_partners).filter(
    ([, partner]) => !!partner.logo,
  );
  const allLogos = [...authoritiesWithLogo, ...partnersWithLogo];
  if (allLogos.length === 0) {
    return <></>;
  }

  const logos = allLogos.map(([id, partner]) => (
    <img
      key={id}
      alt={partner.name}
      src={partner.logo!.src}
      width={Math.min(274, partner.logo!.width)}
      height={partner.logo!.height}
    />
  ));

  const title = msg('Brought to you in partnership with', {
    desc: 'followed by authority logos',
  });

  return (
    <Card padding="small" isFlat>
      <h2 className="text-center text-grey-700 text-lg leading-tight font-medium mb-[8px]">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center items-start gap-x-12 gap-y-4">
        {logos}
      </div>
    </Card>
  );
};
