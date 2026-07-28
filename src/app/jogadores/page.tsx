import { tiers, players as globalPlayers, getTeam } from '../data';
import Link from 'next/link';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';

export default function Jogadores() {
  const tierKeys = Object.keys(tiers) as Array<keyof typeof tiers>;

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        <h1 className="hero-title" style={{ fontSize: '3.5rem', textAlign: 'center', textShadow: 'none' }}>
          TIERS DOS <span className="text-cyan">JOGADORES</span>
        </h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          Classificação oficial baseada no nível GamersClub/FACEIT
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {tierKeys.map((tier) => {
            const players = tiers[tier];
            return (
              <div key={tier} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <span className={`tier-badge tier-${tier}`}>TIER {tier}</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{players.length} JOGADORES</p>
                </div>
                
                <div className="grid-3">
                  {players.map((player) => {
                    const fullPlayer = globalPlayers.find(p => p.name.toLowerCase() === player.name.toLowerCase());
                    const teamName = fullPlayer ? getTeam(fullPlayer.teamId).name : '';
                    return (
                    <div key={player.name} className="player-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <PlayerAvatar teamName={teamName} playerName={player.name} badgeColor="rgba(255,255,255,0.2)" size={40} />
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>
                            <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit' }} className="match-card-hover">
                              {player.name}
                            </Link>
                            {(player as any).swap && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'normal', border: '1px solid var(--primary)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>🔄 Trocado</span>}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>LVL {player.lvl}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
