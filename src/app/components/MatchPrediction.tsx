'use client';

import { useState, useEffect } from 'react';

export default function MatchPrediction({ 
  matchId, 
  teamAName, 
  teamBName 
}: { 
  matchId: number, 
  teamAName: string, 
  teamBName: string 
}) {
  const [votes, setVotes] = useState({ a: 0, b: 0 });
  const [userVote, setUserVote] = useState<'a' | 'b' | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Carregar o voto pessoal deste dispositivo
    const savedUserVote = localStorage.getItem(`gc_pred_user_${matchId}`);
    if (savedUserVote === 'a' || savedUserVote === 'b') {
      setUserVote(savedUserVote);
    }

    // 2. Carregar votos GLOBAIS compartilhados da API
    fetch(`/api/votes?matchId=${matchId}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.a === 'number' && typeof data.b === 'number') {
          setVotes({ a: data.a, b: data.b });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [matchId]);

  const handleVote = async (team: 'a' | 'b') => {
    if (userVote || isSubmitting) return;

    setIsSubmitting(true);
    // Atualização otimista local
    const newVotes = { ...votes, [team]: votes[team] + 1 };
    setVotes(newVotes);
    setUserVote(team);
    setJustVoted(true);

    // Salvar escolha deste dispositivo
    localStorage.setItem(`gc_pred_user_${matchId}`, team);

    // Enviar voto GLOBAL para o servidor/cloud DB
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, team })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.a === 'number' && typeof data.b === 'number') {
          setVotes({ a: data.a, b: data.b });
        }
      }
    } catch (e) {
      console.error('Erro ao enviar voto global:', e);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setJustVoted(false), 2000);
    }
  };

  const total = votes.a + votes.b;
  const pctA = total > 0 ? Math.round((votes.a / total) * 100) : 0;
  const pctB = total > 0 ? 100 - pctA : 0;
  const hasVotes = total > 0;

  if (!loaded) {
    return (
      <div style={{ width: '100%', background: 'rgba(13, 20, 36, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.1)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Carregando estatísticas dos palpites...
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      background: justVoted ? 'rgba(0,240,255,0.08)' : 'rgba(13, 20, 36, 0.8)', 
      padding: '1rem', 
      borderRadius: '12px', 
      border: justVoted ? '1px solid rgba(0,240,255,0.4)' : '1px solid rgba(0,240,255,0.15)', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.8rem',
      transition: 'all 0.4s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: justVoted ? '#2ed573' : 'var(--cyan)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.3s' }}>
          {justVoted ? '🎉 Voto registrado no servidor!' : userVote ? '🗳️ Seu palpite foi computado' : '🗳️ Quem vai vencer? Vote!'}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {total} voto global{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Botões de Votação */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button
          onClick={() => handleVote('a')}
          disabled={!!userVote || isSubmitting}
          style={{
            flex: 1,
            padding: '0.7rem 0.8rem',
            borderRadius: '10px',
            border: userVote === 'a' ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.12)',
            background: userVote === 'a' 
              ? 'linear-gradient(135deg, rgba(0,240,255,0.25), rgba(0,240,255,0.1))' 
              : 'rgba(255,255,255,0.04)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: userVote || isSubmitting ? 'default' : 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>{teamAName}</span>
          {hasVotes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {pctA}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ({votes.a})
              </span>
            </div>
          )}
          {!hasVotes && !userVote && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clique para votar</span>
          )}
          {userVote === 'a' && (
            <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', marginTop: '0.1rem' }}>✅ Seu voto</span>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 'bold' }}>VS</div>

        <button
          onClick={() => handleVote('b')}
          disabled={!!userVote || isSubmitting}
          style={{
            flex: 1,
            padding: '0.7rem 0.8rem',
            borderRadius: '10px',
            border: userVote === 'b' ? '2px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.12)',
            background: userVote === 'b' 
              ? 'linear-gradient(135deg, rgba(255,51,102,0.25), rgba(255,51,102,0.1))' 
              : 'rgba(255,51,102,0.04)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: userVote || isSubmitting ? 'default' : 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>{teamBName}</span>
          {hasVotes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {pctB}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ({votes.b})
              </span>
            </div>
          )}
          {!hasVotes && !userVote && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clique para votar</span>
          )}
          {userVote === 'b' && (
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-red)', marginTop: '0.1rem' }}>✅ Seu voto</span>
          )}
        </button>
      </div>

      {/* Barra de Progresso Visual */}
      {hasVotes && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ 
              width: `${pctA}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--cyan), rgba(0,240,255,0.6))', 
              transition: 'width 0.5s ease',
              borderRadius: pctA === 100 ? '4px' : '4px 0 0 4px'
            }}></div>
            <div style={{ 
              width: `${pctB}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, rgba(255,51,102,0.6), var(--accent-red))', 
              transition: 'width 0.5s ease',
              borderRadius: pctB === 100 ? '4px' : '0 4px 4px 0'
            }}></div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {!hasVotes && !userVote && (
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Seja o primeiro a votar neste confronto! Seu voto acumula globalmente na torcida.
        </div>
      )}
    </div>
  );
}
