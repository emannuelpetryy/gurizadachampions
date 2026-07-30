'use client';

import { useState, useEffect } from 'react';
import { players, teams, getTeam } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

export default function LobbyPage() {
  const [slots, setSlots] = useState<any[]>(Array(10).fill(null));
  const [drawResult, setDrawResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [customName, setCustomName] = useState('');
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Auto-refresh a cada 2.5s para ser simultâneo em tempo real!
  useEffect(() => {
    let cancelled = false;

    async function fetchLobby() {
      try {
        const res = await fetch('/api/lobby', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setSlots(data.slots || Array(10).fill(null));
            if (data.drawResult) setDrawResult(data.drawResult);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLobby();
    const interval = setInterval(fetchLobby, 2500);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleJoinSlot = async (slotId: number) => {
    const pName = selectedPlayer || customName.trim();
    if (!pName) {
      alert('Selecione ou digite um nome de jogador.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', slotId, playerName: pName }),
      });

      if (res.ok) {
        setActiveSlotModal(null);
        setSelectedPlayer('');
        setCustomName('');
        // Re-fetch imediato
        const refresh = await fetch('/api/lobby', { cache: 'no-store' });
        if (refresh.ok) {
          const data = await refresh.json();
          setSlots(data.slots || Array(10).fill(null));
        }
      } else {
        alert('Erro ao entrar na vaga.');
      }
    } catch (e) {
      alert('Erro de conexão.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveSlot = async (slotId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', slotId }),
      });

      if (res.ok) {
        const refresh = await fetch('/api/lobby', { cache: 'no-store' });
        if (refresh.ok) {
          const data = await refresh.json();
          setSlots(data.slots || Array(10).fill(null));
        }
      }
    } catch (e) {
      alert('Erro ao sair da vaga.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetLobby = async () => {
    if (!confirm('Deseja limpar todas as 10 vagas e o sorteio atual?')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });

      if (res.ok) {
        setDrawResult(null);
        const refresh = await fetch('/api/lobby', { cache: 'no-store' });
        if (refresh.ok) {
          const data = await refresh.json();
          setSlots(data.slots || Array(10).fill(null));
        }
      }
    } catch (e) {
      alert('Erro ao resetar lobby.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunDraw = async () => {
    const filledCount = slots.filter(Boolean).length;
    if (filledCount < 2) {
      alert('É necessário ter pelo menos 2 jogadores no lobby para sortear.');
      return;
    }

    setIsSpinning(true);
    setActionLoading(true);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/lobby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'draw' }),
        });

        if (res.ok) {
          const data = await res.json();
          setDrawResult(data.drawResult);
        } else {
          alert('Erro ao executar o sorteio.');
        }
      } catch (e) {
        alert('Erro de conexão ao sortear.');
      } finally {
        setIsSpinning(false);
        setActionLoading(false);
      }
    }, 1500); // 1.5s de efeito roleta
  };

  const filledCount = slots.filter(Boolean).length;

  return (
    <main style={{ padding: '3rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* Banner do Lobby */}
        <div className="glass-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'var(--cyan)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%' }}></div>
          
          <span style={{ background: 'rgba(0,240,255,0.15)', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            🎮 MATCHMAKING & SORTEIO AMISTOSO
          </span>

          <h1 className="hero-title" style={{ fontSize: '3rem', margin: '0.8rem 0 0.4rem 0', textShadow: 'none' }}>
            LOBBY DE <span className="text-cyan">PARTIDA</span> (5v5)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            Entre na fila com seu perfil. Quando os 10 slots forem preenchidos, o algoritmo sorteará e balanceará as 2 equipes perfeitamente conforme o nível dos perfis!
          </p>

          {/* Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.4rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👥</span>
              <span style={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 800, fontSize: '1.1rem', color: filledCount === 10 ? '#2ed573' : 'var(--cyan)' }}>
                {filledCount} / 10 VAGAS OCUPADAS
              </span>
            </div>

            <button
              onClick={handleRunDraw}
              disabled={actionLoading || filledCount < 2}
              style={{
                background: filledCount === 10 ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'linear-gradient(135deg, #00f0ff, #0099ff)',
                color: '#080d1a',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '14px',
                fontWeight: 800,
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '1.1rem',
                cursor: (actionLoading || filledCount < 2) ? 'not-allowed' : 'pointer',
                boxShadow: filledCount === 10 ? '0 0 25px rgba(255,215,0,0.5)' : '0 0 20px rgba(0,240,255,0.4)',
                opacity: (actionLoading || filledCount < 2) ? 0.6 : 1,
                transition: 'all 0.3s',
              }}
            >
              {isSpinning ? '🎲 BALANCIANDO EQUIPES...' : '🎲 SORTEAR & BALANCEAR (5v5)'}
            </button>

            <button
              onClick={handleResetLobby}
              disabled={actionLoading}
              style={{
                background: 'rgba(255,51,102,0.15)',
                color: 'var(--accent-red)',
                border: '1px solid var(--accent-red)',
                padding: '0.8rem 1.2rem',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              🗑️ Limpar Lobby
            </button>
          </div>
        </div>

        {/* RESULTADO DO SORTEIO (SE HOUVER) */}
        {drawResult && (
          <div className="glass-card" style={{ padding: '2rem 1.5rem', marginBottom: '3rem', border: '2px solid #ffd700', boxShadow: '0 0 40px rgba(255,215,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ background: '#ffd700', color: '#000', padding: '0.3rem 1rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem' }}>
                ✅ PARTIDA PROPOSITALMENTE EQUILIBRADA (Diferença de Lvl: {drawResult.diff})
              </span>
              <h2 style={{ fontSize: '2.4rem', marginTop: '0.8rem', color: '#fff' }}>
                ⚔️ CONFRONTO AMISTOSO DEFINIDO!
              </h2>
            </div>

            <div className="grid-2" style={{ gap: '2rem' }}>
              {/* TIME ALPHA */}
              <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid var(--cyan)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--cyan)', fontSize: '1.5rem', margin: 0 }}>⚡ TIME ALPHA</h3>
                  <span style={{ background: 'rgba(0,240,255,0.2)', color: 'var(--cyan)', padding: '0.2rem 0.8rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
                    Soma Lvl: {drawResult.sumA}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {drawResult.teamA.map((p: any) => {
                    const team = getTeam(p.team_id);
                    return (
                      <div key={p.player_name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <PlayerAvatar teamName={team.name} playerName={p.player_name} badgeColor="var(--cyan)" size={42} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'block' }}>{p.player_name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.name}</span>
                        </div>
                        <span style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                          Lvl {p.lvl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TIME BRAVO */}
              <div style={{ background: 'rgba(255, 51, 102, 0.08)', border: '1px solid var(--accent-red)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,51,102,0.3)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--accent-red)', fontSize: '1.5rem', margin: 0 }}>🔥 TIME BRAVO</h3>
                  <span style={{ background: 'rgba(255,51,102,0.2)', color: 'var(--accent-red)', padding: '0.2rem 0.8rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
                    Soma Lvl: {drawResult.sumB}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {drawResult.teamB.map((p: any) => {
                    const team = getTeam(p.team_id);
                    return (
                      <div key={p.player_name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <PlayerAvatar teamName={team.name} playerName={p.player_name} badgeColor="var(--accent-red)" size={42} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'block' }}>{p.player_name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.name}</span>
                        </div>
                        <span style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                          Lvl {p.lvl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRID DOS 10 SLOTS DO LOBBY */}
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff' }}>
          📍 VAGAS NO LOBBY ({filledCount}/10)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
          {slots.map((slot, idx) => {
            const slotNum = idx + 1;
            const isOccupied = slot && slot.player_name;
            const team = isOccupied ? getTeam(slot.team_id) : null;

            return (
              <div
                key={slotNum}
                style={{
                  background: isOccupied ? 'linear-gradient(180deg, rgba(20,25,45,0.95), rgba(8,12,24,0.98))' : 'rgba(10, 15, 30, 0.5)',
                  border: isOccupied ? '1px solid var(--cyan)' : '2px dashed rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px',
                  position: 'relative',
                  boxShadow: isOccupied ? '0 5px 15px rgba(0,240,255,0.1)' : 'none',
                  transition: 'all 0.3s',
                }}
              >
                <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>
                  SLOT #{slotNum}
                </span>

                {isOccupied ? (
                  <>
                    <div style={{ marginTop: '0.8rem', marginBottom: '0.5rem' }}>
                      <PlayerAvatar teamName={team?.name || ''} playerName={slot.player_name} badgeColor="var(--cyan)" size={56} />
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: '#fff', textAlign: 'center' }}>{slot.player_name}</strong>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                      {team && <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={16} borderRadius="4px" />}
                      <span style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 800 }}>Lvl {slot.lvl}</span>
                    </div>

                    <button
                      onClick={() => handleLeaveSlot(slotNum)}
                      disabled={actionLoading}
                      style={{
                        marginTop: '0.8rem',
                        background: 'rgba(255,51,102,0.15)',
                        color: 'var(--accent-red)',
                        border: '1px solid var(--accent-red)',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      🚪 Sair da Vaga
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--text-muted)' }}>
                      +
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vaga Livre</span>
                    
                    <button
                      onClick={() => setActiveSlotModal(slotNum)}
                      disabled={actionLoading}
                      style={{
                        background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
                        color: '#080d1a',
                        border: 'none',
                        padding: '0.45rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(0,240,255,0.3)',
                      }}
                    >
                      🎯 Entrar na Vaga #{slotNum}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MODAL SELECIONAR JOGADOR */}
        {activeSlotModal !== null && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2rem', border: '1px solid var(--cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem' }}>🎯 ENTRAR NA VAGA #{activeSlotModal}</h3>
                <button onClick={() => setActiveSlotModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
                    Escolher Jogador do Torneio:
                  </label>
                  <select
                    value={selectedPlayer}
                    onChange={e => { setSelectedPlayer(e.target.value); setCustomName(''); }}
                    style={{ width: '100%', background: 'rgba(10,15,30,0.95)', border: '1px solid var(--card-border)', color: '#fff', padding: '0.7rem', borderRadius: '10px', fontSize: '0.95rem' }}
                  >
                    <option value="">-- Selecione seu perfil --</option>
                    {players.map(p => (
                      <option key={p.name} value={p.name}>{p.name} ({getTeam(p.teamId).name})</option>
                    ))}
                  </select>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>— OU —</div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
                    Digitar Nome de Visitante / Convidado:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Gaules"
                    value={customName}
                    onChange={e => { setCustomName(e.target.value); setSelectedPlayer(''); }}
                    style={{ width: '100%', background: 'rgba(10,15,30,0.95)', border: '1px solid var(--card-border)', color: '#fff', padding: '0.7rem', borderRadius: '10px', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleJoinSlot(activeSlotModal)}
                    disabled={actionLoading}
                    style={{ flex: 1, background: 'linear-gradient(135deg, #00f0ff, #0099ff)', color: '#080d1a', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                  >
                    {actionLoading ? 'Salvando...' : 'Confirmar Vaga'}
                  </button>
                  <button
                    onClick={() => setActiveSlotModal(null)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
