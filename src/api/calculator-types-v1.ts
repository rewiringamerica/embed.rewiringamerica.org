export type IncentiveType = 'tax_credit' | 'pos_rebate';
export type AuthorityType = 'federal' | 'state' | 'utility';

export type AmountType = 'dollar_amount' | 'percent' | 'dollars_per_unit';
export interface Amount {
  type: AmountType;
  number: number;
  maximum?: number;
  representative?: number;
  unit?: string;
}

export interface Item {
  type: string;
  name: string;
  url: string;
}

export interface Incentive {
  type: IncentiveType;
  authority_type: AuthorityType;
  authority_name: string | null;
  program: string;
  item: Item;
  amount: Amount;
  start_date: number;
  end_date: number;

  eligible: boolean;
}

export interface APIResponse {
  tax_savings: number;
  pos_savings: number;
  pos_rebate_incentives: Incentive[];
  tax_credit_incentives: Incentive[];
}
