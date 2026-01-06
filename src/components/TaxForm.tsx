import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';
import type { TaxYear, MaritalStatus, TaxCalculationParams } from '../types';
import './TaxForm.css';

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

  return (
    <form onSubmit={handleSubmit} className="tax-form">
      <h2>Informations fiscales</h2>
      
      <div className="form-group">
        <label htmlFor="netIncome">
          Revenu net annuel (€) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="netIncome"
          name="netIncome"
          value={formData.netIncome}
          onChange={handleChange}
          onFocus={handleFocus}
          min="0"
          step="0.01"
          required
          placeholder="Ex: 35000"
        />
        <small className="form-help">
          <strong>Description :</strong> Montant total de vos revenus annuels après déduction des charges sociales 
          et cotisations obligatoires. Il s'agit du revenu net figurant sur votre fiche de paie (pour les salariés) 
          ou de votre revenu net après charges (pour les autres catégories). Ce montant sert de base pour le calcul 
          de l'impôt sur le revenu.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="maritalStatus">
          Situation familiale <span className="required">*</span>
        </label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          required
        >
          <option value="single">Célibataire, veuf(ve), divorcé(e)</option>
          <option value="married">Marié(e) ou pacsé(e)</option>
        </select>
        <small className="form-help">
          <strong>Description :</strong> Votre situation matrimoniale au 1er janvier de l'année d'imposition. 
          Cette information détermine le nombre de parts fiscales de base (1 part pour célibataire, 2 parts pour 
          un couple marié ou pacsé). Le nombre de parts influence directement le calcul de l'impôt via le quotient 
          familial et le plafond de décote applicable.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="numberOfChildren">
          Nombre d'enfants à charge
        </label>
        <input
          type="number"
          id="numberOfChildren"
          name="numberOfChildren"
          value={formData.numberOfChildren}
          onChange={handleChange}
          onFocus={handleFocus}
          min="0"
          max="20"
          placeholder="0"
        />
        <small className="form-help">
          <strong>Description :</strong> Nombre d'enfants fiscalement à votre charge (mineurs ou étudiants jusqu'à 25 ans). 
          <br />
          <strong>Calcul des parts :</strong> Les 2 premiers enfants comptent pour 0.5 part chacun, 
          le 3ème enfant et suivants comptent pour 1 part chacun. Par exemple : 1 enfant = +0.5 part, 
          2 enfants = +1 part, 3 enfants = +2 parts, 4 enfants = +3 parts, etc.
          <br />
          <strong>Exemple :</strong> Un couple marié avec 2 enfants = 2 (couple) + 1 (2 enfants) = 3 parts au total.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="deductions">
          Abattements (€)
        </label>
        <input
          type="number"
          id="deductions"
          name="deductions"
          value={formData.deductions}
          onChange={handleChange}
          onFocus={handleFocus}
          min="0"
          step="0.01"
          placeholder="0"
        />
        <small className="form-help">
          <strong>Qu'est-ce qu'un abattement ?</strong> Un abattement est une réduction appliquée sur votre revenu 
          imposable <strong>avant</strong> le calcul de l'impôt. Il diminue la base de calcul de l'impôt.
          <br />
          <strong>Exemples d'abattements courants :</strong>
          <ul className="help-list">
            <li><strong>Abattement forfaitaire de 10%</strong> : Pour les salariés, déduction automatique de 10% 
            du revenu brut (plafonné à 12 902 € en 2025) pour frais professionnels</li>
            <li><strong>Frais réels</strong> : Si supérieurs à l'abattement de 10%, vous pouvez opter pour les frais réels 
            (frais de transport, repas, etc.)</li>
            <li><strong>Abattement pour personnes âgées ou invalides</strong> : 2 336 € pour les personnes de plus de 65 ans, 
            3 744 € pour les plus de 75 ans</li>
            <li><strong>Abattements sur revenus fonciers</strong> : 30% forfaitaire ou frais réels</li>
          </ul>
          <strong>Note :</strong> Saisissez ici le montant total de vos abattements. Si vous utilisez l'abattement forfaitaire 
          de 10%, calculez 10% de votre revenu brut (plafonné à 12 902 €).
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="taxReductions">
          Réductions d'impôt (€)
        </label>
        <input
          type="number"
          id="taxReductions"
          name="taxReductions"
          value={formData.taxReductions}
          onChange={handleChange}
          onFocus={handleFocus}
          min="0"
          step="0.01"
          placeholder="0"
        />
        <small className="form-help">
          <strong>Description :</strong> Les réductions d'impôt s'appliquent <strong>après</strong> le calcul de l'impôt. 
          Elles viennent directement diminuer le montant d'impôt à payer. Contrairement aux abattements qui réduisent la base 
          imposable, les réductions diminuent directement l'impôt dû.
          <br />
          <strong>Exemples de réductions courantes :</strong>
          <ul className="help-list">
            <li><strong>Dons aux associations d'intérêt général</strong> : 66% du montant versé (plafonné à 20% du revenu imposable), 
            ou 75% pour certains dons (plafonné à 1 000 € ou 20% du revenu)</li>
            <li><strong>Investissements locatifs (Pinel, etc.)</strong> : Réduction selon le dispositif et la durée</li>
            <li><strong>Investissements dans les PME</strong> : Réduction de 18% ou 25% selon le type</li>
            <li><strong>Frais de scolarité</strong> : 61 € par enfant au collège, 153 € au lycée, 183 € dans le supérieur</li>
            <li><strong>Services à la personne</strong> : 50% des dépenses engagées (plafonné)</li>
          </ul>
          <strong>Note :</strong> Saisissez ici le montant total de vos réductions d'impôt (pas le montant des dons ou investissements, 
          mais bien la réduction d'impôt obtenue).
        </small>
      </div>

      <button type="submit" className="submit-button">
        Calculer l'impôt
      </button>
    </form>
  );
}

