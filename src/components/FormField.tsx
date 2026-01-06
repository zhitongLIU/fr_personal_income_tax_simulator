import { useState, ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  description: ReactNode;
  children: ReactNode;
}

export function FormField({ id, label, required = false, description, children }: FormFieldProps) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 font-semibold text-gray-800">
        <span 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setShowDescription(!showDescription)}
        >
          <span className="inline-block w-4 text-center text-xs text-blue-600">
            {showDescription ? '▼' : '▶'}
          </span>
          {label}
          {required && <span className="text-red-600">*</span>}
        </span>
      </label>
      {children}
      {showDescription && (
        <small className="block mt-2 text-sm text-gray-600 leading-relaxed p-3 bg-gray-50 border-l-4 border-blue-600 rounded animate-[slideDown_0.3s_ease-out]">
          {description}
        </small>
      )}
    </div>
  );
}

