import { FC } from 'react';
import { RemAddressResponse } from '../api/rem-types';
import { str } from '../i18n/str';
import { useTranslated } from '../i18n/use-translated';

export const ApproximateResults: FC<{ savings: RemAddressResponse }> = ({
  savings,
}) => {
  const { msg } = useTranslated();

  const costResult = savings.fuel_results.total.delta.cost;

  const card =
    costResult.percentile_80.value <= 0 ? (
      <div className="flex flex-col p-3 gap-1 rounded-lg border border-teal-300 bg-teal-100">
        <span className="text-teal-700 text-lg font-medium leading-tight">
          {msg('Likely saver!')}
        </span>
        <span className="text-teal-700 leading-normal">
          {msg(
            str`Congratulations, you’re likely to lower your energy bills by \
going electric. Residents in your area save $${Math.abs(
              Math.round(costResult.median.value),
            ).toLocaleString()}/year on average.`,
          )}
        </span>
      </div>
    ) : costResult.percentile_20.value <= 0 ? (
      <div className="flex flex-col p-3 gap-1 rounded-lg border border-teal-300 bg-teal-100">
        <span className="text-teal-700 text-lg font-medium leading-tight">
          {msg('Possible saver!')}
        </span>
        <span className="text-teal-700 leading-normal">
          {msg(
            'You might be able to lower your energy bills with this particular upgrade.',
          )}
        </span>
      </div>
    ) : (
      <div className="p-3 rounded-lg border border-grey-900 bg-white">
        <span className="text-grey-900 leading-normal">
          {msg(
            `You’re unlikely to lower your energy bills with this particular \
upgrade, but you could still reduce your carbon emissions.`,
          )}
        </span>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 bg-grey-100">
      <div>
        <h2 className="font-medium leading-normal mb-1">
          {msg('Bill and emissions impact')}
        </h2>
        <p className="text-sm leading-normal text-grey-600">
          {msg(
            `These results below are based on your region and your selected \
upgrade, not the specific characteristics of your home.`,
          )}
        </p>
      </div>
      {card}
    </div>
  );
};
