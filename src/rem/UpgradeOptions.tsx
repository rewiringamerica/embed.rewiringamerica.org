import { FC } from 'react';
import { Upgrade } from '../api/rem-types';
import { Card } from '../components/card';
import { MsgFn } from '../i18n/msg';
import { useTranslated } from '../i18n/use-translated';

const LABELS: { [k in Upgrade]: (m: MsgFn) => string } = {
  [Upgrade.HeatPump]: msg => msg('Heat pump'),
  [Upgrade.HeatPumpAndWeatherization]: msg => msg('Heat pump + weatherization'),
  [Upgrade.Weatherization]: msg => msg('Weatherization'),
  [Upgrade.WaterHeater]: msg => msg('Heat pump water heater'),

  [Upgrade.InternalCarrierPerformance]: msg => msg('Heat pump (RI package)'),
  [Upgrade.InternalDaikin7]: msg => msg('Heat pump (CO ducted package)'),
  [Upgrade.InternalDaikinSMulti]: msg => msg('Heat pump (CO ductless package)'),
};

const DESCRIPTIONS: { [k in Upgrade]: (m: MsgFn) => string } = {
  [Upgrade.HeatPump]: msg =>
    msg(`A heat pump is an efficient electric system that provides both \
heating and cooling by transferring heat between your home and the air \
outside, cutting energy use compared to traditional systems.`),
  [Upgrade.HeatPumpAndWeatherization]: msg =>
    msg(`Combining a heat pump with weatherization (like insulation and air \
sealing) maximizes comfort and energy savings by improving your home’s \
ability to retain heated or cooled air.`),
  [Upgrade.Weatherization]: msg =>
    msg(`Weatherization includes upgrades like sealing air leaks and adding \
insulation to reduce energy loss, improve comfort, and lower heating and \
cooling bills.`),
  [Upgrade.WaterHeater]: msg =>
    msg(`A heat pump water heater uses electricity to pull heat from the \
surrounding air to warm your water, using up to 70% less energy than \
conventional electric water heaters.`),

  // There are actually two standard packages in RI (Carrier Performance and
  // Carrier Infinity) but only the former is supported in the REM API.
  [Upgrade.InternalCarrierPerformance]: msg =>
    msg(`This is the ductless heat pump package negotiated with our preferred \
contractor(s) in Rhode Island. (Carrier Performance series)`),
  [Upgrade.InternalDaikin7]: msg =>
    msg(`This is the ducted heat pump package negotiated with our preferred \
contractor(s) in Colorado.`),
  [Upgrade.InternalDaikinSMulti]: msg =>
    msg(`This is the ductless heat pump package negotiated with our preferred \
contractor(s) in Colorado.`),
};

function getOptions(
  upgrades: Upgrade[],
  includeWaterHeater: boolean,
  msg: MsgFn,
) {
  const result = upgrades.map(upgrade => ({
    upgrade,
    label: LABELS[upgrade](msg),
    description: DESCRIPTIONS[upgrade](msg),
  }));

  if (!includeWaterHeater) {
    return result.filter(({ upgrade }) => upgrade !== Upgrade.WaterHeater);
  } else {
    return result;
  }
}

export const UpgradeOptions: FC<{
  upgrades: Upgrade[];
  includeWaterHeater: boolean;
  onUpgradeSelected: (u: Upgrade, l: string) => void;
}> = ({ upgrades, includeWaterHeater, onUpgradeSelected }) => {
  const { msg } = useTranslated();

  const cards = [];

  for (const option of getOptions(upgrades, includeWaterHeater, msg)) {
    cards.push(
      <Card theme="white" padding="small" key={option.upgrade} isFlat>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <h2 className="text-lg font-medium leading-tight">
              {option.label}
            </h2>
            <button
              // This button is NOT shown on small screens
              className="hidden sm:block text-purple-500 font-medium leading-tight hover:underline"
              onClick={() => onUpgradeSelected(option.upgrade, option.label)}
            >
              {msg('View impact')}
            </button>
          </div>
          <p className="text-sm text-grey-600 leading-normal">
            {option.description}
          </p>
          <button
            // This button is ONLY shown on small screens
            className="sm:hidden h-9 rounded border border-grey-300 text-purple-500 font-medium leading-tight"
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
