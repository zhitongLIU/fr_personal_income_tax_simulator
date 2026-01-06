import { taxBrackets } from '../data/taxBrackets';
import type { TaxYear } from '../types';
import './YearSelector.css';

interface YearSelectorProps {
  year: TaxYear;
  onYearChange: (year: TaxYear) => void;
}

export function YearSelector({ year, onYearChange }: YearSelectorProps) {
  const brackets = taxBrackets[year];
  
  const formatCurrency = (amount: number): string => {
    if (amount === Infinity) return '∞';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="year-selector">
      <label htmlFor="tax-year">Année fiscale :</label>
      <select 
        id="tax-year"
        value={year} 
        onChange={(e) => onYearChange(parseInt(e.target.value) as TaxYear)}
        className="year-select"
      >
        <option value={2025}>2025 (revenus 2024)</option>
        <option value={2026}>2026 (revenus 2025)</option>
      </select>
      <div className="year-description">
        <strong>Description :</strong> Sélectionnez l'année d'imposition pour laquelle vous souhaitez calculer votre impôt. 
        L'année fiscale correspond à l'année de déclaration, tandis que les revenus déclarés sont ceux de l'année précédente. 
        Par exemple, en 2025, vous déclarez vos revenus de 2024.
      </div>
      
      <div className="tax-brackets-table">
        <h4>Barème d'imposition {year}</h4>
        <table>
          <thead>
            <tr>
              <th>Tranche de revenu</th>
              <th>Taux d'imposition</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((bracket, index) => (
              <tr key={index}>
                <td>
                  {bracket.min === 0 
                    ? `Jusqu'à ${formatCurrency(bracket.max)}`
                    : bracket.max === Infinity
                    ? `Au-delà de ${formatCurrency(bracket.min - 1)}`
                    : `De ${formatCurrency(bracket.min)} à ${formatCurrency(bracket.max)}`}
                </td>
                <td className="rate-cell">
                  <span className="rate-badge">{(bracket.rate * 100).toFixed(0)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="brackets-note">
          <small>
            <strong>Note :</strong> Le barème est progressif. Chaque tranche est imposée à son taux sur la partie du revenu qui se trouve dans cette tranche.
          </small>
        </p>
      </div>
    </div>
  );
}

