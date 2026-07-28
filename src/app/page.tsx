export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Onde as Lendas Nascem</h1>
          <p className="hero-subtitle">
            Acompanhe o maior campeonato de Counter-Strike 2. As melhores equipes,
            os confrontos mais épicos e a disputa acirrada pelo topo do Ranking VRS.
          </p>
          <a href="/ranking" className="btn-primary">Ver Ranking Atual</a>
        </div>
      </section>

      <section className="container">
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="card-title">Próxima Partida</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="team-logo-placeholder" style={{ margin: '0 auto 0.5rem' }}>A</div>
                  <strong>Team Alpha</strong>
                </div>
                <div style={{ padding: '0 1rem', color: 'var(--primary)', fontWeight: 'bold' }}>VS</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="team-logo-placeholder" style={{ margin: '0 auto 0.5rem' }}>B</div>
                  <strong>Team Bravo</strong>
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>Hoje, 20:00 - MD3 (Inferno, Mirage, Nuke)</p>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Últimas Notícias</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Há 2 horas</span>
                <p style={{ fontWeight: '500', marginTop: '0.2rem' }}>Atualização no Mappool para as Finais</p>
              </li>
              <li>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Ontem</span>
                <p style={{ fontWeight: '500', marginTop: '0.2rem' }}>Resumo da Rodada 3: ZeuS brilha na Overpass</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
