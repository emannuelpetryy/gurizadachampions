'use client';

import { useState, useEffect, useRef } from 'react';

// Mapa de fotos locais conhecidas em /public/Fotos Jogadores
const LOCAL_PHOTOS: Record<string, string> = {
  'Manu': '/Fotos Jogadores/Venvanse/Manu.jpg',
  'Pacal': '/Fotos Jogadores/Venvanse/Pacal.jpeg',
  'Samuka': '/Fotos Jogadores/Venvanse/Samuka.jpg',
  'Galaxy': '/Fotos Jogadores/Os Desacreditados/Galaxy.jpg',
  'Gustavo Majaster': '/Fotos Jogadores/Maconhaco E-Sports/Gustavo Majaster.png',
};

// Cache em memória de URLs do Supabase para não re-fetchar
const photoCache: Record<string, string | null> = {};

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function PlayerAvatar({
  teamName,
  playerName,
  badgeColor,
  size = 120,
  editable = false,
}: {
  teamName: string;
  playerName: string;
  badgeColor: string;
  size?: number;
  editable?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slug = cleanSlug(playerName);

  // Calcular iniciais
  const cleanName = (playerName || '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const nameParts = cleanName.split(' ').filter(Boolean);
  const initials = nameParts.length > 0
    ? nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  useEffect(() => {
    let cancelled = false;

    async function resolvePhoto() {
      // 1. Checar cache de memória
      if (photoCache[slug] !== undefined) {
        if (!cancelled) {
          setImgSrc(photoCache[slug]);
          setImgError(photoCache[slug] === null);
        }
        return;
      }

      // 2. Tentar buscar do Supabase (foto enviada pelo jogador)
      try {
        const res = await fetch(`/api/player-photo?slugs=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data[slug]) {
            photoCache[slug] = data[slug];
            if (!cancelled) {
              setImgSrc(data[slug]);
              setImgError(false);
            }
            return;
          }
        }
      } catch (e) {
        // fallback adiante
      }

      // 3. Tentar foto local conhecida
      if (LOCAL_PHOTOS[playerName]) {
        photoCache[slug] = LOCAL_PHOTOS[playerName];
        if (!cancelled) setImgSrc(LOCAL_PHOTOS[playerName]);
        return;
      }

      // 4. Tentar foto local pelo padrão de pasta
      const normalizedTeam = (teamName || '').replace('Maconhaço', 'Maconhaco').trim();
      const guessedPath = encodeURI(`/Fotos Jogadores/${normalizedTeam}/${playerName}.jpg`);
      photoCache[slug] = guessedPath;
      if (!cancelled) setImgSrc(guessedPath);
    }

    resolvePhoto();
    return () => { cancelled = true; };
  }, [playerName, teamName, slug]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho máximo: 50MB
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`⚠️ A foto selecionada excede o limite máximo permitido de ${MAX_SIZE_MB}MB! Escolha uma imagem menor.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('playerSlug', slug);

      const res = await fetch('/api/player-photo', { method: 'POST', body: fd });
      const data = await res.json();

      if (res.ok && data.url) {
        photoCache[slug] = data.url;
        setImgSrc(data.url);
        setImgError(false);
        setIsLoaded(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        alert(data.error || 'Erro ao fazer upload da foto.');
      }
    } catch (e) {
      alert('Erro de conexão ao fazer upload.');
    } finally {
      setUploading(false);
    }
  };

  const Placeholder = (
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
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: 'var(--font-rajdhani)',
        fontWeight: 'bold',
        fontSize: `${size * 0.38}px`,
        color: '#fff',
        textShadow: `0 0 8px ${badgeColor}`,
        letterSpacing: '1px',
        lineHeight: 1,
      }}>
        {initials}
      </span>
    </div>
  );

  const avatarContent = (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {(!imgSrc || imgError) ? Placeholder : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `2px solid ${badgeColor}`,
            overflow: 'hidden',
            boxShadow: `0 0 15px ${badgeColor}40`,
            position: 'relative',
            background: `radial-gradient(circle at 30% 30%, ${badgeColor}40, rgba(10, 15, 30, 0.95))`,
            flexShrink: 0,
          }}
        >
          {!isLoaded && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold',
              fontSize: `${size * 0.38}px`, color: '#fff',
              textShadow: `0 0 8px ${badgeColor}`, letterSpacing: '1px',
            }}>
              {initials}
            </div>
          )}
          <img
            src={imgSrc}
            alt={playerName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: isLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in-out',
              position: 'relative', zIndex: 1,
            }}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              photoCache[slug] = null;
              setImgError(true);
            }}
          />
        </div>
      )}

      {/* Overlay de Upload se editable=true */}
      {editable && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Trocar foto de perfil"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: Math.max(24, size * 0.32),
              height: Math.max(24, size * 0.32),
              borderRadius: '50%',
              background: uploading ? 'rgba(0,0,0,0.7)' : 'linear-gradient(135deg, #00f0ff, #0099ff)',
              border: '2px solid rgba(10,15,30,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: Math.max(10, size * 0.16),
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
              zIndex: 10,
              transition: 'all 0.2s',
            }}
          >
            {uploading ? '⏳' : uploadSuccess ? '✅' : '📷'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </>
      )}
    </div>
  );

  return avatarContent;
}
