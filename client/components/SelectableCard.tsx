import React from 'react';
import { Check } from 'lucide-react';

interface SelectableCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isSelected?: boolean;
  onSelect: () => void;
  variant?: 'default' | 'compact';
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  icon,
  title,
  description,
  isSelected = false,
  onSelect,
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg mb-3 transition-all duration-200 border-2 ${
        isSelected
          ? 'bg-purple-900 bg-opacity-70 border-cyan-400 shadow-lg shadow-cyan-400/20'
          : 'bg-gray-800 bg-opacity-50 border-gray-700 hover:border-gray-600 hover:bg-gray-800 hover:bg-opacity-70'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
          <div>
            <p className="text-white font-medium text-lg">{title}</p>
            {description && !isCompact && (
              <p className="text-gray-400 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
        {isSelected && <Check className="w-6 h-6 text-cyan-400 flex-shrink-0" />}
      </div>
    </button>
  );
};
