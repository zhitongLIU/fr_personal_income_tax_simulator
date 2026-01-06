import { formatCurrency } from '../utils/formatCurrency';

interface SummaryCardProps {
  label: string;
  value: number;
  variant?: 'primary' | 'secondary';
  explanation?: React.ReactNode;
}

export function SummaryCard({ label, value, variant = 'primary', explanation }: SummaryCardProps) {
  if (variant === 'primary') {
    return (
      <div className="p-6 rounded-lg text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="block text-sm opacity-90 mb-2 uppercase tracking-wide">{label}</div>
        <div className="block text-4xl font-bold">{formatCurrency(value)}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-600 border border-gray-200 p-4 rounded-lg text-center">
      <div className="block text-sm opacity-80 mb-2">{label}</div>
      <div className="block text-2xl font-semibold text-gray-700 mb-2">{formatCurrency(value)}</div>
      {explanation && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <small className="block text-xs text-gray-500 leading-relaxed">
            {explanation}
          </small>
        </div>
      )}
    </div>
  );
}

