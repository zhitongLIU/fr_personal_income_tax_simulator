# Simulateur d'Impôt sur le Revenu - France

Application web React pour simuler le calcul de l'impôt sur le revenu français selon les barèmes officiels.

## Fonctionnalités

- Calcul de l'impôt sur le revenu selon le barème progressif français
- Support des années fiscales 2025 et 2026
- Prise en compte du quotient familial
- Calcul de la décote (réduction pour faibles revenus)
- Réductions d'impôt (dons, investissements, etc.)
- Interface utilisateur moderne et responsive

## Barèmes fiscaux

### 2025 (revenus 2024) et 2026 (revenus 2025)

- Jusqu'à 11 497 € : 0%
- De 11 498 € à 29 315 € : 11%
- De 29 316 € à 83 823 € : 30%
- De 83 824 € à 180 294 € : 41%
- Au-delà de 180 294 € : 45%

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Structure du projet

```
tax_simulator/
├── src/
│   ├── components/          # Composants React
│   │   ├── TaxForm.jsx      # Formulaire de saisie
│   │   ├── TaxResults.jsx   # Affichage des résultats
│   │   └── YearSelector.jsx # Sélecteur d'année
│   ├── data/
│   │   └── taxBrackets.js   # Barèmes fiscaux
│   ├── services/
│   │   └── taxCalculator.js # Logique de calcul
│   ├── App.jsx              # Composant principal
│   └── main.jsx             # Point d'entrée
└── package.json
```

## Calcul de l'impôt

Le simulateur suit la méthode officielle de calcul :

1. **Revenu imposable** = Revenu net - Abattements
2. **Quotient familial** = Revenu imposable / Nombre de parts
3. **Impôt brut** = Application du barème progressif sur le quotient
4. **Impôt après quotient** = Impôt brut × Nombre de parts
5. **Décote** (si applicable) : Réduction pour faibles revenus
6. **Réductions d'impôt** : Dons, investissements, etc.
7. **Impôt net** = Impôt après quotient - Décote - Réductions

### Quotient familial

- Célibataire : 1 part
- Marié/Pacsé : 2 parts
- Enfants : +0.5 part chacun (1er et 2ème), +1 part à partir du 3ème

### Décote

Réduction appliquée si l'impôt est inférieur à :
- 1 746 € pour un célibataire
- 2 888 € pour un couple

Formule : Décote = Plafond - (0.75 × Impôt)

## Avertissement

⚠️ **Important** : Ce simulateur fournit des calculs indicatifs basés sur les barèmes officiels publiés par le Ministère de l'Économie et des Finances. Les résultats peuvent varier selon votre situation particulière et ne remplacent pas la déclaration officielle sur [impots.gouv.fr](https://www.impots.gouv.fr).

## Technologies

- React 19
- Vite
- CSS3

## Sources

- [Ministère de l'Économie et des Finances](https://www.economie.gouv.fr)
- [Service Public](https://www.service-public.fr)
- [Impots.gouv.fr](https://www.impots.gouv.fr)
