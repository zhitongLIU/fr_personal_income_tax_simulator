import { useState, ReactNode } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

interface DetailRowProps {
  label: string;
  value: string | number;
  calculation?: ReactNode;
  highlight?: boolean;
  negative?: boolean;
  final?: boolean;
  collapsible?: boolean;
  showCollapseIcon?: boolean;
}

export function DetailRow({ 
  label, 
  value, 
  calculation, 
  highlight = false, 
  negative = false, 
  final = false,
  collapsible = false,
  showCollapseIcon = true
}: DetailRowProps) {
  const [showCalc, setShowCalc] = useState(false);

  const baseClasses = final 
    ? "mt-4 pt-4 border-t-2 border-gray-800 font-semibold flex justify-between items-center"
    : highlight
    ? "bg-gray-50 p-3 rounded my-1 flex justify-between items-center"
    : "flex justify-between items-center py-3 border-b border-gray-100";

  const valueClasses = final
    ? "text-xl text-indigo-600 font-semibold"
    : negative
    ? "font-semibold text-green-600"
    : "font-semibold text-gray-800";

  const displayValue = typeof value === 'number' ? formatCurrency(value) : value;

  return (
    <div>
      <div 
        className={`${baseClasses} ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setShowCalc(!showCalc) : undefined}
      >
        <span className="flex items-center gap-2 text-gray-600 text-sm">
          {collapsible && showCollapseIcon && (
            <span className="inline-block w-4 text-center text-xs text-blue-600">
              {showCalc ? '▼' : '▶'}
            </span>
          )}
          {label}
        </span>
        <span className={valueClasses}>
          {negative && typeof value === 'number' && value > 0 ? '- ' : ''}
          {displayValue}
        </span>
      </div>
      {collapsible && showCalc && calculation && (
        <div className="mt-2 mb-2 px-4 py-3 bg-gray-50 rounded border-l-4 border-blue-600 animate-[slideDown_0.3s_ease-out]">
          <small className="block text-xs text-gray-600 leading-relaxed">
            {calculation}
          </small>
        </div>
      )}
    </div>
  );
}

