'use client';

import { useEffect, useState } from 'react';

type Choice = 'a' | 'b';

export default function DuelPrediction({ duelId, playerAName, playerBName }: { duelId: string; playerAName: string; playerBName: string }) {
  const [votes, setVotes] = useState({ a: 0, b: 0 });
  const [choice, setChoice] = useState<Choice | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const storageKey = `gc_final_duel_vote_${duelId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'a' || saved === 'b') setChoice(saved);

    fetch(`/api/duel-votes?duelId=${encodeURIComponent(duelId)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data && typeof data.a === 'number' && typeof data.b === 'number') setVotes(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [duelId, storageKey]);

  const vote = async (nextChoice: Choice) => {
    if (choice || submitting) return;
    setSubmitting(true);
    setChoice(nextChoice);
    setVotes((current) => ({ ...current, [nextChoice]: current[nextChoice] + 1 }));
    localStorage.setItem(storageKey, nextChoice);

    try {
      const response = await fetch('/api/duel-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duelId, choice: nextChoice }),
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data.a === 'number' && typeof data.b === 'number') setVotes(data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const total = votes.a + votes.b;
  const pctA = total ? Math.round((votes.a / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="final-duel-prediction" aria-label={`Palpite para ${playerAName} contra ${playerBName}`}>
      <span className="final-duel-prediction-title">PALPITE DO CONFRONTO</span>
      <div className="final-duel-prediction-actions">
        <button type="button" onClick={() => vote('a')} disabled={!!choice || submitting} className={choice === 'a' ? 'is-picked-a' : ''}>
          <span>{playerAName}</span><strong>{pctA}%</strong>
        </button>
        <button type="button" onClick={() => vote('b')} disabled={!!choice || submitting} className={choice === 'b' ? 'is-picked-b' : ''}>
          <span>{playerBName}</span><strong>{pctB}%</strong>
        </button>
      </div>
      <div className="final-duel-vote-bar" aria-hidden="true"><span style={{ width: `${pctA}%` }} /><i style={{ width: `${pctB}%` }} /></div>
      <small>{loading ? 'Carregando votos...' : choice ? '✓ Seu palpite foi salvo' : total ? `${total} voto${total === 1 ? '' : 's'} da torcida` : 'Seja o primeiro a votar'}</small>
    </div>
  );
}
