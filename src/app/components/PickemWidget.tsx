'use client';

import { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { getTeam } from '../data';

interface PickemData {
  scores: Record<string, number>;
  mvps: Record<string, number>;
  totalPicks: number;
}

interface ScoreOption {
  id: string;
  teamWinnerId: 'venvanse' | 'desacreditados';
  scoreText: string;
  title: string;
  desc: string;
}

const MD5_SCORE_OPTIONS: ScoreOption[] = [
  { id: 'ven_3_0', teamWinnerId: 'venvanse', scoreText: '3 × 0', title: 'Varrida Limpa', desc: 'Domínio total do Venvanse' },
  { id: 'ven_3_1', teamWinnerId: 'venvanse', scoreText: '3 × 1', title: 'Vitória Firme', desc: 'Decisão em 4 mapas' },
  { id: 'ven_3_2', teamWinnerId: 'venvanse', scoreText: '3 × 2', title: 'Emoção no 5º Mapa', desc: 'Batalha até o Decider' },
  { id: 'des_3_0', teamWinnerId: 'desacreditados', scoreText: '3 × 0', title: 'Varrida Limpa', desc: 'Soberania Desacreditada' },
  { id: 'des_3_1', teamWinnerId: 'desacreditados', scoreText: '3 × 1', title: 'Vitória Firme', desc: 'Decisão em 4 mapas' },
  { id: 'des_3_2', teamWinnerId: 'desacreditados', scoreText: '3 × 2', title: 'Emoção no 5º Mapa', desc: 'Batalha até o Decider' },
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

function migrateScoreKey(key: string | null): string | null {
  if (!key) return null;
  if (key === 'ven_2_0') return 'ven_3_0';
  if (key === 'ven_2_1') return 'ven_3_1';
  if (key === 'des_2_0') return 'des_3_0';
  if (key === 'des_2_1') return 'des_3_1';
  return key;
}

export default function PickemWidget() {
  const [pickemData, setPickemData] = useState<PickemData>({
    scores: { 'ven_3_0': 4, 'ven_3_1': 7, 'ven_3_2': 5, 'des_3_0': 2, 'des_3_1': 4, 'des_3_2': 3 },
    mvps: { 'Pacal': 6, 'Tufa': 5, 'Manu': 4, 'Sorps - Leluia': 3 },
    totalPicks: 25,
  });

  const [selectedWinner, setSelectedWinner] = useState<'venvanse' | 'desacreditados'>('venvanse');
  const [selectedScore, setSelectedScore] = useState<string>('ven_3_1');
  const [selectedMvp, setSelectedMvp] = useState<string>('');
  const [savedUserPick, setSavedUserPick] = useState<{ score: string | null; mvp: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [justVoted, setJustVoted] = useState(false);

  const teamVen = getTeam('venvanse');
  const teamDes = getTeam('desacreditados');

  useEffect(() => {
    // 1. Carregar palpite do usuário do localStorage e migrar se era MD3
    const saved = localStorage.getItem('gc_pickem_grand_final_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migratedScore = migrateScoreKey(parsed.score);
        if (migratedScore) {
          setSelectedScore(migratedScore);
          if (migratedScore.startsWith('ven')) setSelectedWinner('venvanse');
          else if (migratedScore.startsWith('des')) setSelectedWinner('desacreditados');
        }
        if (parsed.mvp) setSelectedMvp(parsed.mvp);
        setSavedUserPick({ score: migratedScore, mvp: parsed.mvp || '' });
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

  const handleSelectWinner = (team: 'venvanse' | 'desacreditados') => {
    setSelectedWinner(team);
    // Preservar a margem se já havia selecionado (ex: 3x1 -> des_3_1)
    if (selectedScore) {
      const suffix = selectedScore.split('_').slice(1).join('_'); // '3_0', '3_1', '3_2'
      const prefix = team === 'venvanse' ? 'ven' : 'des';
      setSelectedScore(`${prefix}_${suffix}`);
    } else {
      setSelectedScore(team === 'venvanse' ? 'ven_3_1' : 'des_3_1');
    }
  };

  const handleConfirmPick = async () => {
    if (!selectedScore) {
      alert('Selecione o placar da decisão em MD5!');
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

  // Filtrar opções de placar para o time atualmente selecionado
  const currentTeamOptions = MD5_SCORE_OPTIONS.filter(o => o.teamWinnerId === selectedWinner);

  // Encontrar o placar salvo para visualização amigável
  const savedScoreOption = savedUserPick?.score
    ? MD5_SCORE_OPTIONS.find(o => o.id === savedUserPick.score)
    : null;

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.6rem',
        padding: '1.25rem 1.4rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        background: 'linear-gradient(145deg, rgba(11, 18, 34, 0.96) 0%, rgba(6, 11, 22, 0.98) 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255, 215, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header Compacto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 900,
              color: '#ffd700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: 'rgba(255, 215, 0, 0.12)',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}>
              🎯 BOLÃO OFICIAL · MD5
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              ({pickemData.totalPicks || 0} palpites computados)
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', margin: 0, fontFamily: 'var(--font-rajdhani)', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>
            CRAVE O CAMPEÃO & PLACAR DA <span className="text-gold">GRANDE FINAL</span>
          </h3>
        </div>

        {/* Badge de Pontuação */}
        <div style={{
          display: 'flex',
          gap: '0.45rem',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.35rem 0.65rem',
          borderRadius: '10px',
          fontSize: '0.68rem',
          fontWeight: 800,
        }}>
          <span style={{ color: '#ffd700' }}>🏆 Campeão: +10 pts</span>
          <span style={{ color: '#00f0ff' }}>⚡ Placar MD5: +15 pts</span>
          <span style={{ color: '#ec4899' }}>⭐ MVP: +10 pts</span>
        </div>
      </div>

      {/* Grid de 2 Passos Simples para MD5 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.1rem' }}>
        
        {/* PASSO 1: ESCOLHER O CAMPEÃO */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.65rem' }}>
            1. Quem leva o título? (Campeão)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {/* Time Venvanse */}
            <button
              type="button"
              onClick={() => handleSelectWinner('venvanse')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 0.8rem',
                borderRadius: '10px',
                border: selectedWinner === 'venvanse' ? '2px solid #00f0ff' : '1px solid rgba(0,240,255,0.2)',
                background: selectedWinner === 'venvanse' ? 'rgba(0, 240, 255, 0.16)' : 'rgba(0, 240, 255, 0.04)',
                boxShadow: selectedWinner === 'venvanse' ? '0 0 16px rgba(0, 240, 255, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
            >
              <TeamLogo logo={teamVen.logo} name={teamVen.name} initials={teamVen.initials} size={28} borderRadius="6px" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {teamVen.name}
                </strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontWeight: 700 }}>
                  {selectedWinner === 'venvanse' ? '✓ SELECIONADO' : 'Votar neste'}
                </span>
              </div>
            </button>

            {/* Time Desacreditados */}
            <button
              type="button"
              onClick={() => handleSelectWinner('desacreditados')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 0.8rem',
                borderRadius: '10px',
                border: selectedWinner === 'desacreditados' ? '2px solid #ff3366' : '1px solid rgba(255,51,102,0.2)',
                background: selectedWinner === 'desacreditados' ? 'rgba(255, 51, 102, 0.16)' : 'rgba(255, 51, 102, 0.04)',
                boxShadow: selectedWinner === 'desacreditados' ? '0 0 16px rgba(255, 51, 102, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
            >
              <TeamLogo logo={teamDes.logo} name={teamDes.name} initials={teamDes.initials} size={28} borderRadius="6px" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {teamDes.name}
                </strong>
                <span style={{ fontSize: '0.65rem', color: '#ff7891', fontWeight: 700 }}>
                  {selectedWinner === 'desacreditados' ? '✓ SELECIONADO' : 'Votar neste'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* PASSO 2: ESCOLHER O PLACAR DA MD5 (3x0, 3x1, 3x2) */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              2. Placar da Série MD5:
            </label>
            <span style={{ fontSize: '0.68rem', color: selectedWinner === 'venvanse' ? 'var(--cyan)' : '#ff7891', fontWeight: 800 }}>
              Vitória do {selectedWinner === 'venvanse' ? 'Venvanse' : 'Desacreditados'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {currentTeamOptions.map((opt) => {
              const isSelected = selectedScore === opt.id;
              const voteCount = pickemData.scores[opt.id] || 0;
              const pct = Math.round((voteCount / totalScoreVotes) * 100);
              const highlightColor = selectedWinner === 'venvanse' ? 'var(--cyan)' : '#ff3366';

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedScore(opt.id)}
                  style={{
                    padding: '0.55rem 0.4rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.18), rgba(15,23,42,0.9))'
                      : 'rgba(15, 23, 42, 0.7)',
                    boxShadow: isSelected ? '0 0 14px rgba(255,215,0,0.35)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    {opt.scoreText}
                  </strong>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>
                    {opt.title}
                  </span>
                  <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.2rem' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: isSelected ? '#ffd700' : highlightColor }} />
                  </div>
                  <span style={{ fontSize: '0.62rem', color: isSelected ? '#ffd700' : '#cbd5e1', fontWeight: 800 }}>
                    {pct}% ({voteCount})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* PASSO 3 & CONFIRMAÇÃO EM LINHA COMPACTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        paddingTop: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Seletor de MVP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ⭐ MVP:
          </span>
          <select
            value={selectedMvp}
            onChange={(e) => setSelectedMvp(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#fff',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '220px',
            }}
          >
            <option value="">Selecione o MVP da final...</option>
            {FINAL_PLAYERS.map((p) => {
              const teamName = p.teamId === 'venvanse' ? 'Venvanse' : 'Desacreditados';
              return (
                <option key={p.name} value={p.name}>
                  {p.name} ({teamName} · K/D {p.kd})
                </option>
              );
            })}
          </select>

          {/* Status do palpite atual */}
          {savedScoreOption && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              ✓ Salvo: {savedScoreOption.teamWinnerId === 'venvanse' ? 'Venvanse' : 'Desacreditados'} {savedScoreOption.scoreText}
              {savedUserPick?.mvp ? ` (MVP: ${savedUserPick.mvp})` : ''}
            </span>
          )}
        </div>

        {/* Botão de Confirmação */}
        <button
          onClick={handleConfirmPick}
          disabled={loading || !selectedScore}
          style={{
            background: justVoted
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ffd700 0%, #ff9900 100%)',
            color: '#080d1a',
            border: 'none',
            padding: '0.6rem 1.4rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-rajdhani)',
            fontWeight: 900,
            letterSpacing: '0.5px',
            cursor: !selectedScore || loading ? 'not-allowed' : 'pointer',
            opacity: !selectedScore ? 0.6 : 1,
            boxShadow: justVoted ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 18px rgba(255, 215, 0, 0.35)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'SALVANDO...' : justVoted ? '✅ PALPITE CONFIRMADO!' : savedUserPick ? '🔄 ATUALIZAR PALPITE' : '🎯 CONFIRMAR PALPITE'}
        </button>
      </div>
    </div>
  );
}
