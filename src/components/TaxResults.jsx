import React, { useState } from 'react';
import './TaxResults.css';

export function TaxResults({ results }) {
  const [showBracketDetails, setShowBracketDetails] = useState(false);
  const [showPartsCalc, setShowPartsCalc] = useState(false);
  const [showQuotientCalc, setShowQuotientCalc] = useState(false);
  const [showTaxAfterQuotientCalc, setShowTaxAfterQuotientCalc] = useState(false);
  const [showDecoteCalc, setShowDecoteCalc] = useState(false);
  const [showTaxAfterDecoteCalc, setShowTaxAfterDecoteCalc] = useState(false);

  if (!results) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="tax-results">
      <h2>Résultats du calcul</h2>
      
      <div className="results-summary">
        <div className="summary-card final-tax">
          <div className="summary-label">Impôt net à payer</div>
          <div className="summary-value">{formatCurrency(results.finalTax)}</div>
        </div>
        <div className="summary-card income-after-tax">
          <div className="summary-label">Revenu après impôt</div>
          <div className="summary-value">{formatCurrency(results.incomeAfterTax)}</div>
          <div className="summary-explanation">
            <small>
              <strong>Calcul :</strong> {formatCurrency(results.netIncome)} (Revenu net) - {formatCurrency(results.finalTax)} (Impôt net) = {formatCurrency(results.incomeAfterTax)}
            </small>
          </div>
        </div>
      </div>

      <div className="tax-metrics">
        <h3>Indicateurs fiscaux</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Taux moyen d'imposition</div>
            <div className="metric-value">{results.averageTaxRate.toFixed(2)}%</div>
            <div className="metric-description">
              Impôt final ÷ Revenu imposable
              <br />
              <small>Représente la charge fiscale moyenne sur votre revenu imposable</small>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label">Taux marginal d'imposition</div>
            <div className="metric-value highlight-rate">{results.marginalRate.toFixed(0)}%</div>
            <div className="metric-description">
              Taux de la tranche la plus élevée
              <br />
              <small>
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
          
          <div className="metric-card">
            <div className="metric-label">Taux d'imposition effectif</div>
            <div className="metric-value">{results.effectiveTaxRate.toFixed(2)}%</div>
            <div className="metric-description">
              Impôt final ÷ Revenu net
              <br />
              <small>Charge fiscale réelle sur votre revenu net total</small>
            </div>
          </div>
        </div>
      </div>

      <div className="results-details">
        <h3>Détail du calcul</h3>
        
        <div className="detail-row">
          <span className="detail-label">Revenu imposable :</span>
          <span className="detail-value">{formatCurrency(results.taxableIncome)}</span>
        </div>

        <div>
          <div 
            className="detail-row clickable"
            onClick={() => setShowPartsCalc(!showPartsCalc)}
          >
            <span className="detail-label">
              <span className="collapse-icon">{showPartsCalc ? '▼' : '▶'}</span>
              Nombre de parts :
            </span>
            <span className="detail-value">{results.parts}</span>
          </div>
          {showPartsCalc && (
            <div className="detail-calculation-collapsed">
              <small>
                <strong>Calcul des parts fiscales :</strong>
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
                    <em>Règle : Les 2 premiers enfants comptent pour 0,5 part chacun, le 3ème enfant et suivants comptent pour 1 part chacun.</em>
                  </>
                )}
                <br />
                <br />
                <strong>Total :</strong> {results.parts} part{results.parts > 1 ? 's' : ''}
                {results.numberOfChildren > 0 && (
                  <>
                    <br />
                    <em>({results.maritalStatus === 'single' ? '1' : '2'} part{results.maritalStatus === 'married' ? 's' : ''} de base + {results.parts - (results.maritalStatus === 'single' ? 1 : 2)} part{results.parts - (results.maritalStatus === 'single' ? 1 : 2) > 1 ? 's' : ''} pour {results.numberOfChildren} enfant{results.numberOfChildren > 1 ? 's' : ''})</em>
                  </>
                )}
              </small>
            </div>
          )}
        </div>

        <div>
          <div 
            className="detail-row clickable"
            onClick={() => setShowQuotientCalc(!showQuotientCalc)}
          >
            <span className="detail-label">
              <span className="collapse-icon">{showQuotientCalc ? '▼' : '▶'}</span>
              Quotient familial :
            </span>
            <span className="detail-value">{formatCurrency(results.quotientFamilyAmount)}</span>
          </div>
          {showQuotientCalc && (
            <div className="detail-calculation-collapsed">
              <small>
                <strong>Calcul :</strong> {formatCurrency(results.taxableIncome)} (Revenu imposable) ÷ {results.parts} (Nombre de parts) = {formatCurrency(results.quotientFamilyAmount)}
              </small>
            </div>
          )}
        </div>

        <div>
          <div 
            className="detail-row clickable"
            onClick={() => results.taxByBracket && results.taxByBracket.length > 0 && setShowBracketDetails(!showBracketDetails)}
            style={results.taxByBracket && results.taxByBracket.length > 0 ? { cursor: 'pointer' } : {}}
          >
            <span className="detail-label">
              {results.taxByBracket && results.taxByBracket.length > 0 && (
                <span className="collapse-icon">{showBracketDetails ? '▼' : '▶'}</span>
              )}
              Impôt brut (sur le quotient) :
            </span>
            <span className="detail-value">{formatCurrency(results.baseTax)}</span>
          </div>

          {results.taxByBracket && results.taxByBracket.length > 0 && showBracketDetails && (
            <div className="bracket-details-content">
              <p className="bracket-explanation">
                Répartition de l'impôt sur le quotient familial de {formatCurrency(results.quotientFamilyAmount)} :
              </p>
              <table className="bracket-table">
                <thead>
                  <tr>
                    <th>Tranche</th>
                    <th>Montant imposable</th>
                    <th>Taux</th>
                    <th>Impôt prélevé</th>
                  </tr>
                </thead>
                <tbody>
                  {results.taxByBracket.map((detail, index) => (
                    <tr key={index}>
                      <td className="bracket-range">
                        {detail.min === 1 
                          ? `Jusqu'à ${formatCurrency(detail.max)}`
                          : detail.max === results.quotientFamilyAmount && detail.max < (detail.bracket.max === Infinity ? Infinity : detail.bracket.max)
                          ? `De ${formatCurrency(detail.min)} à ${formatCurrency(detail.max)}`
                          : `De ${formatCurrency(detail.min)} à ${formatCurrency(detail.max)}`}
                      </td>
                      <td className="bracket-amount">
                        {formatCurrency(detail.taxableAmount)}
                      </td>
                      <td className="bracket-rate">
                        <span className="rate-badge-small">{(detail.rate * 100).toFixed(0)}%</span>
                      </td>
                      <td className="bracket-tax">
                        <strong>{formatCurrency(detail.taxAmount)}</strong>
                      </td>
                    </tr>
                  ))}
                  <tr className="bracket-total">
                    <td colSpan="3"><strong>Total impôt sur le quotient :</strong></td>
                    <td><strong>{formatCurrency(results.baseTax)}</strong></td>
                  </tr>
                </tbody>
              </table>
              <p className="bracket-note">
                <small>
                  <strong>Note :</strong> Ce détail montre l'impôt calculé sur le quotient familial ({formatCurrency(results.quotientFamilyAmount)}). 
                  L'impôt total est ensuite multiplié par le nombre de parts ({results.parts}) pour obtenir l'impôt après application du quotient familial.
                </small>
              </p>
            </div>
          )}
        </div>

        <div>
          <div 
            className="detail-row clickable"
            onClick={() => setShowTaxAfterQuotientCalc(!showTaxAfterQuotientCalc)}
          >
            <span className="detail-label">
              <span className="collapse-icon">{showTaxAfterQuotientCalc ? '▼' : '▶'}</span>
              Impôt après application du quotient :
            </span>
            <span className="detail-value">{formatCurrency(results.taxAfterQuotient)}</span>
          </div>
          {showTaxAfterQuotientCalc && (
            <div className="detail-calculation-collapsed">
              <small>
                <strong>Calcul :</strong> {formatCurrency(results.baseTax)} (Impôt brut sur le quotient) × {results.parts} (Nombre de parts) = {formatCurrency(results.taxAfterQuotient)}
              </small>
            </div>
          )}
        </div>

        {results.decote > 0 && (
          <div>
            <div 
              className="detail-row highlight clickable"
              onClick={() => setShowDecoteCalc(!showDecoteCalc)}
            >
              <span className="detail-label">
                <span className="collapse-icon">{showDecoteCalc ? '▼' : '▶'}</span>
                Décote appliquée :
              </span>
              <span className="detail-value negative">- {formatCurrency(results.decote)}</span>
            </div>
            {showDecoteCalc && (
              <div className="detail-calculation-collapsed">
                <small>
                  <strong>Calcul :</strong> {results.maritalStatus === 'single' ? '1 746' : '2 888'} € (Plafond) - (0,75 × {formatCurrency(results.taxAfterQuotient)}) = {formatCurrency(results.decote)}
                  <br />
                  <em>La décote s'applique si l'impôt est inférieur à {results.maritalStatus === 'single' ? '1 746' : '2 888'} €</em>
                </small>
              </div>
            )}
          </div>
        )}

        <div>
          <div 
            className="detail-row clickable"
            onClick={() => setShowTaxAfterDecoteCalc(!showTaxAfterDecoteCalc)}
          >
            <span className="detail-label">
              <span className="collapse-icon">{showTaxAfterDecoteCalc ? '▼' : '▶'}</span>
              Impôt après décote :
            </span>
            <span className="detail-value">{formatCurrency(results.taxAfterDecote)}</span>
          </div>
          {showTaxAfterDecoteCalc && (
            <div className="detail-calculation-collapsed">
              <small>
                {results.decote > 0 ? (
                  <>
                    <strong>Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - {formatCurrency(results.decote)} (Décote) = {formatCurrency(results.taxAfterDecote)}
                  </>
                ) : (
                  <>
                    <strong>Calcul :</strong> {formatCurrency(results.taxAfterQuotient)} (Impôt après quotient) - 0 € (Pas de décote) = {formatCurrency(results.taxAfterDecote)}
                    <br />
                    <em>La décote ne s'applique pas car l'impôt ({formatCurrency(results.taxAfterQuotient)}) est supérieur ou égal au plafond ({results.maritalStatus === 'single' ? '1 746' : '2 888'} €)</em>
                  </>
                )}
              </small>
            </div>
          )}
        </div>

        {results.taxReductions > 0 && (
          <div className="detail-row highlight">
            <span className="detail-label">Réductions d'impôt :</span>
            <span className="detail-value negative">- {formatCurrency(results.taxReductions)}</span>
          </div>
        )}

        <div className="detail-row final-row">
          <span className="detail-label">Impôt net à payer :</span>
          <span className="detail-value final">{formatCurrency(results.finalTax)}</span>
        </div>
      </div>

      <div className="results-disclaimer">
        <p>
          <strong>⚠️ Important :</strong> Ce calcul est indicatif et ne remplace pas 
          la déclaration officielle. Les résultats peuvent varier selon votre situation 
          particulière.
        </p>
        <p>
          <strong>Différences possibles avec votre déclaration officielle :</strong>
        </p>
        <ul className="disclaimer-list">
          <li><strong>Plafonnement du quotient familial :</strong> Le plafonnement peut réduire l'avantage du quotient familial pour les hauts revenus</li>
          <li><strong>Crédits d'impôt spécifiques :</strong> Certains crédits d'impôt (frais de garde, emploi à domicile, etc.) ne sont pas tous inclus dans ce simulateur</li>
          <li><strong>Abattements spécifiques :</strong> Certains revenus bénéficient d'abattements particuliers (fonciers, etc.)</li>
          <li><strong>Revenus exonérés :</strong> Certains revenus peuvent être partiellement ou totalement exonérés</li>
          <li><strong>Déductions spéciales :</strong> Pensions alimentaires, cotisations PER, etc.</li>
        </ul>
        <p>
          Pour un calcul officiel précis, consultez{' '}
          <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer">
            impots.gouv.fr
          </a>
        </p>
      </div>
    </div>
  );
}

