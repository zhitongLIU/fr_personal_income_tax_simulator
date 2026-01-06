import { taxBrackets } from '../data/taxBrackets';
import type { TaxYear } from '../types';

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
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <label htmlFor="tax-year" className="block mb-2 font-semibold text-gray-800">Année fiscale :</label>
      <select 
        id="tax-year"
        value={year} 
        onChange={(e) => onYearChange(parseInt(e.target.value) as TaxYear)}
        className="w-full max-w-xs px-3 py-3 text-base text-gray-900 bg-white border-2 border-gray-300 rounded cursor-pointer appearance-none pr-10 transition-all hover:border-blue-600 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '12px'
        }}
      >
        <option value={2025}>2025 (revenus 2024)</option>
        <option value={2026}>2026 (revenus 2025)</option>
      </select>
      <div className="mt-2 p-3 bg-gray-50 border-l-4 border-blue-600 rounded text-sm text-gray-600 leading-relaxed">
        <strong className="text-gray-800 font-semibold">Description :</strong> Sélectionnez l'année d'imposition pour laquelle vous souhaitez calculer votre impôt. 
        L'année fiscale correspond à l'année de déclaration, tandis que les revenus déclarés sont ceux de l'année précédente. 
        Par exemple, en 2025, vous déclarez vos revenus de 2024.
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
        <h4 className="mt-0 mb-3 text-gray-800 text-base font-semibold">Barème d'imposition {year}</h4>
        <table className="w-full border-collapse mb-2">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-800 text-xs border-b-2 border-gray-300">Tranche de revenu</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-800 text-xs border-b-2 border-gray-300">Taux d'imposition</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((bracket, index) => (
              <tr key={index} className="hover:bg-gray-50 last:border-b-0">
                <td className="px-3 py-2 border-b border-gray-100 text-gray-600 text-xs">
                  {bracket.min === 0 
                    ? `Jusqu'à ${formatCurrency(bracket.max)}`
                    : bracket.max === Infinity
                    ? `Au-delà de ${formatCurrency(bracket.min - 1)}`
                    : `De ${formatCurrency(bracket.min)} à ${formatCurrency(bracket.max)}`}
                </td>
                <td className="px-3 py-2 text-right border-b border-gray-100">
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white rounded-full font-semibold text-xs">
                    {(bracket.rate * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="m-2 p-2 bg-gray-50 rounded border-l-4 border-blue-600">
          <small className="text-gray-600 leading-snug text-xs">
            <strong className="text-gray-800">Note :</strong> Le barème est progressif. Chaque tranche est imposée à son taux sur la partie du revenu qui se trouve dans cette tranche.
          </small>
        </p>
      </div>
    </div>
  );
}
