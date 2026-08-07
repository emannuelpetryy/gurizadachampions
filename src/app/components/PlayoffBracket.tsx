'use client';

import Link from 'next/link';
import { getTeam, playoffMatches } from '../data';
import TeamLogo from './TeamLogo';

export default function PlayoffBracket() {
  const semi1 = playoffMatches.find(m => m.id === 'semi-1')!;
  const semi2 = playoffMatches.find(m => m.id === 'semi-2')!;
  const grandFinal = playoffMatches.find(m => m.id === 'final')!;
  const thirdPlace = playoffMatches.find(m => m.id === 'third_place')!;

  const renderMatchCard = (
    match: typeof semi1,
    isFinal = false,
    isThird = false
  ) => {
    const teamA = match.teamAId ? getTeam(match.teamAId) : null;
    const teamB = match.teamBId ? getTeam(match.teamBId) : null;

    let borderColor = 'rgba(0, 240, 255, 0.2)';
    let glowColor = 'rgba(0, 240, 255, 0.08)';

    if (isFinal) {
      borderColor = 'rgba(255, 215, 0, 0.5)';
      glowColor = 'rgba(255, 215, 0, 0.15)';
    } else if (isThird) {
      borderColor = 'rgba(205, 127, 50, 0.4)';
      glowColor = 'rgba(205, 127, 50, 0.1)';
    }

    return (
      <div
        className="glass-card match-card-hover"
        style={{
          padding: '1.2rem',
          borderRadius: '16px',
          border: `1px solid ${borderColor}`,
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 14, 28, 0.95) 100%)`,
          boxShadow: `0 8px 32px ${glowColor}`,
          position: 'relative',
          minWidth: '280px',
        }}
      >
        {/* Stage & Status Header */}
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
            {isFinal ? '🏆 GRANDE FINAL' : isThird ? '🥉 3º LUGAR' : match.stage}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {match.dateDisplay}
          </span>
        </div>

        {/* Team A */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            marginBottom: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {teamA ? (
              <>
                <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={32} borderRadius="6px" />
                <div>
                  <Link href={`/time/${teamA.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{teamA.name}</strong>
                  </Link>
                  <span style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>{match.labelA}</span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>{match.labelA}</span>
            )}
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-rajdhani)', color: match.scoreA !== null ? '#fff' : '#64748b' }}>
            {match.scoreA !== null ? match.scoreA : '-'}
          </span>
        </div>

        {/* VS Divider */}
        <div style={{ textAlign: 'center', margin: '0.2rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>VS</div>

        {/* Team B */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {teamB ? (
              <>
                <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={32} borderRadius="6px" />
                <div>
                  <Link href={`/time/${teamB.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{teamB.name}</strong>
                  </Link>
                  <span style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>{match.labelB}</span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>{match.labelB}</span>
            )}
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-rajdhani)', color: match.scoreB !== null ? '#fff' : '#64748b' }}>
            {match.scoreB !== null ? match.scoreB : '-'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }} className="custom-scrollbar">
      
      {/* HEADER DAS CHAVES */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid #ffd700', borderRadius: '30px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          ⚔️ FASE MATA-MATA (PLAYOFFS)
        </div>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
          CHAVES E <span className="text-cyan">CONFRONTOS</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Os 2 primeiros colocados de cada grupo se enfrentam nas Semifinais em busca do título da Gurizada Champions Cup.
        </p>
      </div>

      {/* ARVORE DE CHAVES / BRACKET TREE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* COLUNA 1: SEMIFINAIS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            🔥 SEMIFINAIS (MD3)
          </div>
          {renderMatchCard(semi1)}
          {renderMatchCard(semi2)}
        </div>

        {/* COLUNA 2: GRANDE FINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#ffd700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            👑 DISPUTA DO TÍTULO
          </div>
          {renderMatchCard(grandFinal, true)}
        </div>

        {/* COLUNA 3: 3º LUGAR */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#cd7f32', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            🥉 3º LUGAR
          </div>
          {renderMatchCard(thirdPlace, false, true)}
        </div>

      </div>

    </div>
  );
}
