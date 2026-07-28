import { tiers } from '../data';

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
                  {players.map((player) => (
                    <div key={player.name} className="player-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>
                            {player.name}
                            {(player as any).swap && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'normal', border: '1px solid var(--primary)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>🔄 Trocado</span>}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>LVL {player.lvl}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
