import { useState } from 'react';
import type { TaxCalculationResult } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { SummaryCard } from './SummaryCard';
import { TaxMetricCard } from './TaxMetricCard';
import { DetailRow } from './DetailRow';
import { BracketDetails } from './BracketDetails';
import { Disclaimer } from './Disclaimer';
import { PartsCalculation } from './PartsCalculation';

interface TaxResultsProps {
  results: TaxCalculationResult | null;
}

export function TaxResults({ results }: TaxResultsProps) {
  const [showBracketDetails, setShowBracketDetails] = useState(false);

  if (!results) {
    return null;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="mt-0 mb-6 text-gray-800 text-2xl">Résultats du calcul</h2>
      
      <div className="mb-8 flex flex-col gap-4">
        <SummaryCard 
          label="Impôt net à payer" 
          value={results.finalTax} 
          variant="primary"
        />
        <SummaryCard 
          label="Revenu après impôt" 
          value={results.incomeAfterTax}
          variant="secondary"
          explanation={
            <>
              <strong className="text-gray-600 font-semibold">Calcul :</strong> {formatCurrency(results.netIncome)} (Revenu net) - {formatCurrency(results.finalTax)} (Impôt net) = {formatCurrency(results.incomeAfterTax)}
            </>
          }
        />
      </div>

      <div className="my-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="mt-0 mb-6 text-gray-800 text-xl border-b-2 border-gray-300 pb-2">Indicateurs fiscaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaxMetricCard
            label="Taux moyen d'imposition"
            value={results.averageTaxRate}
            description={
              <>
                Impôt final ÷ Revenu imposable
                <br />
                <small className="block mt-2 italic text-gray-500">Représente la charge fiscale moyenne sur votre revenu imposable</small>
              </>
            }
          />
          
          <TaxMetricCard
            label="Taux marginal d'imposition"
            value={results.marginalRate}
            highlight
            description={
              <>
                Taux de la tranche la plus élevée
                <br />
                <small className="block mt-2 italic text-gray-500">
                  {results.marginalBracket ? (
                    <>
                      Tranche {formatCurrency(results.marginalBracket.min)} - {results.marginalBracket.max === Infinity ? '∞' : formatCurrency(results.marginalBracket.max)}
                      <br />
                      Taux appliqué sur la dernière tranche de votre quotient familial
                    </>
                  ) : (
                    'Taux appliqué sur la dernière tranche de votre quotient familial'
                  )}
                </small>
              </>
            }
          />
          
          <TaxMetricCard
            label="Taux d'imposition effectif"
            value={results.effectiveTaxRate}
            description={
              <>
                Impôt final ÷ Revenu net
                <br />
                <small className="block mt-2 italic text-gray-500">Charge fiscale réelle sur votre revenu net total</small>
              </>
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mt-0 mb-4 text-gray-800 text-xl border-b-2 border-gray-200 pb-2">Détail du calcul</h3>
        
        <DetailRow
          label="Revenu imposable :"
          value={results.taxableIncome}
        />

        <DetailRow
          label="Nombre de parts :"
          value={results.parts}
          collapsible
          calculation={<PartsCalculation results={results} />}
        />

        <DetailRow
          label="Quotient familial :"
          value={results.quotientFamilyAmount}
          collapsible
          calculation={
            <>
              <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxableIncome)} (Revenu imposable) ÷ {results.parts} (Nombre de parts) = {formatCurrency(results.quotientFamilyAmount)}
            </>
          }
        />

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => results.taxByBracket && results.taxByBracket.length > 0 && setShowBracketDetails(!showBracketDetails)}
            style={results.taxByBracket && results.taxByBracket.length > 0 ? { cursor: 'pointer' } : {}}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              {results.taxByBracket && results.taxByBracket.length > 0 && (
                <span className="inline-block w-4 text-center text-xs text-blue-600">
                  {showBracketDetails ? '▼' : '▶'}
                </span>
              )}
              Impôt brut (sur le quotient) :
            </span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.baseTax)}</span>
          </div>
          {results.taxByBracket && results.taxByBracket.length > 0 && showBracketDetails && (
            <BracketDetails results={results} />
          )}
        </div>

        <DetailRow
          label="Impôt après application du quotient :"
          value={results.taxAfterQuotient}
          collapsible
          calculation={
            <>
              <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.baseTax)} (Impôt brut sur le quotient) × {results.parts} (Nombre de parts) = {formatCurrency(results.taxAfterQuotient)}
            </>
          }
        />

        {results.decote > 0 ? (
          <DetailRow
            label="Décote appliquée :"
            value={results.decote}
            negative
            highlight
            collapsible
            calculation={
              <>
                <strong className="text-gray-800 font-semibold">Calcul :</strong> {results.maritalStatus === 'single' ? '1 746' : '2 888'} € (Plafond) - (0,75 × {formatCurrency(results.taxAfterQuotient)}) = {formatCurrency(results.decote)}
                <br />
                <em className="block mt-1 text-gray-500 italic">La décote s'applique si l'impôt est inférieur à {results.maritalStatus === 'single' ? '1 746' : '2 888'} €</em>
              </>
            }
          />
        ) : (
          <DetailRow
            label="Décote appliquée :"
            value={results.decote}
            collapsible
            calculation={
              <em className="block mt-1 text-gray-500 italic">
                La décote ne s'applique pas car l'impôt ({formatCurrency(results.taxAfterQuotient)}) est supérieur ou égal au plafond ({results.maritalStatus === 'single' ? '1 746' : '2 888'} €)
              </em>
            }
          />
        )}

        <DetailRow
          label="Impôt après décote :"
          value={results.taxAfterDecote}
          collapsible
          calculation={
            results.decote > 0 ? (
              <>
                <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - {formatCurrency(results.decote)} (Décote) = {formatCurrency(results.taxAfterDecote)}
              </>
            ) : (
              <>
                <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - 0 € (Pas de décote) = {formatCurrency(results.taxAfterDecote)}
                <br />
                <em className="block mt-1 text-gray-500 italic">La décote ne s'applique pas car l'impôt ({formatCurrency(results.taxAfterQuotient)}) est supérieur ou égal au plafond ({results.maritalStatus === 'single' ? '1 746' : '2 888'} €)</em>
              </>
            )
          }
        />

        {results.taxReductions > 0 && (
          <DetailRow
            label="Réductions d'impôt :"
            value={results.taxReductions}
            negative
            highlight
          />
        )}

        <DetailRow
          label="Impôt net à payer :"
          value={results.finalTax}
          final
        />
      </div>

      <Disclaimer />
    </div>
  );
}
