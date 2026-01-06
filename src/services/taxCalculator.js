import { taxBrackets, decoteLimits, familyQuotientCeiling, calculateFamilyParts } from '../data/taxBrackets.js';

/**
 * Calcule le revenu imposable
 * @param {number} netIncome - Revenu net annuel
 * @param {number} deductions - Abattements (optionnel)
 * @returns {number} Revenu imposable
 */
export function calculateTaxableIncome(netIncome, deductions = 0) {
  return Math.max(0, netIncome - deductions);
}

/**
 * Calcule le nombre de parts fiscales
 * @param {string} maritalStatus - 'single' ou 'married'
 * @param {number} numberOfChildren - Nombre d'enfants à charge
 * @returns {number} Nombre de parts
 */
export function calculateFamilyQuotient(maritalStatus, numberOfChildren) {
  return calculateFamilyParts(maritalStatus, numberOfChildren);
}

/**
 * Calcule le détail de l'impôt par tranche
 * @param {number} amount - Montant à imposer
 * @param {Array} brackets - Barème d'imposition
 * @returns {Array} Détail par tranche avec montant imposable et impôt
 */
export function calculateTaxByBracket(amount, brackets) {
  if (amount <= 0) return [];
  
  const details = [];
  let previousMax = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    
    // Si le montant dépasse le seuil minimum de la tranche
    if (amount > previousMax) {
      const bracketMax = bracket.max === Infinity ? amount : Math.min(amount, bracket.max);
      const taxableInBracket = bracketMax - previousMax;
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate;
        details.push({
          bracket: bracket,
          min: previousMax + 1,
          max: bracketMax,
          taxableAmount: Math.round(taxableInBracket * 100) / 100,
          taxAmount: Math.round(taxInBracket * 100) / 100,
          rate: bracket.rate
        });
      }
      
      previousMax = bracket.max === Infinity ? amount : bracket.max;
      
      if (bracketMax >= amount) break;
    } else {
      previousMax = bracket.max === Infinity ? amount : bracket.max;
    }
  }
  
  return details;
}

/**
 * Calcule l'impôt progressif sur un montant donné (barème progressif français)
 * Le barème français fonctionne par tranches : chaque tranche est imposée à son taux
 * sur la partie du revenu qui se trouve dans cette tranche
 * 
 * Exemple pour 29 821 € :
 * - Tranche 1 (0-11 497) : 11 497 € à 0% = 0 €
 * - Tranche 2 (11 498-29 315) : (29 315 - 11 497) = 17 818 € à 11% = 1 959,98 €
 * - Tranche 3 (29 316-29 821) : (29 821 - 29 315) = 506 € à 30% = 151,80 €
 * Total = 2 111,78 €
 * 
 * @param {number} amount - Montant à imposer
 * @param {Array} brackets - Barème d'imposition
 * @returns {number} Impôt calculé
 */
