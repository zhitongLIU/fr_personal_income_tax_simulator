import { useState } from 'react';
import type { TaxCalculationResult } from '../types';

interface TaxResultsProps {
  results: TaxCalculationResult | null;
}

export function TaxResults({ results }: TaxResultsProps) {
  const [showBracketDetails, setShowBracketDetails] = useState(false);
  const [showPartsCalc, setShowPartsCalc] = useState(false);
  const [showQuotientCalc, setShowQuotientCalc] = useState(false);
  const [showTaxAfterQuotientCalc, setShowTaxAfterQuotientCalc] = useState(false);
  const [showDecoteCalc, setShowDecoteCalc] = useState(false);
  const [showTaxAfterDecoteCalc, setShowTaxAfterDecoteCalc] = useState(false);

  if (!results) {
    return null;
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="mt-0 mb-6 text-gray-800 text-2xl">Résultats du calcul</h2>
      
      <div className="mb-8 flex flex-col gap-4">
        <div className="p-6 rounded-lg text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="block text-sm opacity-90 mb-2 uppercase tracking-wide">Impôt net à payer</div>
          <div className="block text-4xl font-bold">{formatCurrency(results.finalTax)}</div>
        </div>
        <div className="bg-gray-50 text-gray-600 border border-gray-200 p-4 rounded-lg text-center">
          <div className="block text-sm opacity-80 mb-2">Revenu après impôt</div>
          <div className="block text-2xl font-semibold text-gray-700 mb-2">{formatCurrency(results.incomeAfterTax)}</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <small className="block text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-600 font-semibold">Calcul :</strong> {formatCurrency(results.netIncome)} (Revenu net) - {formatCurrency(results.finalTax)} (Impôt net) = {formatCurrency(results.incomeAfterTax)}
            </small>
          </div>
        </div>
      </div>

      <div className="my-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="mt-0 mb-6 text-gray-800 text-xl border-b-2 border-gray-300 pb-2">Indicateurs fiscaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">Taux moyen d'imposition</div>
            <div className="text-3xl font-bold text-gray-800 mb-3">{results.averageTaxRate.toFixed(2)}%</div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Impôt final ÷ Revenu imposable
              <br />
              <small className="block mt-2 italic text-gray-500">Représente la charge fiscale moyenne sur votre revenu imposable</small>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">Taux marginal d'imposition</div>
            <div className="text-3xl font-bold text-red-600 mb-3">{results.marginalRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600 leading-relaxed">
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
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <div className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">Taux d'imposition effectif</div>
            <div className="text-3xl font-bold text-gray-800 mb-3">{results.effectiveTaxRate.toFixed(2)}%</div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Impôt final ÷ Revenu net
              <br />
              <small className="block mt-2 italic text-gray-500">Charge fiscale réelle sur votre revenu net total</small>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mt-0 mb-4 text-gray-800 text-xl border-b-2 border-gray-200 pb-2">Détail du calcul</h3>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Revenu imposable :</span>
          <span className="font-semibold text-gray-800">{formatCurrency(results.taxableIncome)}</span>
        </div>

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => setShowPartsCalc(!showPartsCalc)}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="inline-block w-4 text-center text-xs text-blue-600">{showPartsCalc ? '▼' : '▶'}</span>
              Nombre de parts :
            </span>
            <span className="font-semibold text-gray-800">{results.parts}</span>
          </div>
          {showPartsCalc && (
            <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
              <small className="block text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-800 font-semibold">Calcul des parts fiscales :</strong>
                <br />
                <br />
                <strong>1. Situation familiale :</strong>
                <br />
                {results.maritalStatus === 'single' ? (
                  <>• Célibataire, veuf(ve) ou divorcé(e) : <strong>1 part</strong></>
                ) : (
                  <>• Marié(e) ou pacsé(e) : <strong>2 parts</strong></>
                )}
                {results.numberOfChildren > 0 && (
                  <>
                    <br />
                    <br />
                    <strong>2. Enfants à charge ({results.numberOfChildren} enfant{results.numberOfChildren > 1 ? 's' : ''}) :</strong>
                    <br />
                    {results.numberOfChildren >= 1 && (
                      <>• 1<sup>er</sup> enfant : <strong>+ 0,5 part</strong> (demi-part)</>
                    )}
                    {results.numberOfChildren >= 2 && (
                      <>
                        <br />
                        • 2<sup>ème</sup> enfant : <strong>+ 0,5 part</strong> (demi-part)
                      </>
                    )}
                    {results.numberOfChildren >= 3 && (
                      <>
                        <br />
                        • 3<sup>ème</sup> enfant : <strong>+ 1 part</strong>
                        {results.numberOfChildren > 3 && (
                          <>
                            <br />
                            • 4<sup>ème</sup> enfant{results.numberOfChildren > 4 ? ' et suivants' : ''} ({results.numberOfChildren - 3} enfant{results.numberOfChildren - 3 > 1 ? 's' : ''} supplémentaire{results.numberOfChildren - 3 > 1 ? 's' : ''}) : <strong>+ {results.numberOfChildren - 3} part{results.numberOfChildren - 3 > 1 ? 's' : ''}</strong> (1 part chacun)
                          </>
                        )}
                      </>
                    )}
                    <br />
                    <br />
                    <em className="block mt-1 text-gray-500 italic">Règle : Les 2 premiers enfants comptent pour 0,5 part chacun, le 3ème enfant et suivants comptent pour 1 part chacun.</em>
                  </>
                )}
                <br />
                <br />
                <strong>Total :</strong> {results.parts} part{results.parts > 1 ? 's' : ''}
                {results.numberOfChildren > 0 && (
                  <>
                    <br />
                    <em className="block mt-1 text-gray-500 italic">({results.maritalStatus === 'single' ? '1' : '2'} part{results.maritalStatus === 'married' ? 's' : ''} de base + {results.parts - (results.maritalStatus === 'single' ? 1 : 2)} part{results.parts - (results.maritalStatus === 'single' ? 1 : 2) > 1 ? 's' : ''} pour {results.numberOfChildren} enfant{results.numberOfChildren > 1 ? 's' : ''})</em>
                  </>
                )}
              </small>
            </div>
          )}
        </div>

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => setShowQuotientCalc(!showQuotientCalc)}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="inline-block w-4 text-center text-xs text-blue-600">{showQuotientCalc ? '▼' : '▶'}</span>
              Quotient familial :
            </span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.quotientFamilyAmount)}</span>
          </div>
          {showQuotientCalc && (
            <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
              <small className="block text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxableIncome)} (Revenu imposable) ÷ {results.parts} (Nombre de parts) = {formatCurrency(results.quotientFamilyAmount)}
              </small>
            </div>
          )}
        </div>

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => results.taxByBracket && results.taxByBracket.length > 0 && setShowBracketDetails(!showBracketDetails)}
            style={results.taxByBracket && results.taxByBracket.length > 0 ? { cursor: 'pointer' } : {}}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              {results.taxByBracket && results.taxByBracket.length > 0 && (
                <span className="inline-block w-4 text-center text-xs text-blue-600">{showBracketDetails ? '▼' : '▶'}</span>
              )}
              Impôt brut (sur le quotient) :
            </span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.baseTax)}</span>
          </div>

          {results.taxByBracket && results.taxByBracket.length > 0 && showBracketDetails && (
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
                    <td colSpan={3} className="px-3 py-3 font-semibold text-gray-800 text-xs"><strong>Total impôt sur le quotient :</strong></td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-800 text-xs"><strong>{formatCurrency(results.baseTax)}</strong></td>
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
          )}
        </div>

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => setShowTaxAfterQuotientCalc(!showTaxAfterQuotientCalc)}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="inline-block w-4 text-center text-xs text-blue-600">{showTaxAfterQuotientCalc ? '▼' : '▶'}</span>
              Impôt après application du quotient :
            </span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.taxAfterQuotient)}</span>
          </div>
          {showTaxAfterQuotientCalc && (
            <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
              <small className="block text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.baseTax)} (Impôt brut sur le quotient) × {results.parts} (Nombre de parts) = {formatCurrency(results.taxAfterQuotient)}
              </small>
            </div>
          )}
        </div>

        {results.decote > 0 ? (
          <div>
            <div 
              className="bg-gray-50 p-3 rounded my-1 flex justify-between items-center cursor-pointer"
              onClick={() => setShowDecoteCalc(!showDecoteCalc)}
            >
              <span className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="inline-block w-4 text-center text-xs text-blue-600">{showDecoteCalc ? '▼' : '▶'}</span>
                Décote appliquée :
              </span>
              <span className="font-semibold text-green-600">- {formatCurrency(results.decote)}</span>
            </div>
            {showDecoteCalc && (
              <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
                <small className="block text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 font-semibold">Calcul :</strong> {results.maritalStatus === 'single' ? '1 746' : '2 888'} € (Plafond) - (0,75 × {formatCurrency(results.taxAfterQuotient)}) = {formatCurrency(results.decote)}
                  <br />
                  <em className="block mt-1 text-gray-500 italic">La décote s'applique si l'impôt est inférieur à {results.maritalStatus === 'single' ? '1 746' : '2 888'} €</em>
                </small>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div 
              className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
              onClick={() => setShowDecoteCalc(!showDecoteCalc)}
            >
              <span className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="inline-block w-4 text-center text-xs text-blue-600">{showDecoteCalc ? '▼' : '▶'}</span>
                Décote appliquée :
              </span>
              <span className="font-semibold text-gray-800">{formatCurrency(results.decote)}</span>
            </div>
            {showDecoteCalc && (
              <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
                <small className="block text-xs text-gray-600 leading-relaxed">
                  <em className="block mt-1 text-gray-500 italic">La décote ne s'applique pas car l'impôt ({formatCurrency(results.taxAfterQuotient)}) est supérieur ou égal au plafond ({results.maritalStatus === 'single' ? '1 746' : '2 888'} €)</em>
                </small>
              </div>
            )}
          </div>
        )}

        <div>
          <div 
            className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
            onClick={() => setShowTaxAfterDecoteCalc(!showTaxAfterDecoteCalc)}
          >
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <span className="inline-block w-4 text-center text-xs text-blue-600">{showTaxAfterDecoteCalc ? '▼' : '▶'}</span>
              Impôt après décote :
            </span>
            <span className="font-semibold text-gray-800">{formatCurrency(results.taxAfterDecote)}</span>
          </div>
          {showTaxAfterDecoteCalc && (
            <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
              <small className="block text-xs text-gray-600 leading-relaxed">
                {results.decote > 0 ? (
                  <>
                    <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - {formatCurrency(results.decote)} (Décote) = {formatCurrency(results.taxAfterDecote)}
                  </>
                ) : (
                  <>
                    <strong className="text-gray-800 font-semibold">Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - 0 € (Pas de décote) = {formatCurrency(results.taxAfterDecote)}
                    <br />
                    <em className="block mt-1 text-gray-500 italic">La décote ne s'applique pas car l'impôt ({formatCurrency(results.taxAfterQuotient)}) est supérieur ou égal au plafond ({results.maritalStatus === 'single' ? '1 746' : '2 888'} €)</em>
                  </>
                )}
              </small>
            </div>
          )}
        </div>

        {results.taxReductions > 0 && (
          <div className="bg-gray-50 p-3 rounded my-1 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Réductions d'impôt :</span>
            <span className="font-semibold text-green-600">- {formatCurrency(results.taxReductions)}</span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t-2 border-gray-800 font-semibold flex justify-between items-center">
          <span className="text-gray-600 text-sm">Impôt net à payer :</span>
          <span className="text-xl text-indigo-600 font-semibold">{formatCurrency(results.finalTax)}</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="m-0 text-sm text-yellow-800 leading-relaxed">
          <strong>⚠️ Important :</strong> Ce calcul est indicatif et ne remplace pas 
          la déclaration officielle. Les résultats peuvent varier selon votre situation 
          particulière.
        </p>
        <p className="mt-2 mb-2 text-sm text-yellow-800 leading-relaxed">
          <strong>Différences possibles avec votre déclaration officielle :</strong>
        </p>
        <ul className="my-2 ml-6 list-disc">
          <li className="my-2 leading-normal text-sm"><strong className="text-yellow-800">Plafonnement du quotient familial :</strong> Le plafonnement peut réduire l'avantage du quotient familial pour les hauts revenus</li>
          <li className="my-2 leading-normal text-sm"><strong className="text-yellow-800">Crédits d'impôt spécifiques :</strong> Certains crédits d'impôt (frais de garde, emploi à domicile, etc.) ne sont pas tous inclus dans ce simulateur</li>
          <li className="my-2 leading-normal text-sm"><strong className="text-yellow-800">Abattements spécifiques :</strong> Certains revenus bénéficient d'abattements particuliers (fonciers, etc.)</li>
          <li className="my-2 leading-normal text-sm"><strong className="text-yellow-800">Revenus exonérés :</strong> Certains revenus peuvent être partiellement ou totalement exonérés</li>
          <li className="my-2 leading-normal text-sm"><strong className="text-yellow-800">Déductions spéciales :</strong> Pensions alimentaires, cotisations PER, etc.</li>
        </ul>
        <p className="mt-2 m-0 text-sm text-yellow-800 leading-relaxed">
          Pour un calcul officiel précis, consultez{' '}
          <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            impots.gouv.fr
          </a>
        </p>
      </div>
    </div>
  );
}
