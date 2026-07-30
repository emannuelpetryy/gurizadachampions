'use client';

import { useState, useEffect } from 'react';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function GamersClubLink({ playerName, lvl }: { playerName: string; lvl?: number }) {
  const slug = cleanSlug(playerName);
  const [gcUrl, setGcUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchGcLink() {
      try {
        const res = await fetch(`/api/player-gc?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.gcUrl) {
            setGcUrl(data.gcUrl);
            setInputValue(data.gcUrl);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGcLink();
    return () => { cancelled = true; };
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/player-gc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSlug: slug, gcUrl: inputValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setGcUrl(data.gcUrl || null);
        setIsEditing(false);
      } else {
        alert('Erro ao salvar o link da GamersClub.');
      }
    } catch (e) {
      alert('Erro de conexão ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const playerLvl = lvl || 15;
  const getLevelColor = (level: number) => {
    if (level >= 18) return { bg: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#080d1a', border: '#ffd700', text: 'TIER S - LENDÁRIO' };
    if (level >= 14) return { bg: 'linear-gradient(135deg, #00f0ff, #0099ff)', color: '#080d1a', border: '#00f0ff', text: 'TIER A - ELITE' };
    if (level >= 10) return { bg: 'linear-gradient(135deg, #ab47bc, #8e24aa)', color: '#fff', border: '#ab47bc', text: 'TIER B - PRO' };
    return { bg: 'rgba(255,255,255,0.15)', color: '#fff', border: 'rgba(255,255,255,0.3)', text: 'DESAFIANTE' };
  };

  const badgeStyle = getLevelColor(playerLvl);

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
      {/* Badge de Nível GamersClub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{
            background: badgeStyle.bg,
            color: badgeStyle.color,
            padding: '0.5rem 1.4rem',
            borderRadius: '20px',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: '1px',
            boxShadow: `0 0 20px ${badgeStyle.border}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span>🎯</span>
          <span>GAMERSCLUB LEVEL {playerLvl} • {badgeStyle.text}</span>
        </div>

        {gcUrl ? (
          <a
            href={gcUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
              color: '#fff',
              padding: '0.5rem 1.3rem',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 18px rgba(255,71,87,0.4)',
              transition: 'transform 0.2s',
            }}
          >
            <span>🎮</span> PERFIL GC ↗
          </a>
        ) : null}

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '0.45rem 1rem',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            ✏️ {gcUrl ? 'Editar Link GC' : 'Adicionar Link GC'}
          </button>
        )}
      </div>

      {/* Form de Edição */}
      {isEditing && (
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '440px', alignItems: 'center', marginTop: '0.3rem' }}>
          <input
            type="url"
            placeholder="Cole seu link da GC (ex: gamersclub.com.br/jogador/...)"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(10,15,30,0.95)',
              border: '1px solid var(--cyan)',
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.85rem',
            }}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
              color: '#080d1a',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {saving ? '...' : 'Salvar'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
