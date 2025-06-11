import { FC } from 'react';
import { Upgrade } from '../api/rem-types';
import { Card } from '../components/card';
import { MsgFn } from '../i18n/msg';
import { useTranslated } from '../i18n/use-translated';

function getOptions(includeWaterHeater: boolean, msg: MsgFn) {
  const result = [
    {
      upgrade: Upgrade.HeatPump,
      label: msg('Heat pump'),
    },
    {
      upgrade: Upgrade.Weatherization,
      label: msg('Weatherization'),
    },
    {
      upgrade: Upgrade.HeatPumpAndWeatherization,
      label: msg('Heat pump + weatherization'),
    },
  ];

  if (includeWaterHeater) {
    result.push({
      upgrade: Upgrade.WaterHeater,
      label: msg('Heat pump water heater'),
    });
  }
  return result;
}

export const UpgradeOptions: FC<{
  includeWaterHeater: boolean;
  onUpgradeSelected: (u: Upgrade, l: string) => void;
}> = ({ includeWaterHeater, onUpgradeSelected }) => {
  const { msg } = useTranslated();

  const cards = [];

  for (const option of getOptions(includeWaterHeater, msg)) {
    cards.push(
      <Card theme="white" padding="medium" key={option.upgrade}>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium leading-tight">{option.label}</h2>
          <p className="text-sm text-grey-600 leading-normal">
            Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Donec
            ultrices facilisis erat sit amet posuere. Nunc ex dolor, tincidunt
            sed efficitur eget, pharetra at sapien mauris quis.
          </p>
          <button
            className="h-9 rounded border border-grey-300 text-purple-500 font-medium"
            onClick={() => onUpgradeSelected(option.upgrade, option.label)}
          >
            {msg('View impact')}
          </button>
        </div>
      </Card>,
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-grey-100">
      <p className="leading-normal">
        {msg(
          'Select an upgrade to view its cost savings and emissions impact:',
        )}
      </p>
      {...cards}
    </div>
  );
};
