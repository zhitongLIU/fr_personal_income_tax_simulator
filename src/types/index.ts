export type MaritalStatus = 'single' | 'married';
export type TaxYear = 2025 | 2026;

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface TaxCalculationParams {
  netIncome: number;
  maritalStatus: MaritalStatus;
  numberOfChildren: number;
  deductions?: number;
  taxReductions?: number;
  year?: TaxYear;
}

export interface TaxByBracketDetail {
  bracket: TaxBracket;
  min: number;
  max: number;
  taxableAmount: number;
  taxAmount: number;
  rate: number;
}

export interface TaxCalculationResult {
  taxableIncome: number;
  parts: number;
  quotientFamilyAmount: number;
  baseTax: number;
  taxAfterQuotient: number;
  decote: number;
  taxAfterDecote: number;
  taxReductions: number;
  finalTax: number;
  maritalStatus: MaritalStatus;
  averageTaxRate: number;
  marginalRate: number;
  marginalBracket: TaxBracket | null;
  incomeAfterTax: number;
  effectiveTaxRate: number;
  netIncome: number;
  taxByBracket: TaxByBracketDetail[];
  numberOfChildren: number;
}

export interface TaxFormData {
  netIncome: string;
  maritalStatus: MaritalStatus;
  numberOfChildren: string;
  deductions: string;
  taxReductions: string;
}

