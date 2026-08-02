'use client';

import { useState, useEffect } from 'react';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function GamersClubLink({ playerName, lvl }: { playerName: string; lvl?: number }) {
  const slug = cleanSlug(playerName);
  const [gcUrl, setGcUrl] = useState<string | null>(null);
  const [steamNick, setSteamNick] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputGc, setInputGc] = useState('');
  const [inputSteam, setInputSteam] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchPlayerData() {
      try {
        const res = await fetch(`/api/player-gc?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            if (data.gcUrl) {
              setGcUrl(data.gcUrl);
              setInputGc(data.gcUrl);
            }
            if (data.steamNick) {
              setSteamNick(data.steamNick);
              setInputSteam(data.steamNick);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPlayerData();
    return () => { cancelled = true; };
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/player-gc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerSlug: slug,
          gcUrl: inputGc,
          steamNick: inputSteam,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGcUrl(data.gcUrl || null);
        setSteamNick(data.steamNick || null);
        setIsEditing(false);
      } else {
        alert('Erro ao salvar os dados.');
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
      
      {/* Badges de Nível GamersClub, Perfil GC & Nick Steam */}
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

        {steamNick ? (
          <span
            style={{
              background: 'rgba(255,215,0,0.12)',
              border: '1px solid #ffd700',
              color: '#ffd700',
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>💨</span> STEAM: {steamNick}
          </span>
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
            ✏️ {gcUrl || steamNick ? 'Editar Nicks / Links' : 'Vincular GC / Nick Steam'}
          </button>
        )}
      </div>

      {/* Form de Edição */}
      {isEditing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: '440px', background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>🎮 LINK GAMERSCLUB:</label>
            <input
              type="url"
              placeholder="Ex: gamersclub.com.br/jogador/..."
              value={inputGc}
              onChange={e => setInputGc(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(10,15,30,0.95)',
                border: '1px solid var(--cyan)',
                padding: '0.6rem 0.9rem',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#ffd700', display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>💨 NICK NO SERVIDOR/STEAM (ex: VVS Perry):</label>
            <input
              type="text"
              placeholder="Digite seu nick exato no CS2/Steam"
              value={inputSteam}
              onChange={e => setInputSteam(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(10,15,30,0.95)',
                border: '1px solid #ffd700',
                padding: '0.6rem 0.9rem',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
                color: '#080d1a',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {saving ? 'Salvar...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
