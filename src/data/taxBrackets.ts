import type { TaxBracket, MaritalStatus, TaxYear } from '../types';

// Barèmes d'imposition sur le revenu pour la France
// Source: Ministère de l'Économie, des Finances et de la Souveraineté industrielle et énergétique

export const taxBrackets2025: TaxBracket[] = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 0.11 },
  { min: 29316, max: 83823, rate: 0.30 },
  { min: 83824, max: 180294, rate: 0.41 },
  { min: 180295, max: Infinity, rate: 0.45 }
];

export const taxBrackets2026: TaxBracket[] = [
  { min: 0, max: 11497, rate: 0 },
  { min: 11498, max: 29315, rate: 0.11 },
  { min: 29316, max: 83823, rate: 0.30 },
  { min: 83824, max: 180294, rate: 0.41 },
  { min: 180295, max: Infinity, rate: 0.45 }
];

// Plafonds de décote (en euros)
export const decoteLimits = {
  single: 1746,    // Célibataire, veuf, divorcé
  couple: 2888     // Marié ou pacsé
} as const;

// Plafond du quotient familial (en euros par demi-part)
export const familyQuotientCeiling = 1750;

// Règles de calcul des parts fiscales
export function calculateFamilyParts(maritalStatus: MaritalStatus, numberOfChildren: number): number {
  let parts = 0;
  
  if (maritalStatus === 'single') {
    parts = 1;
  } else if (maritalStatus === 'married') {
    parts = 2;
  }
  
  // Enfants à charge
  if (numberOfChildren >= 1) {
    parts += 0.5; // Premier enfant
  }
  if (numberOfChildren >= 2) {
    parts += 0.5; // Deuxième enfant
  }
  if (numberOfChildren >= 3) {
    parts += (numberOfChildren - 2) * 1; // À partir du 3ème enfant, +1 part chacun
  }
  
  return parts;
}

export const taxBrackets: Record<TaxYear, TaxBracket[]> = {
  2025: taxBrackets2025,
  2026: taxBrackets2026
};

