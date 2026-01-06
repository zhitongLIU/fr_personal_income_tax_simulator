import { ReactNode } from 'react';

interface TaxMetricCardProps {
  label: string;
  value: string | number;
  description: ReactNode;
  highlight?: boolean;
}

export function TaxMetricCard({ label, value, description, highlight = false }: TaxMetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
      <div className="text-sm text-gray-600 font-semibold mb-3 uppercase tracking-wide">{label}</div>
      <div className={`text-3xl font-bold mb-3 ${highlight ? 'text-red-600' : 'text-gray-800'}`}>
        {typeof value === 'number' ? value.toFixed(2) : value}%
      </div>
      <div className="text-sm text-gray-600 leading-relaxed">
        {description}
      </div>
    </div>
  );
}

