// TODO: can we generate these automatically from our OpenAPI file?

export type IncentiveType = 'pos_rebate' | 'tax_credit';
export type AmountType = 'dollar_amount' | 'percent' | 'solar';
export type AmountMethod =
  | 'performance_rebate'
  | 'pos_rebate'
  | 'tax_credit'
  | 'solar_tax_credit'
  | 'ev_charger_credit';
export type OwnerStatus = 'homeowner' | 'renter';
export type AmiQualification =
  | 'less_than_80_ami'
  | 'more_than_80_ami'
  | 'less_than_150_ami';
export type FilingStatus =
  | 'single'
  | 'joint'
  | 'hoh'
  | 'married_filing_separately';

export interface IIncentiveRecord {
  type: IncentiveType;
  program: string;
  program_es: string;
  item: string;
  item_es: string;
  more_info_url: string;
  more_info_url_es: string;
  amount: number;
  amount_type: AmountType;
  item_type: AmountMethod;
  representative_amount?: number;
  owner_status: OwnerStatus;
  ami_qualification?: AmiQualification;
  description: string;
  agi_max_limit?: number;
  filing_status?: FilingStatus;
  start_date: number;
  end_date: number;
  eligible: boolean;
}

// Returned from calculations function
export interface ICalculatedIncentiveResults {
  is_under_80_ami: boolean;
  is_under_150_ami: boolean;
  is_over_150_ami: boolean;
  pos_savings?: number;
  tax_savings?: number;
  performance_rebate_savings?: number;
  estimated_annual_savings?: number;
  pos_rebate_incentives: IIncentiveRecord[];
  tax_credit_incentives: IIncentiveRecord[];
}
