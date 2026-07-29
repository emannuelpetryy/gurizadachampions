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

  useEffect(() => {
    const savedVotes = localStorage.getItem(`pred_votes_${matchId}`);
    const savedUserVote = localStorage.getItem(`pred_user_${matchId}`);
    if (savedVotes) {
      try { setVotes(JSON.parse(savedVotes)); } catch (e) {}
    }
    if (savedUserVote === 'a' || savedUserVote === 'b') {
      setUserVote(savedUserVote);
    }
    setLoaded(true);
  }, [matchId]);

  const handleVote = (team: 'a' | 'b') => {
    if (userVote) return;
    const newVotes = { ...votes, [team]: votes[team] + 1 };
    setVotes(newVotes);
    setUserVote(team);
    localStorage.setItem(`pred_votes_${matchId}`, JSON.stringify(newVotes));
    localStorage.setItem(`pred_user_${matchId}`, team);
  };

  const total = votes.a + votes.b;
  const pctA = total > 0 ? Math.round((votes.a / total) * 100) : 50;
  const pctB = total > 0 ? 100 - pctA : 50;

  return (
    <div style={{ width: '100%', background: 'rgba(13, 20, 36, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🗳️ Palpite da Torcida {userVote ? '✅ Voto computado!' : '(Clique para votar)'}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {loaded ? `${total} Voto${total !== 1 ? 's' : ''}` : '...'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button
          onClick={() => handleVote('a')}
          disabled={!!userVote}
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            borderRadius: '8px',
            border: userVote === 'a' ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
            background: userVote === 'a' ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: userVote ? 'default' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{teamAName}</span>
          <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {total > 0 ? `${pctA}%` : '-'}
          </span>
        </button>

        <button
          onClick={() => handleVote('b')}
          disabled={!!userVote}
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            borderRadius: '8px',
            border: userVote === 'b' ? '2px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.1)',
            background: userVote === 'b' ? 'rgba(255,51,102,0.2)' : 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: userVote ? 'default' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{teamBName}</span>
          <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {total > 0 ? `${pctB}%` : '-'}
          </span>
        </button>
      </div>

      {/* Barra de Progresso das Votações */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: total > 0 ? `${pctA}%` : '50%', height: '100%', background: 'var(--cyan)', transition: 'width 0.3s' }}></div>
        <div style={{ width: total > 0 ? `${pctB}%` : '50%', height: '100%', background: 'var(--accent-red)', transition: 'width 0.3s' }}></div>
      </div>
    </div>
  );
}
