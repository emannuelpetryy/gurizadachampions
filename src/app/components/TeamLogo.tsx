'use client';

import { useState, useEffect, useRef } from 'react';

export default function TeamLogo({ 
  logo, 
  name, 
  initials, 
  size = 48,
  borderRadius = '10px'
}: { 
  logo?: string, 
  name: string, 
  initials: string, 
  size?: number,
  borderRadius?: string
}) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    setImgError(false);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [logo]);

  // Se não tem logo ou se deu erro de carregamento, renderiza o badge com as iniciais do time
  if (!logo || imgError) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: borderRadius, 
          fontSize: `${size * 0.35}px`,
          flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(13,20,36,0.9) 100%)',
          border: '1px solid rgba(0,240,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 'bold',
          letterSpacing: '1px',
          boxShadow: '0 0 10px rgba(0,240,255,0.1)'
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: borderRadius, 
        overflow: 'hidden', 
        position: 'relative',
        flexShrink: 0,
        background: 'rgba(0,0,0,0.4)',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
      }}
    >
      {!isLoaded && (
        <div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: borderRadius, 
            fontSize: `${size * 0.35}px`,
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(13,20,36,0.9) 100%)',
            border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 'bold',
            zIndex: 0
          }}
        >
          {initials}
        </div>
      )}

      <img 
        ref={imgRef}
        src={encodeURI(logo)} 
        alt="" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          position: 'relative',
          zIndex: 1,
          display: 'block'
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgError(true)}
      />
    </div>
  );
}
