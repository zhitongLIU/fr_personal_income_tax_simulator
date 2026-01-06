import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';
import type { TaxYear, MaritalStatus, TaxCalculationParams } from '../types';
import { FormField } from './FormField';

interface TaxFormProps {
  onSubmit: (data: TaxCalculationParams) => void;
  year: TaxYear;
}

interface FormData {
  netIncome: string;
  maritalStatus: MaritalStatus;
  numberOfChildren: string;
  deductions: string;
  taxReductions: string;
}

export function TaxForm({ onSubmit, year }: TaxFormProps) {
  const [formData, setFormData] = useState<FormData>({
    netIncome: '',
    maritalStatus: 'single',
    numberOfChildren: '',
    deductions: '',
    taxReductions: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Pour les champs numériques, on garde la valeur comme string pour permettre la suppression
    if (type === 'number') {
      // Permet les valeurs vides ou les nombres valides
      if (value === '' || (!isNaN(Number(value)) && value !== '-')) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    // Sélectionne tout le contenu quand on clique dans le champ pour faciliter la saisie
    e.target.select();
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    // Empêche le scroll de changer la valeur du champ numérique
    if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
      e.target.blur();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      netIncome: parseFloat(formData.netIncome) || 0,
      maritalStatus: formData.maritalStatus,
      numberOfChildren: parseInt(formData.numberOfChildren) || 0,
      deductions: parseFloat(formData.deductions) || 0,
      taxReductions: parseFloat(formData.taxReductions) || 0,
      year: year
    });
  };

  const inputClassName = "w-full px-3 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded transition-all focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-8">
      <h2 className="mt-0 mb-6 text-gray-800 text-2xl">Informations fiscales</h2>
      
      <FormField
        id="netIncome"
        label="Revenu net annuel (€)"
        required
        description={
          <>
            <strong className="text-gray-800 font-semibold">Description :</strong> Montant total de vos revenus annuels après déduction des charges sociales 
            et cotisations obligatoires. Il s'agit du revenu net figurant sur votre fiche de paie (pour les salariés) 
            ou de votre revenu net après charges (pour les autres catégories). Ce montant sert de base pour le calcul 
            de l'impôt sur le revenu.
          </>
        }
      >
        <input
          type="number"
          id="netIncome"
          name="netIncome"
          value={formData.netIncome}
          onChange={handleChange}
          onFocus={handleFocus}
          onWheel={handleWheel}
          min="0"
          step="0.01"
          required
          placeholder="Ex: 35000"
          className={inputClassName}
        />
      </FormField>

      <FormField
        id="maritalStatus"
        label="Situation familiale"
        required
        description={
          <>
            <strong className="text-gray-800 font-semibold">Description :</strong> Votre situation matrimoniale au 1er janvier de l'année d'imposition. 
            Cette information détermine le nombre de parts fiscales de base (1 part pour célibataire, 2 parts pour 
            un couple marié ou pacsé). Le nombre de parts influence directement le calcul de l'impôt via le quotient 
            familial et le plafond de décote applicable.
          </>
        }
      >
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          required
          className={inputClassName}
        >
          <option value="single">Célibataire, veuf(ve), divorcé(e)</option>
          <option value="married">Marié(e) ou pacsé(e)</option>
        </select>
      </FormField>

      <FormField
        id="numberOfChildren"
        label="Nombre d'enfants à charge"
        description={
          <>
            <strong className="text-gray-800 font-semibold">Description :</strong> Nombre d'enfants fiscalement à votre charge (mineurs ou étudiants jusqu'à 25 ans). 
            <br />
            <strong>Calcul des parts :</strong> Les 2 premiers enfants comptent pour 0.5 part chacun, 
            le 3ème enfant et suivants comptent pour 1 part chacun. Par exemple : 1 enfant = +0.5 part, 
            2 enfants = +1 part, 3 enfants = +2 parts, 4 enfants = +3 parts, etc.
            <br />
            <strong>Exemple :</strong> Un couple marié avec 2 enfants = 2 (couple) + 1 (2 enfants) = 3 parts au total.
          </>
        }
      >
        <input
          type="number"
          id="numberOfChildren"
          name="numberOfChildren"
          value={formData.numberOfChildren}
          onChange={handleChange}
          onFocus={handleFocus}
          onWheel={handleWheel}
          min="0"
          max="20"
          placeholder="0"
          className={inputClassName}
        />
      </FormField>

      <FormField
        id="deductions"
        label="Abattements (€)"
        description={
          <>
            <strong className="text-gray-800 font-semibold">Qu'est-ce qu'un abattement ?</strong> Un abattement est une réduction appliquée sur votre revenu 
            imposable <strong>avant</strong> le calcul de l'impôt. Il diminue la base de calcul de l'impôt.
            <br />
            <strong>Exemples d'abattements courants :</strong>
            <ul className="my-2 ml-6 list-disc">
              <li className="my-2 leading-normal"><strong className="text-blue-600">Abattement forfaitaire de 10%</strong> : Pour les salariés, déduction automatique de 10% 
              du revenu brut (plafonné à 12 902 € en 2025) pour frais professionnels</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Frais réels</strong> : Si supérieurs à l'abattement de 10%, vous pouvez opter pour les frais réels 
              (frais de transport, repas, etc.)</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Abattement pour personnes âgées ou invalides</strong> : 2 336 € pour les personnes de plus de 65 ans, 
              3 744 € pour les plus de 75 ans</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Abattements sur revenus fonciers</strong> : 30% forfaitaire ou frais réels</li>
            </ul>
            <strong>Note :</strong> Saisissez ici le montant total de vos abattements. Si vous utilisez l'abattement forfaitaire 
            de 10%, calculez 10% de votre revenu brut (plafonné à 12 902 €).
          </>
        }
      >
        <input
          type="number"
          id="deductions"
          name="deductions"
          value={formData.deductions}
          onChange={handleChange}
          onFocus={handleFocus}
          onWheel={handleWheel}
          min="0"
          step="0.01"
          placeholder="0"
          className={inputClassName}
        />
      </FormField>

      <FormField
        id="taxReductions"
        label="Réductions d'impôt (€)"
        description={
          <>
            <strong className="text-gray-800 font-semibold">Description :</strong> Les réductions d'impôt s'appliquent <strong>après</strong> le calcul de l'impôt. 
            Elles viennent directement diminuer le montant d'impôt à payer. Contrairement aux abattements qui réduisent la base 
            imposable, les réductions diminuent directement l'impôt dû.
            <br />
            <strong>Exemples de réductions courantes :</strong>
            <ul className="my-2 ml-6 list-disc">
              <li className="my-2 leading-normal"><strong className="text-blue-600">Dons aux associations d'intérêt général</strong> : 66% du montant versé (plafonné à 20% du revenu imposable), 
              ou 75% pour certains dons (plafonné à 1 000 € ou 20% du revenu)</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Investissements locatifs (Pinel, etc.)</strong> : Réduction selon le dispositif et la durée</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Investissements dans les PME</strong> : Réduction de 18% ou 25% selon le type</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Frais de scolarité</strong> : 61 € par enfant au collège, 153 € au lycée, 183 € dans le supérieur</li>
              <li className="my-2 leading-normal"><strong className="text-blue-600">Services à la personne</strong> : 50% des dépenses engagées (plafonné)</li>
            </ul>
            <strong>Note :</strong> Saisissez ici le montant total de vos réductions d'impôt (pas le montant des dons ou investissements, 
            mais bien la réduction d'impôt obtenue).
          </>
        }
      >
        <input
          type="number"
          id="taxReductions"
          name="taxReductions"
          value={formData.taxReductions}
          onChange={handleChange}
          onFocus={handleFocus}
          onWheel={handleWheel}
          min="0"
          step="0.01"
          placeholder="0"
          className={inputClassName}
        />
      </FormField>

      <button type="submit" className="w-full py-4 text-lg font-semibold text-white bg-blue-600 border-none rounded cursor-pointer transition-colors hover:bg-blue-700 active:bg-blue-800">
        Calculer l'impôt
      </button>
    </form>
  );
}
