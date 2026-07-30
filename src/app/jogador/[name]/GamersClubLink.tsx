'use client';

import { useState, useEffect } from 'react';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function GamersClubLink({ playerName }: { playerName: string }) {
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

  return (
    <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      {!isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {gcUrl ? (
            <a
              href={gcUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
                color: '#fff',
                padding: '0.45rem 1.2rem',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 15px rgba(255,71,87,0.4)',
                transition: 'transform 0.2s',
              }}
            >
              <span>🎮</span> PERFIL GAMERSCLUB ↗
            </a>
          ) : null}

          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '0.4rem 0.9rem',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            ✏️ {gcUrl ? 'Editar Link GC' : 'Adicionar Perfil GamersClub'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '420px', alignItems: 'center' }}>
          <input
            type="url"
            placeholder="Cole seu link da GC (ex: gamersclub.com.br/jogador/...)"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(10,15,30,0.95)',
              border: '1px solid var(--cyan)',
              padding: '0.5rem 0.8rem',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.82rem',
            }}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
              color: '#080d1a',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.8rem',
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
              padding: '0.5rem 0.8rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
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
