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
      description:
        msg(`A heat pump is an efficient electric system that provides both \
heating and cooling by transferring heat between your home and the air \
outside, cutting energy use compared to traditional systems.`),
    },
    {
      upgrade: Upgrade.Weatherization,
      label: msg('Weatherization'),
      description:
        msg(`Weatherization includes upgrades like sealing air leaks and adding \
insulation to reduce energy loss, improve comfort, and lower heating and \
cooling bills.`),
    },
    {
      upgrade: Upgrade.HeatPumpAndWeatherization,
      label: msg('Heat pump + weatherization'),
      description:
        msg(`Combining a heat pump with weatherization (like insulation and air \
sealing) maximizes comfort and energy savings by improving your home’s \
ability to retain heated or cooled air.`),
    },
  ];

  if (includeWaterHeater) {
    result.push({
      upgrade: Upgrade.WaterHeater,
      label: msg('Heat pump water heater'),
      description:
        msg(`A heat pump water heater uses electricity to pull heat from the \
surrounding air to warm your water, using up to 70% less energy than \
conventional electric water heaters.`),
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
      <Card theme="white" padding="medium" key={option.upgrade} isFlat>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium leading-tight">{option.label}</h2>
          <p className="text-sm text-grey-600 leading-normal">
            {option.description}
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
      <div>
        <h2 className="font-medium leading-normal mb-1">
          {msg('Select upgrade')}
        </h2>
        <p className="text-sm leading-normal">
          {msg(
            'Select an upgrade to view its impact on your energy bills and emissions:',
          )}
        </p>
      </div>
      {...cards}
    </div>
  );
};
