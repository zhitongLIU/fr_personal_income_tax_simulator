import type { TaxCalculationResult } from '../types';

interface PartsCalculationProps {
  results: TaxCalculationResult;
}

export function PartsCalculation({ results }: PartsCalculationProps) {
  return (
    <>
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
          <em className="block mt-1 text-gray-500 italic">
            ({results.maritalStatus === 'single' ? '1' : '2'} part{results.maritalStatus === 'married' ? 's' : ''} de base + {results.parts - (results.maritalStatus === 'single' ? 1 : 2)} part{results.parts - (results.maritalStatus === 'single' ? 1 : 2) > 1 ? 's' : ''} pour {results.numberOfChildren} enfant{results.numberOfChildren > 1 ? 's' : ''})
          </em>
        </>
      )}
    </>
  );
}