export function calculateProgressiveTax(amount, brackets) {
  if (amount <= 0) return 0;
  
  let tax = 0;
  let previousMax = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    
    // Si le montant dépasse le seuil minimum de la tranche
    if (amount > previousMax) {
      // Montant imposable dans cette tranche
      // La tranche va de (previousMax + 1) à bracket.max
      const bracketMax = bracket.max === Infinity ? amount : Math.min(amount, bracket.max);
      // Le montant dans cette tranche = bracketMax - previousMax
      const taxableInBracket = bracketMax - previousMax;
      
      if (taxableInBracket > 0) {
        tax += taxableInBracket * bracket.rate;
      }
      
      // Mettre à jour previousMax pour la prochaine tranche
      previousMax = bracket.max === Infinity ? amount : bracket.max;
      
      // Si on a atteint le montant total, on peut arrêter
      if (bracketMax >= amount) break;
    } else {
      previousMax = bracket.max === Infinity ? amount : bracket.max;
    }
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calcule l'impôt avec application du quotient familial
 * @param {number} taxableIncome - Revenu imposable
 * @param {number} parts - Nombre de parts fiscales
 * @param {Array} brackets - Barème d'imposition
 * @returns {Object} { baseTax, taxAfterQuotient, quotientFamilyAmount }
 */
export function calculateTaxWithQuotient(taxableIncome, parts, brackets) {
  const quotientFamilyAmount = taxableIncome / parts;
  const baseTax = calculateProgressiveTax(quotientFamilyAmount, brackets);
  let taxAfterQuotient = baseTax * parts;
  
  // Plafonnement du quotient familial
  const maxBenefit = parts * familyQuotientCeiling;
  const benefit = taxAfterQuotient - calculateProgressiveTax(taxableIncome, brackets);
  
  if (benefit > maxBenefit) {
    taxAfterQuotient = calculateProgressiveTax(taxableIncome, brackets) + maxBenefit;
  }
  
  return {
    baseTax: Math.round(baseTax * 100) / 100,
    taxAfterQuotient: Math.round(taxAfterQuotient * 100) / 100,
    quotientFamilyAmount: Math.round(quotientFamilyAmount * 100) / 100
  };
}

/**
 * Calcule la décote (réduction pour faibles revenus)
 * @param {number} tax - Impôt avant décote
 * @param {string} maritalStatus - 'single' ou 'married'
 * @returns {number} Montant de la décote
 */
export function calculateDecote(tax, maritalStatus) {
  const limit = maritalStatus === 'single' ? decoteLimits.single : decoteLimits.couple;
  
  if (tax >= limit) {
    return 0;
  }
  
  const decote = limit - (0.75 * tax);
  return Math.max(0, Math.round(decote * 100) / 100);
}

/**
 * Calcule l'impôt final avec toutes les réductions
 * @param {Object} params - Paramètres de calcul
 * @param {number} params.netIncome - Revenu net annuel
 * @param {string} params.maritalStatus - 'single' ou 'married'
 * @param {number} params.numberOfChildren - Nombre d'enfants
 * @param {number} params.deductions - Abattements
 * @param {number} params.taxReductions - Réductions d'impôt
 * @param {number} params.year - Année fiscale (2025 ou 2026)
 * @returns {Object} Résultat complet du calcul
 */
export function calculateFinalTax({
  netIncome,
  maritalStatus,
  numberOfChildren,
  deductions = 0,
  taxReductions = 0,
  year = 2025
}) {
  // 1. Revenu imposable
  const taxableIncome = calculateTaxableIncome(netIncome, deductions);
  
  // 2. Nombre de parts
  const parts = calculateFamilyQuotient(maritalStatus, numberOfChildren);
  
  // 3. Impôt avec quotient familial
  const brackets = taxBrackets[year];
  const { baseTax, taxAfterQuotient, quotientFamilyAmount } = 
    calculateTaxWithQuotient(taxableIncome, parts, brackets);
  
  // 4. Décote
  const decote = calculateDecote(taxAfterQuotient, maritalStatus);
  const taxAfterDecote = Math.max(0, taxAfterQuotient - decote);
  
  // 5. Réductions d'impôt
  const finalTax = Math.max(0, taxAfterDecote - taxReductions);
  
  // 6. Calcul des taux d'imposition
  const averageTaxRate = taxableIncome > 0 ? (finalTax / taxableIncome) * 100 : 0;
  
  // Taux marginal : trouver la tranche la plus élevée dans laquelle se trouve le quotient familial
  let marginalRate = 0;
  let marginalBracket = null;
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (quotientFamilyAmount > brackets[i].min - 1) {
      marginalRate = brackets[i].rate * 100;
      marginalBracket = brackets[i];
      break;
    }
  }
  
  // Revenu après impôt
  const incomeAfterTax = netIncome - finalTax;
  
  // Taux d'imposition effectif (sur le revenu net, pas seulement imposable)
  const effectiveTaxRate = netIncome > 0 ? (finalTax / netIncome) * 100 : 0;
  
  // Détail par tranche sur le quotient familial
  const taxByBracketDetails = calculateTaxByBracket(quotientFamilyAmount, brackets);
  
  return {
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    parts: parts,
    quotientFamilyAmount: quotientFamilyAmount,
    baseTax: baseTax,
    taxAfterQuotient: Math.round(taxAfterQuotient * 100) / 100,
    decote: Math.round(decote * 100) / 100,
    taxAfterDecote: Math.round(taxAfterDecote * 100) / 100,
    taxReductions: Math.round(taxReductions * 100) / 100,
    finalTax: Math.round(finalTax * 100) / 100,
    maritalStatus: maritalStatus,
    // Nouvelles métriques
    averageTaxRate: Math.round(averageTaxRate * 100) / 100,
    marginalRate: Math.round(marginalRate * 100) / 100,
    marginalBracket: marginalBracket,
    incomeAfterTax: Math.round(incomeAfterTax * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    taxByBracket: taxByBracketDetails,
    maritalStatus: maritalStatus,
    numberOfChildren: numberOfChildren
  };
}

