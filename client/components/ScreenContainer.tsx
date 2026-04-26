import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ScreenContainerProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  onBack,
  showBackButton = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-fluently-vertical text-white p-4 flex flex-col">
      {showBackButton && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:opacity-80 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <div className="flex-grow flex flex-col justify-center items-center w-full max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
};
