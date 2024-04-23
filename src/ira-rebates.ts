import { str } from './i18n/str';
import { MsgFn } from './i18n/use-translated';
import { Project } from './projects';

export type IRARebate = {
  project: Project;
  headline: string;
  program: string;
  description: string;
  url: string;
};

const hearRebates: {
  project: Project;
  getHeadline: (msg: MsgFn) => string;
  maxAmount: number;
}[] = [
  {
    project: 'wiring',
    getHeadline: msg => msg('Discount off an electric panel'),
    maxAmount: 4000,
  },
  {
    project: 'cooking',
    getHeadline: msg => msg('Discount off an electric stove'),
    maxAmount: 840,
  },
  {
    project: 'wiring',
    getHeadline: msg => msg('Discount off electric wiring'),
    maxAmount: 2500,
  },
  {
    project: 'heat_pump_water_heater',
    getHeadline: msg => msg('Discount off a heat pump water heater'),
    maxAmount: 1750,
  },
  {
    project: 'hvac',
    getHeadline: msg => msg('Discount off a heat pump'),
    maxAmount: 8000,
  },
  {
    project: 'heat_pump_clothes_dryer',
    getHeadline: msg => msg('Discount off a heat pump clothes dryer'),
    maxAmount: 840,
  },
  {
    project: 'weatherization_and_efficiency',
    getHeadline: msg => msg('Discount off weatherization'),
    maxAmount: 1600,
  },
];

/* @ts-expect-error(6133) we will condition logic on state in future. */
export function getRebatesFor(state: string, msg: MsgFn): IRARebate[] {
  const disclaimerText = msg(
    'However, rebates will be implemented differently in each state, so we cannot guarantee final amounts, eligibility, or timeline.',
  );
  return hearRebates.map(rebate => ({
    project: rebate.project,
    headline: rebate.getHeadline(msg),
    program: msg('Federal Home Electrification and Appliance Rebates (HEAR)'),
    description:
      msg(
        str`The federal guidelines allot a discount of up to $${rebate.maxAmount.toLocaleString()}.`,
      ) +
      ' ' +
      disclaimerText,
    url: msg(
      'https://homes.rewiringamerica.org/federal-incentives/home-electrification-appliance-rebates',
    ),
  }));
}
