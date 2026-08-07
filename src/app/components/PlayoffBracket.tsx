'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeam, playoffMatches } from '../data';
import TeamLogo from './TeamLogo';

interface MatchVoteData {
  a: number;
  b: number;
}

export default function PlayoffBracket() {
  // Estado da Simulação Pessoal
  const [semi1Winner, setSemi1Winner] = useState<string | null>(null);
  const [semi2Winner, setSemi2Winner] = useState<string | null>(null);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  const [thirdWinner, setThirdWinner] = useState<string | null>(null);

  // Votos da Comunidade (API)
  const [communityVotes, setCommunityVotes] = useState<Record<string, MatchVoteData>>({
    'semi-1': { a: 0, b: 0 },
    'semi-2': { a: 0, b: 0 },
    'final': { a: 0, b: 0 },
    'third_place': { a: 0, b: 0 },
  });

  // Carregar palpite do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gc_playoff_sim_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.semi1Winner) setSemi1Winner(parsed.semi1Winner);
        if (parsed.semi2Winner) setSemi2Winner(parsed.semi2Winner);
        if (parsed.finalWinner) setFinalWinner(parsed.finalWinner);
        if (parsed.thirdWinner) setThirdWinner(parsed.thirdWinner);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Salvar palpite no localStorage
  const saveSimulation = (s1: string | null, s2: string | null, fin: string | null, thi: string | null) => {
    try {
      localStorage.setItem('gc_playoff_sim_v2', JSON.stringify({
        semi1Winner: s1,
        semi2Winner: s2,
        finalWinner: fin,
        thirdWinner: thi,
      }));
    } catch (e) {
      // Ignore
    }
  };

  // Buscar contagem de votos da API
  const fetchCommunityVotes = async () => {
    const matchIds = ['semi-1', 'semi-2', 'final', 'third_place'];
    const newVotes: Record<string, MatchVoteData> = {};

    await Promise.all(
      matchIds.map(async (mId) => {
        try {
          const res = await fetch(`/api/votes?matchId=${mId}`);
          if (res.ok) {
            const data = await res.json();
            newVotes[mId] = { a: data.a || 0, b: data.b || 0 };
          }
        } catch (e) {
          // Ignore
        }
      })
    );

    setCommunityVotes(prev => ({ ...prev, ...newVotes }));
  };

  useEffect(() => {
    fetchCommunityVotes();
  }, []);

  // Votar / Palpitar em uma partida
  const handlePickTeam = async (matchId: string, teamChoice: 'a' | 'b', teamId: string) => {
    let nextS1 = semi1Winner;
    let nextS2 = semi2Winner;
    let nextFin = finalWinner;
    let nextThi = thirdWinner;

    if (matchId === 'semi-1') {
      nextS1 = teamId;
      // Se trocou o vencedor da semi1 e ele era o campeao final, limpa o finalWinner
      if (finalWinner && finalWinner !== teamId && finalWinner !== semi2Winner) {
        nextFin = null;
      }
    } else if (matchId === 'semi-2') {
      nextS2 = teamId;
      if (finalWinner && finalWinner !== teamId && finalWinner !== semi1Winner) {
        nextFin = null;
      }
    } else if (matchId === 'final') {
      nextFin = teamId;
    } else if (matchId === 'third_place') {
      nextThi = teamId;
    }

    setSemi1Winner(nextS1);
    setSemi2Winner(nextS2);
    setFinalWinner(nextFin);
    setThirdWinner(nextThi);
    saveSimulation(nextS1, nextS2, nextFin, nextThi);

    // Enviar voto para o servidor
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, team: teamChoice }),
      });
      if (res.ok) {
        const data = await res.json();
        setCommunityVotes(prev => ({
          ...prev,
          [matchId]: { a: data.a || 0, b: data.b || 0 }
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSimulation = () => {
    if (confirm('Deseja resetar a sua simulação dos playoffs?')) {
      setSemi1Winner(null);
      setSemi2Winner(null);
      setFinalWinner(null);
      setThirdWinner(null);
      localStorage.removeItem('gc_playoff_sim_v2');
    }
  };

  // Equipes da Semi 1
  const semi1TeamA = getTeam('desacreditados');
  const semi1TeamB = getTeam('maconhaco');
  const semi1LoserId = semi1Winner === 'desacreditados' ? 'maconhaco' : semi1Winner === 'maconhaco' ? 'desacreditados' : null;

  // Equipes da Semi 2
  const semi2TeamA = getTeam('gilsons');
  const semi2TeamB = getTeam('venvanse');
  const semi2LoserId = semi2Winner === 'gilsons' ? 'venvanse' : semi2Winner === 'venvanse' ? 'gilsons' : null;

  // Equipes da Grande Final
  const finalTeamA = semi1Winner ? getTeam(semi1Winner) : null;
  const finalTeamB = semi2Winner ? getTeam(semi2Winner) : null;

  // Equipes do 3º Lugar
  const thirdTeamA = semi1LoserId ? getTeam(semi1LoserId) : null;
  const thirdTeamB = semi2LoserId ? getTeam(semi2LoserId) : null;

  // Função genérica de renderização de card com suporte a clique/voto
  const renderInteractiveMatchCard = (
    matchId: string,
    stageTitle: string,
    teamAObj: any,
    teamBObj: any,
    labelA: string,
    labelB: string,
    selectedWinnerId: string | null,
    isFinal = false,
    isThird = false
  ) => {
    const votesData = communityVotes[matchId] || { a: 0, b: 0 };
    const totalVotes = votesData.a + votesData.b;

    const pctA = totalVotes > 0 ? Math.round((votesData.a / totalVotes) * 100) : 50;
    const pctB = totalVotes > 0 ? Math.round((votesData.b / totalVotes) * 100) : 50;

    let borderColor = 'rgba(0, 240, 255, 0.3)';
    let glowColor = 'rgba(0, 240, 255, 0.1)';

    if (isFinal) {
      borderColor = 'rgba(255, 215, 0, 0.6)';
      glowColor = 'rgba(255, 215, 0, 0.2)';
    } else if (isThird) {
      borderColor = 'rgba(205, 127, 50, 0.5)';
      glowColor = 'rgba(205, 127, 50, 0.15)';
    }

    return (
      <div
        className="glass-card"
        style={{
          padding: '1.2rem',
          borderRadius: '18px',
          border: `1.5px solid ${borderColor}`,
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 14, 28, 0.98) 100%)`,
          boxShadow: `0 8px 32px ${glowColor}`,
          position: 'relative',
          minWidth: '300px',
          transition: 'all 0.3s',
        }}
      >
        {/* Header do Confronto */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.6rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: isFinal ? '#ffd700' : isThird ? '#cd7f32' : 'var(--cyan)',
            }}
          >
            {stageTitle}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            Data a definir
          </span>
        </div>

        {/* TIME A */}
        <div
          onClick={() => teamAObj && handlePickTeam(matchId, 'a', teamAObj.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.7rem 0.9rem',
            borderRadius: '12px',
            background: selectedWinnerId === teamAObj?.id ? (isFinal ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 240, 255, 0.2)') : 'rgba(255, 255, 255, 0.03)',
            marginBottom: '0.6rem',
            border: selectedWinnerId === teamAObj?.id ? `2px solid ${isFinal ? '#ffd700' : 'var(--cyan)'}` : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: teamAObj ? 'pointer' : 'default',
            transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {teamAObj ? (
              <>
                <TeamLogo logo={teamAObj.logo} name={teamAObj.name} initials={teamAObj.initials} size={34} borderRadius="6px" />
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block' }}>{teamAObj.name}</strong>
                  <span style={{ fontSize: '0.68rem', color: selectedWinnerId === teamAObj.id ? (isFinal ? '#ffd700' : 'var(--cyan)') : '#94a3b8' }}>
                    {labelA}
                  </span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>{labelA}</span>
            )}
          </div>

          {teamAObj && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              {selectedWinnerId === teamAObj.id ? (
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: isFinal ? '#ffd700' : 'var(--cyan)', color: '#080d1a', padding: '0.15rem 0.5rem', borderRadius: '8px', textTransform: 'uppercase' }}>
                  {isFinal ? '👑 CAMPEÃO ✅' : 'VENCEDOR ✅'}
                </span>
              ) : (
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                  VOTAR ➔
                </span>
              )}
              {totalVotes > 0 && (
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
                  🔥 {pctA}% ({votesData.a}v)
                </span>
              )}
            </div>
          )}
        </div>

        {/* BARRA DE VOTOS DA COMUNIDADE */}
        {totalVotes > 0 && (
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', margin: '0.4rem 0', display: 'flex' }}>
            <div style={{ width: `${pctA}%`, background: 'var(--cyan)', transition: 'width 0.4s' }}></div>
            <div style={{ width: `${pctB}%`, background: '#ff4757', transition: 'width 0.4s' }}></div>
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '0.2rem 0', fontSize: '0.68rem', color: '#64748b', fontWeight: 800 }}>VS</div>

        {/* TIME B */}
        <div
          onClick={() => teamBObj && handlePickTeam(matchId, 'b', teamBObj.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.7rem 0.9rem',
            borderRadius: '12px',
            background: selectedWinnerId === teamBObj?.id ? (isFinal ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 240, 255, 0.2)') : 'rgba(255, 255, 255, 0.03)',
            border: selectedWinnerId === teamBObj?.id ? `2px solid ${isFinal ? '#ffd700' : 'var(--cyan)'}` : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: teamBObj ? 'pointer' : 'default',
            transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {teamBObj ? (
              <>
                <TeamLogo logo={teamBObj.logo} name={teamBObj.name} initials={teamBObj.initials} size={34} borderRadius="6px" />
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block' }}>{teamBObj.name}</strong>
                  <span style={{ fontSize: '0.68rem', color: selectedWinnerId === teamBObj.id ? (isFinal ? '#ffd700' : 'var(--cyan)') : '#94a3b8' }}>
                    {labelB}
                  </span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>{labelB}</span>
            )}
          </div>

          {teamBObj && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              {selectedWinnerId === teamBObj.id ? (
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: isFinal ? '#ffd700' : 'var(--cyan)', color: '#080d1a', padding: '0.15rem 0.5rem', borderRadius: '8px', textTransform: 'uppercase' }}>
                  {isFinal ? '👑 CAMPEÃO ✅' : 'VENCEDOR ✅'}
                </span>
              ) : (
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                  VOTAR ➔
                </span>
              )}
              {totalVotes > 0 && (
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
                  🔥 {pctB}% ({votesData.b}v)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const finalWinnerTeam = finalWinner ? getTeam(finalWinner) : null;

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }} className="custom-scrollbar">
      
      {/* HEADER DAS CHAVES E INSTRUÇÃO DO SIMULADOR */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid #ffd700', borderRadius: '30px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          🎮 SIMULADOR & VOTAÇÃO DOS PLAYOFFS
        </div>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
          FAÇA SEUS <span className="text-cyan">PALPITES</span> & MONTE AS CHAVES
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '700px', margin: '0.4rem auto 0 auto' }}>
          Clique nos times vencedores de cada semifinal para simular quem avança para a Grande Final e votar no seu campeão!
        </p>

        {(semi1Winner || semi2Winner || finalWinner || thirdWinner) && (
          <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleResetSimulation}
              style={{ background: 'rgba(255, 71, 87, 0.15)', border: '1px solid #ff4757', color: '#ff4757', padding: '0.4rem 1.2rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              🔄 Resetar Meus Palpites
            </button>
          </div>
        )}

        {/* CAMPEÃO PALPITADO BANNER */}
        {finalWinnerTeam && (
          <div style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', border: '2px solid #ffd700', borderRadius: '20px', padding: '0.8rem 1.8rem', boxShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
            <span style={{ fontSize: '1.8rem' }}>🏆</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.68rem', color: '#ffd700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>SEU PALPITE PARA CAMPEÃO</span>
              <strong style={{ fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>{finalWinnerTeam.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* ARVORE DE CHAVES / BRACKET TREE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
          maxWidth: '1150px',
          margin: '0 auto',
        }}
      >
        {/* COLUNA 1: SEMIFINAIS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            🔥 SEMIFINAIS (MD3)
          </div>
          {renderInteractiveMatchCard('semi-1', 'SEMIFINAL 1', semi1TeamA, semi1TeamB, '1º do Grupo A', '2º do Grupo B', semi1Winner)}
          {renderInteractiveMatchCard('semi-2', 'SEMIFINAL 2', semi2TeamA, semi2TeamB, '1º do Grupo B', '2º do Grupo A', semi2Winner)}
        </div>

        {/* COLUNA 2: GRANDE FINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#ffd700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            👑 DISPUTA DO TÍTULO
          </div>
          {renderInteractiveMatchCard(
            'final',
            '🏆 GRANDE FINAL',
            finalTeamA,
            finalTeamB,
            semi1Winner ? `Vencedor Semi 1 (${getTeam(semi1Winner).initials})` : 'Vencedor Semi 1',
            semi2Winner ? `Vencedor Semi 2 (${getTeam(semi2Winner).initials})` : 'Vencedor Semi 2',
            finalWinner,
            true
          )}
        </div>

        {/* COLUNA 3: 3º LUGAR */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#cd7f32', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            🥉 3º LUGAR
          </div>
          {renderInteractiveMatchCard(
            'third_place',
            '🥉 DISPUTA DE 3º LUGAR',
            thirdTeamA,
            thirdTeamB,
            semi1LoserId ? `Perdedor Semi 1 (${getTeam(semi1LoserId).initials})` : 'Perdedor Semi 1',
            semi2LoserId ? `Perdedor Semi 2 (${getTeam(semi2LoserId).initials})` : 'Perdedor Semi 2',
            thirdWinner,
            false,
            true
          )}
        </div>

      </div>

    </div>
  );
}

