import { formatCurrency } from '../utils/formatCurrency';
import type { TaxCalculationResult } from '../types';

interface BracketDetailsProps {
  results: TaxCalculationResult;
}

export function BracketDetails({ results }: BracketDetailsProps) {
  if (!results.taxByBracket || results.taxByBracket.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-[slideDown_0.3s_ease-out]">
      <p className="mb-4 text-gray-600 text-sm">
        Répartition de l'impôt sur le quotient familial de {formatCurrency(results.quotientFamilyAmount)} :
      </p>
      <table className="w-full border-collapse bg-white rounded overflow-hidden shadow-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-3 py-3 text-left font-semibold text-xs">Tranche</th>
            <th className="px-3 py-3 text-left font-semibold text-xs">Montant imposable</th>
            <th className="px-3 py-3 text-center font-semibold text-xs">Taux</th>
            <th className="px-3 py-3 text-right font-semibold text-xs">Impôt prélevé</th>
          </tr>
        </thead>
        <tbody>
          {results.taxByBracket.map((detail, index) => (
            <tr key={index} className="hover:bg-gray-50 last:border-b-0 border-b border-gray-100">
              <td className="px-3 py-3 font-medium text-gray-800 text-xs">
                {detail.min === 1 
                  ? `Jusqu'à ${formatCurrency(detail.max)}`
                  : detail.max === results.quotientFamilyAmount && detail.max < (detail.bracket.max === Infinity ? Infinity : detail.bracket.max)
                  ? `De ${formatCurrency(detail.min)} à ${formatCurrency(detail.max)}`
                  : `De ${formatCurrency(detail.min)} à ${formatCurrency(detail.max)}`}
              </td>
              <td className="px-3 py-3 text-gray-600 text-xs">
                {formatCurrency(detail.taxableAmount)}
              </td>
              <td className="px-3 py-3 text-center">
                <span className="inline-block px-2 py-1 bg-blue-600 text-white rounded-full font-semibold text-xs">
                  {(detail.rate * 100).toFixed(0)}%
                </span>
              </td>
              <td className="px-3 py-3 text-right font-semibold text-red-600 text-xs">
                <strong>{formatCurrency(detail.taxAmount)}</strong>
              </td>
            </tr>
          ))}
          <tr className="bg-blue-50 border-t-2 border-blue-600">
            <td colSpan={3} className="px-3 py-3 font-semibold text-gray-800 text-xs">
              <strong>Total impôt sur le quotient :</strong>
            </td>
            <td className="px-3 py-3 text-right font-semibold text-gray-800 text-xs">
              <strong>{formatCurrency(results.baseTax)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 p-3 bg-white rounded border-l-4 border-blue-600">
        <small className="text-gray-600 leading-normal text-xs">
          <strong className="text-gray-800">Note :</strong> Ce détail montre l'impôt calculé sur le quotient familial ({formatCurrency(results.quotientFamilyAmount)}). 
          L'impôt total est ensuite multiplié par le nombre de parts ({results.parts}) pour obtenir l'impôt après application du quotient familial.
        </small>
      </p>
    </div>
  );
}

