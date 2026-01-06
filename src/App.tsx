import { useState } from 'react';
import { YearSelector } from './components/YearSelector';
import { TaxForm } from './components/TaxForm';
import { TaxResults } from './components/TaxResults';
import { calculateFinalTax } from './services/taxCalculator';
import type { TaxYear, TaxCalculationResult, TaxCalculationParams } from './types';

function App() {
  const [year, setYear] = useState<TaxYear>(2025);
  const [results, setResults] = useState<TaxCalculationResult | null>(null);

  const handleCalculate = (formData: TaxCalculationParams) => {
    const taxResults = calculateFinalTax(formData);
    setResults(taxResults);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-300">
      <header className="bg-white shadow-md py-8 px-8 text-center">
        <h1 className="m-0 mb-2 text-gray-800 text-3xl font-bold">Simulateur d'Impôt sur le Revenu</h1>
        <p className="m-0 text-gray-600 text-lg">France - Calcul indicatif de votre impôt</p>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="m-0 text-sm text-green-800 leading-relaxed">
                  <strong className="font-semibold">🔒 Confidentialité garantie :</strong> Tous les calculs sont effectués localement dans votre navigateur. 
                  <strong className="font-semibold"> Aucune donnée n'est transmise ou stockée</strong> sur un serveur externe. Vos informations restent privées et sécurisées.
                </p>
              </div>
            </div>
          </div>
          <YearSelector year={year} onYearChange={setYear} />
          <TaxForm onSubmit={handleCalculate} year={year} />
          {results && <TaxResults results={results} />}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 px-6 text-center text-sm">
        <p className="m-0 leading-relaxed">
          Ce simulateur utilise les barèmes officiels publiés par le Ministère de l'Économie et des Finances.
          Les calculs sont indicatifs et ne remplacent pas la déclaration officielle sur{' '}
          <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            impots.gouv.fr
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
