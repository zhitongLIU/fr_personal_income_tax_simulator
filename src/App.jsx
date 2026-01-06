import { useState } from 'react';
import { YearSelector } from './components/YearSelector';
import { TaxForm } from './components/TaxForm';
import { TaxResults } from './components/TaxResults';
import { calculateFinalTax } from './services/taxCalculator';
import './App.css';

function App() {
  const [year, setYear] = useState(2025);
  const [results, setResults] = useState(null);

  const handleCalculate = (formData) => {
    const taxResults = calculateFinalTax(formData);
    setResults(taxResults);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Simulateur d'Impôt sur le Revenu</h1>
        <p className="subtitle">France - Calcul indicatif de votre impôt</p>
      </header>

      <main className="app-main">
        <div className="container">
          <YearSelector year={year} onYearChange={setYear} />
          <TaxForm onSubmit={handleCalculate} year={year} />
          {results && <TaxResults results={results} />}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Ce simulateur utilise les barèmes officiels publiés par le Ministère de l'Économie et des Finances.
          Les calculs sont indicatifs et ne remplacent pas la déclaration officielle sur{' '}
          <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer">
            impots.gouv.fr
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
