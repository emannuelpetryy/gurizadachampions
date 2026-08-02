'use client';

import { useState, useEffect } from 'react';
import { players, teams, getTeam } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

export default function LobbyPage() {
  const [slots, setSlots] = useState<any[]>(Array(10).fill(null));
  const [drawResult, setDrawResult] = useState<any>(null);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [eloMap, setEloMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [customName, setCustomName] = useState('');
  const [guestLevel, setGuestLevel] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [scoreAInput, setScoreAInput] = useState('13');
  const [scoreBInput, setScoreBInput] = useState('9');
  const [savingScore, setSavingScore] = useState(false);

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
            if (data.matchHistory) setMatchHistory(data.matchHistory);
            if (data.eloMap) setEloMap(data.eloMap);
            if (data.vetoState) {
              if (Array.isArray(data.vetoState.bannedMaps)) setBannedMaps(data.vetoState.bannedMaps);
              if (data.vetoState.vetoTurn) setVetoTurn(data.vetoState.vetoTurn);
            }
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
        body: JSON.stringify({ action: 'join', slotId, playerName: pName, customLevel: customName ? guestLevel : undefined }),
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

  // Estado do Veto de Mapas do CS2
  const CS2_ACTIVE_DUTY = [
    { name: 'Dust II', icon: '🏜️', desc: 'Deserto Clássico & AWP Duals', color: '#f39c12' },
    { name: 'Mirage', icon: '🏰', desc: 'Palácio de Marrakesh & Meio disputado', color: '#e67e22' },
    { name: 'Inferno', icon: '🔥', desc: 'Vilas Italianas & Banana Flamejante', color: '#e74c3c' },
    { name: 'Nuke', icon: '⚛️', desc: 'Usina Nuclear & Rota Secreta B', color: '#3498db' },
    { name: 'Anubis', icon: '⚖️', desc: 'Ruínas do Egito & Águas de B', color: '#9b59b6' },
    { name: 'Ancient', icon: '🗿', desc: 'Selva Maia & Ruínas de Pedra', color: '#2ecc71' },
    { name: 'Cache', icon: '☣️', desc: 'Zona Radiativa & Meio Retão', color: '#4caf50' },
  ];

  const [bannedMaps, setBannedMaps] = useState<string[]>([]);
  const [vetoTurn, setVetoTurn] = useState<'teamA' | 'teamB'>('teamA');

  const handleBanMap = async (mapName: string) => {
    if (bannedMaps.includes(mapName)) return;
    const updated = [...bannedMaps, mapName];
    const nextTurn = vetoTurn === 'teamA' ? 'teamB' : 'teamA';
    setBannedMaps(updated);
    setVetoTurn(nextTurn);

    try {
      await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban_map', mapName }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetVeto = async () => {
    setBannedMaps([]);
    setVetoTurn('teamA');
    try {
      await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_veto' }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMatchScore = async () => {
    if (!drawResult) return;
    setSavingScore(true);
    try {
      const res = await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_match',
          scoreA: parseInt(scoreAInput) || 0,
          scoreB: parseInt(scoreBInput) || 0,
          mapName: finalChosenMap ? finalChosenMap.name : 'Dust II',
          teamA: drawResult.teamA,
          teamB: drawResult.teamB,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.matchHistory) setMatchHistory(data.matchHistory);
        if (data.eloMap) setEloMap(data.eloMap);
        alert('🏆 Placar e Pontuação ELO registrados com sucesso!');
      }
    } catch (e) {
      alert('Erro ao salvar o placar da partida.');
    } finally {
      setSavingScore(false);
    }
  };

  const remainingMaps = CS2_ACTIVE_DUTY.filter(m => !bannedMaps.includes(m.name));
  const finalChosenMap = remainingMaps.length === 1 ? remainingMaps[0] : null;

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

            {/* --- SEÇÃO VETO DE MAPAS CS2 (ACTIVE DUTY) --- */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    🗺️ FASE DE VETO DE MAPAS (CS2 ACTIVE DUTY)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Banam os mapas alternadamente até sobrar o mapa oficial da partida!
                  </p>
                </div>

                {bannedMaps.length > 0 && (
                  <button
                    onClick={handleResetVeto}
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    🔄 Reiniciar Veto
                  </button>
                )}
              </div>

              {/* Status Banner do Veto */}
              {finalChosenMap ? (
                <div style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,170,0,0.1))', border: '2px solid #ffd700', padding: '1.2rem', borderRadius: '16px', textAlign: 'center', marginBottom: '1.8rem', boxShadow: '0 0 35px rgba(255,215,0,0.3)' }}>
                  <span style={{ fontSize: '2rem' }}>🏆</span>
                  <h4 style={{ fontSize: '1.8rem', color: '#ffd700', margin: '0.4rem 0 0.1rem 0', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
                    MAPA DEFINIDO PARA O CONFRONTO: {finalChosenMap.name.toUpperCase()} {finalChosenMap.icon}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>
                    {finalChosenMap.desc} • Boa sorte a ambas as equipes!
                  </p>
                </div>
              ) : (
                <div style={{ background: vetoTurn === 'teamA' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 51, 102, 0.12)', border: `1px solid ${vetoTurn === 'teamA' ? 'var(--cyan)' : 'var(--accent-red)'}`, padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                  <span style={{ color: vetoTurn === 'teamA' ? 'var(--cyan)' : 'var(--accent-red)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-rajdhani)' }}>
                    {vetoTurn === 'teamA' ? '⚡ VEZ DO TIME ALPHA BANIR UM MAPA' : '🔥 VEZ DO TIME BRAVO BANIR UM MAPA'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Mapas Banidos: {bannedMaps.length} / 6
                  </span>
                </div>
              )}

              {/* Grid de 7 Mapas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {CS2_ACTIVE_DUTY.map(map => {
                  const isBanned = bannedMaps.includes(map.name);
                  const isWinner = finalChosenMap?.name === map.name;

                  return (
                    <div
                      key={map.name}
                      onClick={() => { if (!isBanned && !finalChosenMap) handleBanMap(map.name); }}
                      style={{
                        position: 'relative',
                        background: isWinner
                          ? 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(15,20,35,0.95))'
                          : isBanned
                          ? 'rgba(10, 15, 25, 0.5)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isWinner
                          ? '2px solid #ffd700'
                          : isBanned
                          ? '1px solid rgba(255, 51, 102, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        padding: '1.2rem 0.8rem',
                        textAlign: 'center',
                        cursor: (!isBanned && !finalChosenMap) ? 'pointer' : 'default',
                        opacity: isBanned ? 0.45 : 1,
                        boxShadow: isWinner ? '0 0 25px rgba(255,215,0,0.4)' : 'none',
                        transition: 'all 0.25s ease',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Carimbo de BANIDO */}
                      {isBanned && (
                        <div style={{ position: 'absolute', top: '40%', left: 0, width: '100%', background: 'rgba(255, 51, 102, 0.9)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, padding: '0.2rem 0', transform: 'rotate(-12deg)', letterSpacing: '2px', boxShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                          BANIDO 🚫
                        </div>
                      )}

                      <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>{map.icon}</div>
                      <strong style={{ fontSize: '1.1rem', color: isWinner ? '#ffd700' : isBanned ? 'var(--text-muted)' : '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
                        {map.name}
                      </strong>

                      {!isBanned && !finalChosenMap && (
                        <span style={{ marginTop: '0.6rem', display: 'inline-block', fontSize: '0.7rem', background: vetoTurn === 'teamA' ? 'rgba(0,240,255,0.2)' : 'rgba(255,51,102,0.2)', color: vetoTurn === 'teamA' ? 'var(--cyan)' : 'var(--accent-red)', border: `1px solid ${vetoTurn === 'teamA' ? 'var(--cyan)' : 'var(--accent-red)'}`, padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800 }}>
                          [ BANIR MAPA ]
                        </span>
                      )}
                    </div>
                  );
                })}
                {/* REGISTRO DO PLACAR DA PARTIDA */}
                <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: '0 0 1rem 0' }}>
                    🏆 REGISTRAR RESULTADO DA PARTIDA AMISTOSA
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%' }}>
                      
                      {/* LADO AZUL */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--cyan)', fontWeight: 800, fontSize: '0.85rem' }}>LADO AZUL:</span>
                        <input
                          type="number"
                          value={scoreAInput}
                          onChange={e => setScoreAInput(e.target.value)}
                          style={{ width: '55px', background: 'rgba(10,15,30,0.95)', border: '1px solid var(--cyan)', padding: '0.4rem 0.2rem', borderRadius: '8px', color: '#fff', fontSize: '1.1rem', textAlign: 'center', fontWeight: 800 }}
                        />
                      </div>

                      <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 900 }}>X</span>

                      {/* LADO VERMELHO */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.85rem' }}>LADO VERMELHO:</span>
                        <input
                          type="number"
                          value={scoreBInput}
                          onChange={e => setScoreBInput(e.target.value)}
                          style={{ width: '55px', background: 'rgba(10,15,30,0.95)', border: '1px solid var(--accent-red)', padding: '0.4rem 0.2rem', borderRadius: '8px', color: '#fff', fontSize: '1.1rem', textAlign: 'center', fontWeight: 800 }}
                        />
                      </div>

                    </div>

                    <button
                      onClick={handleSaveMatchScore}
                      disabled={savingScore}
                      style={{
                        background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                        color: '#080d1a',
                        border: 'none',
                        padding: '0.6rem 1.6rem',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px rgba(255,215,0,0.4)',
                        width: '100%',
                        maxWidth: '240px',
                      }}
                    >
                      {savingScore ? 'SALVANDO...' : '💾 SALVAR PLACAR'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* SALA 5V5: LADO A vs LADO B */}
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff', textAlign: 'center' }}>
          📍 VAGAS NA SALA ({filledCount}/10 JOGADORES)
        </h2>

        <div className="grid-2" style={{ gap: '2rem' }}>
          {/* LADO A: VAGAS 1 A 5 */}
          <div style={{ background: 'rgba(0, 240, 255, 0.04)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '20px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚡ LADO AZUL (VAGAS 1-5)
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan)', background: 'rgba(0,240,255,0.15)', padding: '0.2rem 0.7rem', borderRadius: '10px', fontWeight: 800 }}>
                {slots.slice(0, 5).filter(Boolean).length} / 5
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {slots.slice(0, 5).map((slot, idx) => {
                const slotNum = idx + 1;
                const isOccupied = slot && slot.player_name;
                const team = isOccupied ? getTeam(slot.team_id) : null;

                return (
                  <div
                    key={slotNum}
                    onClick={() => { if (!isOccupied && !actionLoading) setActiveSlotModal(slotNum); }}
                    style={{
                      background: isOccupied
                        ? 'linear-gradient(135deg, rgba(15,25,45,0.95), rgba(8,14,28,0.98))'
                        : 'rgba(10, 15, 30, 0.6)',
                      border: isOccupied
                        ? '1px solid var(--cyan)'
                        : '1.5px dashed rgba(0, 240, 255, 0.3)',
                      borderRadius: '14px',
                      padding: '0.8rem 1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: isOccupied ? 'default' : 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isOccupied ? '0 4px 15px rgba(0, 240, 255, 0.1)' : 'none',
                    }}
                    className={!isOccupied ? 'match-card-hover' : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan)', background: 'rgba(0,240,255,0.15)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontFamily: 'var(--font-rajdhani)' }}>
                        #{slotNum}
                      </span>

                      {isOccupied ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <PlayerAvatar teamName={team?.name || ''} playerName={slot.player_name} badgeColor="var(--cyan)" size={42} />
                          <div>
                            <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)' }}>{slot.player_name}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              {team && <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={14} borderRadius="3px" />}
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{team?.name}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px dashed rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', fontSize: '1.2rem' }}>
                            +
                          </div>
                          <div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--cyan)', fontWeight: 700, display: 'block' }}>VAGA DISPONÍVEL</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clique para selecionar seu perfil</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {isOccupied ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                            Lvl {slot.lvl}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLeaveSlot(slotNum); }}
                            disabled={actionLoading}
                            style={{ background: 'rgba(255,51,102,0.15)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            🚪 Sair
                          </button>
                        </div>
                      ) : (
                        <span style={{ background: 'linear-gradient(135deg, #00f0ff, #0099ff)', color: '#080d1a', padding: '0.4rem 0.9rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800 }}>
                          🎯 Entrar
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LADO B: VAGAS 6 A 10 */}
          <div style={{ background: 'rgba(255, 51, 102, 0.04)', border: '1px solid rgba(255, 51, 102, 0.25)', borderRadius: '20px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,51,102,0.2)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔥 LADO VERMELHO (VAGAS 6-10)
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', background: 'rgba(255,51,102,0.15)', padding: '0.2rem 0.7rem', borderRadius: '10px', fontWeight: 800 }}>
                {slots.slice(5, 10).filter(Boolean).length} / 5
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {slots.slice(5, 10).map((slot, idx) => {
                const slotNum = idx + 6;
                const isOccupied = slot && slot.player_name;
                const team = isOccupied ? getTeam(slot.team_id) : null;

                return (
                  <div
                    key={slotNum}
                    onClick={() => { if (!isOccupied && !actionLoading) setActiveSlotModal(slotNum); }}
                    style={{
                      background: isOccupied
                        ? 'linear-gradient(135deg, rgba(35,18,30,0.95), rgba(20,10,18,0.98))'
                        : 'rgba(10, 15, 30, 0.6)',
                      border: isOccupied
                        ? '1px solid var(--accent-red)'
                        : '1.5px dashed rgba(255, 51, 102, 0.3)',
                      borderRadius: '14px',
                      padding: '0.8rem 1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: isOccupied ? 'default' : 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isOccupied ? '0 4px 15px rgba(255, 51, 102, 0.1)' : 'none',
                    }}
                    className={!isOccupied ? 'match-card-hover' : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', background: 'rgba(255,51,102,0.15)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontFamily: 'var(--font-rajdhani)' }}>
                        #{slotNum}
                      </span>

                      {isOccupied ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <PlayerAvatar teamName={team?.name || ''} playerName={slot.player_name} badgeColor="var(--accent-red)" size={42} />
                          <div>
                            <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)' }}>{slot.player_name}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              {team && <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={14} borderRadius="3px" />}
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{team?.name}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px dashed rgba(255,51,102,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-red)', fontSize: '1.2rem' }}>
                            +
                          </div>
                          <div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--accent-red)', fontWeight: 700, display: 'block' }}>VAGA DISPONÍVEL</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clique para selecionar seu perfil</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {isOccupied ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                            Lvl {slot.lvl}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLeaveSlot(slotNum); }}
                            disabled={actionLoading}
                            style={{ background: 'rgba(255,51,102,0.15)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            🚪 Sair
                          </button>
                        </div>
                      ) : (
                        <span style={{ background: 'linear-gradient(135deg, #ff3366, #ff6b81)', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800 }}>
                          🎯 Entrar
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODAL SELECIONAR JOGADOR COM BUSCA EM TEMPO REAL */}
        {activeSlotModal !== null && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '1.8rem', border: '1px solid var(--cyan)', boxShadow: '0 0 40px rgba(0,240,255,0.2)' }}>
              
              {/* Header do Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
                    🎯 SELEÇÃO DE PERFIL — VAGA #{activeSlotModal}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pesquise seu nick ou time abaixo para entrar</span>
                </div>
                <button
                  onClick={() => { setActiveSlotModal(null); setSearchTerm(''); setSelectedPlayer(''); setCustomName(''); }}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ✕
                </button>
              </div>

              {/* BARRA DE PESQUISA EM TEMPO REAL */}
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="🔍 Digite para pesquisar (ex: Gusta, Acyd, Manko, Venvanse)..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); }}
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'rgba(10,15,30,0.95)',
                    border: '1.5px solid var(--cyan)',
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    boxShadow: '0 0 15px rgba(0,240,255,0.15)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* LISTA DE JOGADORES FILTRADOS */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px', marginBottom: '1.2rem' }}>
                {(() => {
                  const filtered = players.filter(p => {
                    const t = getTeam(p.teamId);
                    const q = searchTerm.toLowerCase().trim();
                    return !q || p.name.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Nenhum jogador encontrado com "{searchTerm}".</p>
                        <button
                          onClick={() => { setCustomName(searchTerm); setSelectedPlayer(''); }}
                          style={{ marginTop: '0.8rem', background: 'rgba(0,240,255,0.15)', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.4rem 0.9rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Usar "{searchTerm}" como Nick de Convidado
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(p => {
                    const t = getTeam(p.teamId);
                    const isSelected = selectedPlayer === p.name;

                    return (
                      <div
                        key={p.name}
                        onClick={() => { setSelectedPlayer(p.name); setCustomName(''); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: isSelected ? 'rgba(0,240,255,0.2)' : 'rgba(10,15,30,0.8)',
                          border: isSelected ? '1.5px solid var(--cyan)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '0.6rem 0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 0 15px rgba(0,240,255,0.2)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                          <PlayerAvatar teamName={t.name} playerName={p.name} badgeColor={isSelected ? 'var(--cyan)' : '#ffd700'} size={36} />
                          <div>
                            <strong style={{ fontSize: '0.98rem', color: isSelected ? 'var(--cyan)' : '#fff', display: 'block' }}>{p.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.name}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isSelected && <span style={{ color: 'var(--cyan)', fontWeight: 800, fontSize: '0.9rem' }}>✓</span>}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* CAMPO DE CONVIDADO (CASO PREFIRA DIGITAR) */}
              {customName && (
                <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid #ffd700', padding: '0.8rem 1rem', borderRadius: '12px', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 800 }}>👤 Convidado: <strong>{customName}</strong></span>
                    <button onClick={() => setCustomName('')} style={{ background: 'none', border: 'none', color: '#ffd700', cursor: 'pointer', fontWeight: 800 }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,215,0,0.2)' }}>
                    <label style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 800 }}>🎯 Nível Gamers Club do Convidado:</label>
                    <select
                      value={guestLevel}
                      onChange={(e) => setGuestLevel(parseInt(e.target.value))}
                      style={{
                        background: '#0a0f1d',
                        color: '#ffd700',
                        border: '1px solid #ffd700',
                        borderRadius: '8px',
                        padding: '0.3rem 0.6rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                        <option key={lvl} value={lvl}>
                          Level {lvl} {lvl >= 18 ? '(Tier S)' : lvl >= 14 ? '(Tier A)' : lvl >= 10 ? '(Tier B)' : '(Tier C)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* BOTOES DE AÇÃO */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => handleJoinSlot(activeSlotModal)}
                  disabled={actionLoading || (!selectedPlayer && !customName)}
                  style={{
                    flex: 1,
                    background: (selectedPlayer || customName) ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(255,255,255,0.1)',
                    color: (selectedPlayer || customName) ? '#080d1a' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: (selectedPlayer || customName) ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-rajdhani)',
                    boxShadow: (selectedPlayer || customName) ? '0 0 20px rgba(0,240,255,0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  {actionLoading ? 'Entrando...' : selectedPlayer ? `Confirmar ${selectedPlayer} na Vaga #${activeSlotModal}` : customName ? `Confirmar ${customName} (Lvl ${guestLevel})` : 'Selecione um Perfil'}
                </button>

                <button
                  onClick={() => { setActiveSlotModal(null); setSearchTerm(''); setSelectedPlayer(''); setCustomName(''); }}
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.85rem 1.2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}

        {/* LEADERBOARD DE ELO INDIVIDUAL DOS JOGADORES (GURIZADA RATING) */}
        {Object.keys(eloMap).length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0, fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
                🏆 RANKING DE ELO DA GURIZADA
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Pontuação individual dos jogadores acumulada nos amistosos 5v5 (+25 ELO por vitória / -15 ELO por derrota)
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.2rem', maxWidth: '1000px', margin: '0 auto' }}>
              {Object.values(eloMap)
                .sort((a: any, b: any) => b.elo - a.elo)
                .map((player: any, idx: number) => {
                  const totalMatches = (player.wins || 0) + (player.losses || 0);
                  const winrate = totalMatches > 0 ? ((player.wins / totalMatches) * 100).toFixed(1) : '0.0';
                  const matchedP = players.find(p => p.name.toLowerCase() === player.name.toLowerCase());
                  const team = matchedP ? getTeam(matchedP.teamId) : { name: 'Convidado' };
                  
                  const ratingLevel = player.elo >= 1500 ? 10 : player.elo >= 1350 ? 9 : player.elo >= 1200 ? 8 : player.elo >= 1100 ? 6 : player.elo >= 1000 ? 4 : 2;
                  const badgeColor = player.elo >= 1400 ? '#ffd700' : player.elo >= 1200 ? '#00f0ff' : '#a4b0be';

                  return (
                    <div key={player.name} className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${badgeColor}40`, boxShadow: idx === 0 ? '0 0 25px rgba(255,215,0,0.3)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'var(--text-muted)', width: '28px' }}>
                          #{idx + 1}
                        </span>
                        <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={badgeColor} size={48} />
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#fff', display: 'block' }}>{player.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{player.wins || 0}V - {player.losses || 0}D • {winrate}% WR</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: badgeColor, color: '#080d1a', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.75rem', display: 'inline-block', marginBottom: '0.3rem' }}>
                          GC RATING LVL {ratingLevel}
                        </span>
                        <strong style={{ fontSize: '1.3rem', color: badgeColor, display: 'block', fontFamily: 'var(--font-rajdhani)' }}>
                          {player.elo} ELO
                        </strong>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* HISTÓRICO DE AMISTOSOS FINALIZADOS */}
        {matchHistory.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
              📜 HISTÓRICO DE AMISTOSOS (5v5)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
              {matchHistory.map((m: any, idx: number) => (
                <div key={m.id || idx} className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ background: 'rgba(0,240,255,0.15)', color: 'var(--cyan)', padding: '0.3rem 0.8rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem' }}>
                      🗺️ {m.mapName || 'CS2 Map'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, fontSize: '1.4rem' }}>
                    <span style={{ color: m.scoreA > m.scoreB ? '#2ed573' : '#fff' }}>{m.scoreA}</span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>-</span>
                    <span style={{ color: m.scoreB > m.scoreA ? '#2ed573' : '#fff' }}>{m.scoreB}</span>
                  </div>

                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: m.scoreA > m.scoreB ? 'var(--cyan)' : 'var(--accent-red)' }}>
                    {m.scoreA > m.scoreB ? '🏆 VITÓRIA LADO AZUL' : '🏆 VITÓRIA LADO VERMELHO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
