'use client';

import { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { getTeam } from '../data';

interface PickemData {
  scores: Record<string, number>;
  mvps: Record<string, number>;
  totalPicks: number;
}

const SCORE_OPTIONS = [
  { id: 'ven_2_0', teamWinnerId: 'venvanse', scoreText: '2 × 0', label: 'Venvanse 2x0', desc: 'Passeio do Venvanse' },
  { id: 'ven_2_1', teamWinnerId: 'venvanse', scoreText: '2 × 1', label: 'Venvanse 2x1', desc: 'Batalha até o 3º Mapa' },
  { id: 'des_2_1', teamWinnerId: 'desacreditados', scoreText: '2 × 1', label: 'Desacreditados 2x1', desc: 'Vitória sofrida no Decider' },
  { id: 'des_2_0', teamWinnerId: 'desacreditados', scoreText: '2 × 0', label: 'Desacreditados 2x0', desc: 'Soberania Desacreditada' },
];

const FINAL_PLAYERS = [
  { name: 'Pacal', teamId: 'venvanse', kd: '1.54' },
  { name: 'Tufa', teamId: 'desacreditados', kd: '1.51' },
  { name: 'Sorps - Leluia', teamId: 'desacreditados', kd: '1.48' },
  { name: 'Distress - Pedro', teamId: 'desacreditados', kd: '1.25' },
  { name: 'Samuka', teamId: 'venvanse', kd: '1.15' },
  { name: 'Manu', teamId: 'venvanse', kd: '1.09' },
  { name: 'Gio', teamId: 'desacreditados', kd: '0.98' },
  { name: 'Galaxy', teamId: 'desacreditados', kd: '0.88' },
  { name: 'Baronelis', teamId: 'venvanse', kd: '0.72' },
  { name: 'Duzão', teamId: 'venvanse', kd: '0.63' },
];

export default function PickemWidget() {
  const [pickemData, setPickemData] = useState<PickemData>({
    scores: { 'ven_2_0': 4, 'ven_2_1': 6, 'des_2_1': 3, 'des_2_0': 2 },
    mvps: { 'Pacal': 5, 'Tufa': 4 },
    totalPicks: 15,
  });

  const [selectedScore, setSelectedScore] = useState<string | null>(null);
  const [selectedMvp, setSelectedMvp] = useState<string>('');
  const [savedUserPick, setSavedUserPick] = useState<{ score: string | null; mvp: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [justVoted, setJustVoted] = useState(false);

  const teamVen = getTeam('venvanse');
  const teamDes = getTeam('desacreditados');

  useEffect(() => {
    // 1. Carregar palpite do usuário do localStorage
    const saved = localStorage.getItem('gc_pickem_grand_final_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.score) setSelectedScore(parsed.score);
        if (parsed.mvp) setSelectedMvp(parsed.mvp);
        setSavedUserPick(parsed);
      } catch (e) {}
    }

    // 2. Carregar dados ao vivo da API
    async function fetchPickem() {
      try {
        const res = await fetch('/api/pickem', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.scores) {
            setPickemData(data);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchPickem();
  }, []);

  const handleConfirmPick = async () => {
    if (!selectedScore) {
      alert('Selecione um placar exato para a Grande Final!');
      return;
    }

    setLoading(true);
    const prevScore = savedUserPick?.score || null;
    const prevMvp = savedUserPick?.mvp || null;

    try {
      const res = await fetch('/api/pickem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scoreChoice: selectedScore,
          mvpChoice: selectedMvp || undefined,
          prevScoreChoice: prevScore,
          prevMvpChoice: prevMvp,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPickemData(updated);
        const newSaved = { score: selectedScore, mvp: selectedMvp };
        setSavedUserPick(newSaved);
        localStorage.setItem('gc_pickem_grand_final_v1', JSON.stringify(newSaved));
        setJustVoted(true);
        setTimeout(() => setJustVoted(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalScoreVotes = Object.values(pickemData.scores || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '3rem',
        padding: '2.2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 215, 0, 0.35)',
        background: 'linear-gradient(135deg, rgba(12, 19, 36, 0.95) 0%, rgba(6, 11, 24, 0.98) 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255, 215, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow de fundo */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', background: 'rgba(255, 215, 0, 0.15)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      {/* Header do Widget */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#ffd700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            marginBottom: '0.5rem',
          }}>
            🎯 GAMIFICAÇÃO & DESAFIO DA COMUNIDADE
          </span>
          <h2 style={{ fontSize: '2.1rem', margin: 0, fontFamily: 'var(--font-rajdhani)', fontWeight: 900, color: '#fff' }}>
            BOLÃO DA <span className="text-gold">GRANDE FINAL</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
            Crava o placar exato da MD3 e o MVP da finalíssima. Acerte para liderar o ranking de palpites da Gurizada!
          </p>
        </div>

        {/* Badge de Pontuação */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 0.8rem',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: 700,
        }}>
          <span style={{ color: '#ffd700' }}>🏆 Campeão: +10 pts</span>
          <span style={{ color: '#00f0ff' }}>⚡ Placar: +15 pts</span>
          <span style={{ color: '#ec4899' }}>⭐ MVP: +10 pts</span>
        </div>
      </div>

      {/* Grid de Escolha do Placar Exato */}
      <div style={{ marginBottom: '1.8rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
          1. Escolha o Placar Exato da MD3:
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {SCORE_OPTIONS.map((opt) => {
            const team = opt.teamWinnerId === 'venvanse' ? teamVen : teamDes;
            const isSelected = selectedScore === opt.id;
            const voteCount = pickemData.scores[opt.id] || 0;
            const percentage = Math.round((voteCount / totalScoreVotes) * 100);
            const teamColor = opt.teamWinnerId === 'venvanse' ? 'var(--cyan)' : '#ff3366';

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedScore(opt.id)}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(13, 20, 36, 0.95) 100%)`
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected
                    ? '2px solid #ffd700'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.35)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  position: 'relative',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                }}
              >
                {/* Header da Opção */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={28} borderRadius="6px" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: teamColor }}>
                      {team.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.75rem', background: '#ffd700', color: '#000', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 900 }}>
                      ✓ ESCOLHIDO
                    </span>
                  )}
                </div>

                {/* Placar em destaque */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0.2rem 0' }}>
                  <strong style={{ fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>
                    {opt.scoreText}
                  </strong>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffd700' }}>
                    {percentage}% ({voteCount} votos)
                  </span>
                </div>

                {/* Barra de porcentagem da comunidade */}
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: isSelected ? '#ffd700' : teamColor, transition: 'width 0.4s ease' }} />
                </div>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seletor de MVP da Grande Final */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
          2. Palpite de MVP da Grande Final (Opcional):
        </label>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedMvp}
            onChange={(e) => setSelectedMvp(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#fff',
              padding: '0.75rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              minWidth: '260px',
              outline: 'none',
            }}
          >
            <option value="">Selecione o craque da decisão...</option>
            {FINAL_PLAYERS.map((p) => {
              const team = p.teamId === 'venvanse' ? 'Venvanse' : 'Os Desacreditados';
              return (
                <option key={p.name} value={p.name}>
                  {p.name} ({team} · K/D {p.kd})
                </option>
              );
            })}
          </select>

          {selectedMvp && (
            <span style={{ fontSize: '0.82rem', color: '#ffd700', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              ⭐ Craque Escolhido: <strong>{selectedMvp}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Botão de Enviar / Status do Palpite */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {savedUserPick ? (
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="status-pulse-dot" style={{ background: '#10b981' }}></span>
              Seu palpite está salvo: <strong>{SCORE_OPTIONS.find(o => o.id === savedUserPick.score)?.label}</strong>
              {savedUserPick.mvp ? ` · MVP: ${savedUserPick.mvp}` : ''}
            </span>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Você ainda não registrou seu palpite para a final.
            </span>
          )}
        </div>

        <button
          onClick={handleConfirmPick}
          disabled={loading || !selectedScore}
          style={{
            background: justVoted
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ffd700 0%, #ff9900 100%)',
            color: '#080d1a',
            border: 'none',
            padding: '0.85rem 2rem',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 900,
            letterSpacing: '0.5px',
            cursor: !selectedScore || loading ? 'not-allowed' : 'pointer',
            opacity: !selectedScore ? 0.5 : 1,
            boxShadow: justVoted ? '0 0 25px rgba(16, 185, 129, 0.6)' : '0 0 25px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.25s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {loading ? 'SALVANDO...' : justVoted ? '✅ PALPITE CONFIRMADO!' : savedUserPick ? '🔄 ATUALIZAR MEU PALPITE' : '🎯 CONFIRMAR PALPITE NO BOLÃO'}
        </button>
      </div>
    </div>
  );
}
