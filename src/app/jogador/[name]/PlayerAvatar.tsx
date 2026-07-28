'use client';

import { useState } from 'react';

// Mapa de jogadores que já possuem foto cadastrada em public/Fotos Jogadores
const KNOWN_PLAYER_PHOTOS: Record<string, string> = {
  'Manu': '/Fotos Jogadores/Venvanse/Manu.jpg',
  'Pacal': '/Fotos Jogadores/Venvanse/Pacal.jpeg',
  'Samuka': '/Fotos Jogadores/Venvanse/Samuka.jpg',
  'Galaxy': '/Fotos Jogadores/Os Desacreditados/Galaxy.jpg',
};

export default function PlayerAvatar({ 
  teamName, 
  playerName, 
  badgeColor, 
  size = 120 
}: { 
  teamName: string, 
  playerName: string, 
  badgeColor: string, 
  size?: number 
}) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalizar nome do time
  const normalizedTeam = (teamName || '')
    .replace('Maconhaço', 'Maconhaco')
    .trim();

  // Obter as iniciais do jogador para o avatar estiloso
  const cleanName = (playerName || '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const nameParts = cleanName.split(' ').filter(Boolean);
  const initials = nameParts.length > 0
    ? nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CS';

  // Verificar se o jogador possui foto conhecida
  const knownPhoto = KNOWN_PLAYER_PHOTOS[playerName];
  const currentImgUrl = knownPhoto || encodeURI(`/Fotos Jogadores/${normalizedTeam}/${playerName}.jpg`);

  // Avatar com iniciais elegantes para quando não tem foto
  const InitialsPlaceholder = (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        border: `2px solid ${badgeColor}`, 
        background: `radial-gradient(circle at 30% 30%, ${badgeColor}40, rgba(10, 15, 30, 0.95))`,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: `0 0 15px ${badgeColor}30`,
        position: 'relative',
        flexShrink: 0
      }}
    >
      <span style={{ 
        fontFamily: 'var(--font-rajdhani)', 
        fontWeight: 'bold', 
        fontSize: `${size * 0.38}px`, 
        color: '#fff', 
        textShadow: `0 0 8px ${badgeColor}`,
        letterSpacing: '1px',
        lineHeight: 1
      }}>
        {initials}
      </span>
    </div>
  );

  if (imgError) {
    return InitialsPlaceholder;
  }

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        border: `2px solid ${badgeColor}`, 
        overflow: 'hidden', 
        boxShadow: `0 0 15px ${badgeColor}40`, 
        position: 'relative',
        flexShrink: 0,
        background: `radial-gradient(circle at 30% 30%, ${badgeColor}40, rgba(10, 15, 30, 0.95))`
      }}
    >
      {/* Exibe as iniciais de fundo instantaneamente enquanto a foto tenta carregar */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 'bold',
          fontSize: `${size * 0.38}px`,
          color: '#fff',
          textShadow: `0 0 8px ${badgeColor}`,
          letterSpacing: '1px'
        }}>
          {initials}
        </div>
      )}

      <img 
        src={currentImgUrl} 
        alt="" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
          position: 'relative',
          zIndex: 1
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgError(true)}
      />
    </div>
  );
}
