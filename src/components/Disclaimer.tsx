export function Disclaimer() {
  return (
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
        <li className="my-2 leading-normal text-sm">
          <strong className="text-yellow-800">Plafonnement du quotient familial :</strong> Le plafonnement peut réduire l'avantage du quotient familial pour les hauts revenus
        </li>
        <li className="my-2 leading-normal text-sm">
          <strong className="text-yellow-800">Crédits d'impôt spécifiques :</strong> Certains crédits d'impôt (frais de garde, emploi à domicile, etc.) ne sont pas tous inclus dans ce simulateur
        </li>
        <li className="my-2 leading-normal text-sm">
          <strong className="text-yellow-800">Abattements spécifiques :</strong> Certains revenus bénéficient d'abattements particuliers (fonciers, etc.)
        </li>
        <li className="my-2 leading-normal text-sm">
          <strong className="text-yellow-800">Revenus exonérés :</strong> Certains revenus peuvent être partiellement ou totalement exonérés
        </li>
        <li className="my-2 leading-normal text-sm">
          <strong className="text-yellow-800">Déductions spéciales :</strong> Pensions alimentaires, cotisations PER, etc.
        </li>
      </ul>
      <p className="mt-2 m-0 text-sm text-yellow-800 leading-relaxed">
        Pour un calcul officiel précis, consultez{' '}
        <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          impots.gouv.fr
        </a>
      </p>
    </div>
  );
}

