import { APIResponse, IncentiveType } from './api/calculator-types-v1';
import { str } from './i18n/str';
import { MsgFn } from './i18n/use-translated';
import { Project } from './projects';

export type IRARebate = {
  paymentMethod: IncentiveType;
  project: Project;
  headline: string;
  program: string;
  description: string;
  url: string;
  timeline: string | null;
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
    project: 'water_heater',
    getHeadline: msg => msg('Discount off a heat pump water heater'),
    maxAmount: 1750,
  },
  {
    project: 'hvac',
    getHeadline: msg => msg('Discount off a heat pump'),
    maxAmount: 8000,
  },
  {
    project: 'clothes_dryer',
    getHeadline: msg => msg('Discount off a heat pump clothes dryer'),
    maxAmount: 840,
  },
  {
    project: 'weatherization_and_efficiency',
    getHeadline: msg => msg('Discount off weatherization'),
    maxAmount: 1600,
  },
];

/**
 * As states launch their HEAR and HER programs, we'll want to stop showing this
 * generic info to users in those states.
 */
const HEAR_EXCLUSION_RULES: Record<string, true | Project[]> = {
  DC: true,
  GA: true,
  ID: true,
  MA: true,
  ME: true,
  MD: true,
  NY: true,
  RI: true,
  SD: true,
  NM: ['cooking', 'clothes_dryer'], // only exclude stoves and dryers in NM for now
};
const HER_EXCLUDE_STATES = new Set([
  'DC',
  'GA',
  'ID',
  'MA',
  'ME',
  'NY',
  'SD',
  'WI',
]);

export function getRebatesFor(response: APIResponse, msg: MsgFn): IRARebate[] {
  const disclaimerText = msg(
    'However, rebates will be implemented differently in each state, so we cannot guarantee final amounts, eligibility, or timeline.',
  );
  const maxHerRebate = response.is_under_80_ami ? 8000 : 4000;
  const stateExclusions = HEAR_EXCLUSION_RULES[response.location.state];
  const result: IRARebate[] = [];

  if (response.is_under_150_ami) {
    hearRebates.forEach(rebate => {
      if (
        stateExclusions !== true &&
        (!stateExclusions || !stateExclusions.includes(rebate.project))
      ) {
        result.push({
          paymentMethod: 'pos_rebate' as IncentiveType,
          project: rebate.project,
          headline: rebate.getHeadline(msg),
          program: msg(
            'Federal Home Electrification and Appliance Rebates (HEAR)',
          ),
          description:
            msg(
              str`The federal guidelines allow for a discount of up to $${rebate.maxAmount.toLocaleString()}.`,
            ) +
            ' ' +
            disclaimerText,
          url: msg(
            'https://homes.rewiringamerica.org/federal-incentives/home-electrification-appliance-rebates',
          ),
          timeline: msg('Expected in 2025'),
        });
      }
    });
  }

  if (!HER_EXCLUDE_STATES.has(response.location.state)) {
    result.push({
      paymentMethod: 'performance_rebate',
      project: 'weatherization_and_efficiency',
      headline: msg('Rebate for efficiency retrofits'),
      program: msg('Federal Home Efficiency Rebates (HER)'),
      description:
        msg(
          str`The federal guidelines allow for a rebate of up to $${maxHerRebate.toLocaleString()}, based on the modeled energy savings or measured energy savings achieved by the retrofit.`,
        ) +
        ' ' +
        disclaimerText,
      url: msg(
        'https://homes.rewiringamerica.org/federal-incentives/home-efficiency-rebates',
      ),
      timeline: msg('Expected in 2025'),
    });
  }

  return result;
}
