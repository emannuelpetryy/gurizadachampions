'use client';

import { useState } from 'react';

export default function PlayerAvatar({ teamName, playerName, badgeColor, size = 120 }: { teamName: string, playerName: string, badgeColor: string, size?: number }) {
  const [imgError, setImgError] = useState(false);
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const [extIndex, setExtIndex] = useState(0);

  if (imgError) {
    return (
      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: `${size / 5}px`, borderRadius: '50%', border: `2px solid ${badgeColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg width={size / 2} height={size / 2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: badgeColor }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    );
  }

  const currentImgUrl = `/Fotos Jogadores/${teamName}/${playerName}${extensions[extIndex]}`;

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: `3px solid ${badgeColor}`, overflow: 'hidden', boxShadow: `0 0 20px ${badgeColor}40`, position: 'relative' }}>
      <img 
        src={currentImgUrl} 
        alt={playerName} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => {
          if (extIndex < extensions.length - 1) {
            setExtIndex(extIndex + 1);
          } else {
            setImgError(true);
          }
        }}
      />
    </div>
  );
}
