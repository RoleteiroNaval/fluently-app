import React from 'react';

interface AIChatBubbleProps {
  message: string;
  avatar?: React.ReactNode;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ message, avatar }) => {
  return (
    <div className="flex gap-3 mb-8 items-start w-full max-w-md">
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <div className="bg-purple-900 bg-opacity-60 rounded-xl p-4 max-w-xs shadow-lg border border-purple-700 border-opacity-50">
        <p className="text-white text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
