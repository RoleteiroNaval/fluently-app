import React from 'react';

interface AIAvatarProps {
  size?: 'small' | 'medium' | 'large';
  glowing?: boolean;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ size = 'medium', glowing = false }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-32 h-32',
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center ${
        glowing ? 'animate-pulse-glow shadow-lg shadow-purple-500/50' : ''
      }`}
    >
      {/* Avatar background circle */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-fluently opacity-30`}
      />

      {/* Initials or avatar content */}
      <div className={`relative z-10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-full h-full`}>
        <div className={`text-white font-bold ${
          size === 'small' ? 'text-sm' : size === 'medium' ? 'text-lg' : 'text-4xl'
        }`}>
          AI
        </div>
      </div>

      {/* Glow effect ring */}
      {glowing && (
        <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-pulse" />
      )}
    </div>
  );
};
