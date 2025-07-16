import clsx from 'clsx';
import { FC, useId } from 'react';
import { Upgrade } from '../api/rem-types';
import { RadioButton } from '../components/icons';
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

export function getLabelForUpgrade(u: Upgrade, msg: MsgFn) {
  return LABELS[u](msg);
}

export const UpgradeOptions: FC<{
  upgrades: Upgrade[];
  includeWaterHeater: boolean;
  selectedUpgrade: Upgrade | null;
  onUpgradeSelected: (u: Upgrade) => void;
}> = ({ upgrades, includeWaterHeater, selectedUpgrade, onUpgradeSelected }) => {
  const { msg } = useTranslated();

  const cards = [];

  for (const upgrade of upgrades) {
    const checked = selectedUpgrade === upgrade;
    const disabled = upgrade === Upgrade.WaterHeater && !includeWaterHeater;
    const labelId = useId();
    const descriptionId = useId();

    cards.push(
      <button
        key={upgrade}
        className={clsx(
          'flex flex-col p-3 gap-2 text-left',
          'first:rounded-t-xl last:rounded-b-xl',
          'border-b border-grey-200 last:border-0',
          disabled && 'opacity-35',
          checked ? 'bg-purple-100' : 'bg-white',
        )}
        type="button"
        onClick={() => !disabled && onUpgradeSelected(upgrade)}
        tabIndex={disabled ? -1 : 0}
        value={upgrade}
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
      >
        <div className="flex justify-between">
          <h2 id={labelId} className="text-lg font-medium leading-tight">
            {getLabelForUpgrade(upgrade, msg)}
          </h2>
          <RadioButton w={22} h={22} selected={checked} />
        </div>
        <p id={descriptionId} className="text-sm text-grey-600 leading-normal">
          {DESCRIPTIONS[upgrade](msg)}
        </p>
      </button>,
    );
  }

  const groupLabelId = useId();
  const groupDescriptionId = useId();
  return (
    <div
      className="flex flex-col gap-4 p-4 bg-grey-100"
      role="radiogroup"
      aria-required={true}
      aria-labelledby={groupLabelId}
      aria-describedby={groupDescriptionId}
    >
      <div>
        <h2 id={groupLabelId} className="font-medium leading-normal mb-1">
          {msg('Select upgrade')}
        </h2>
        <p id={groupDescriptionId} className="text-sm leading-normal">
          {msg(
            'Select an upgrade to view its impact on your energy bills and emissions:',
          )}
        </p>
      </div>
      <div className="flex flex-col border border-grey-200 rounded-xl">
        {...cards}
      </div>
    </div>
  );
};
