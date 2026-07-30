'use client';

import { useState } from 'react';

export default function TwitchLiveStream() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="glass-card"
      style={{
        gridColumn: '1 / -1',
        marginBottom: '2.5rem',
        border: '1px solid var(--cyan)',
        boxShadow: isOpen ? '0 0 35px rgba(0,240,255,0.2)' : '0 0 15px rgba(0,240,255,0.1)',
        background: 'linear-gradient(135deg, rgba(13,20,36,0.95) 0%, rgba(0,240,255,0.08) 100%)',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 12px #ff3366' }}></span>
          <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}>
            🔴 TRANSMISSÃO AO VIVO DA LIGA (@beckeryeshua)
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={isOpen ? "btn-secondary" : "btn-primary"}
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>{isOpen ? '🔼 Minimizar Live' : '▶️ Assistir Live Integrada'}</span>
          </button>

          <a
            href="https://www.twitch.tv/beckeryeshua"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none', margin: 0 }}
          >
            Twitch ↗
          </a>
        </div>
      </div>

      {isOpen && (
        <div style={{ position: 'relative', paddingBottom: '45%', height: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginTop: '1.2rem' }}>
          <iframe
            src="https://player.twitch.tv/?channel=beckeryeshua&parent=gurizadachampions.vercel.app&parent=localhost&autoplay=false"
            title="Transmissão Ao Vivo CS2"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
