export default function Sobre() {
  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        <h1 className="hero-title" style={{ fontSize: '3rem', textAlign: 'center' }}>Regulamento Oficial</h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Regras, formato e diretrizes do Gurizada Champions Cup.
        </p>

        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="rules-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. DISPOSIÇÕES GERAIS</h2>
              <p>A Gurizada Champions Cup é um campeonato amador de Counter-Strike 2 (CS2), organizado com o objetivo de promover uma competição justa, organizada e competitiva entre as equipes participantes.</p>
              <p style={{ marginTop: '0.5rem' }}>Ao realizar sua inscrição, todos os jogadores, capitães e equipes declaram ter lido e concordado integralmente com este regulamento.</p>
              <p style={{ marginTop: '0.5rem' }}>A organização poderá interpretar situações não previstas neste documento, sendo suas decisões finais e soberanas.</p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. ELEGIBILIDADE E COMPOSIÇÃO</h2>
              <ul style={{ listStylePosition: 'inside', color: '#ccc', lineHeight: '1.8' }}>
                <li>Cada jogador poderá representar apenas uma equipe durante toda a competição.</li>
                <li>É proibida a utilização de contas de terceiros. Todos devem usar sua própria conta Steam.</li>
                <li>Cada equipe deverá ser composta por 5 jogadores titulares e até 2 reservas (opcional).</li>
                <li>Alterações na line-up após o início do campeonato dependerão de autorização da organização.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. FORMATO DO CAMPEONATO</h2>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>📋 RESUMO</h3>
                <ul style={{ listStyleType: 'none', color: '#ccc' }}>
                  <li>• 8 equipes divididas em 2 grupos de 4 equipes</li>
                  <li>• Todos contra todos no grupo (MD3)</li>
                  <li>• Semifinais em MD3 e Final em MD5</li>
                  <li>• Sem Lower Bracket</li>
                </ul>
              </div>
              
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Fase de Grupos & Classificação</h3>
              <p>Ao final da fase de grupos, classificam-se para as semifinais as duas melhores equipes de cada grupo.</p>
              <ul style={{ listStylePosition: 'inside', marginTop: '0.5rem', color: '#ccc' }}>
                <li>1º Grupo A × 2º Grupo B</li>
                <li>1º Grupo B × 2º Grupo A</li>
              </ul>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Critérios de Desempate</h3>
              <ol style={{ listStylePosition: 'inside', color: '#ccc' }}>
                <li>Confronto direto</li>
                <li>Saldo de mapas</li>
                <li>Saldo de rounds</li>
              </ol>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. MAPAS E VETOS</h2>
              <p><strong>Pool oficial:</strong> Ancient, Anubis, Dust II, Inferno, Mirage, Nuke, Cache.</p>
              
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Sistema de Veto (MD3)</h3>
              <ol style={{ listStylePosition: 'inside', color: '#ccc' }}>
                <li>Time A bane um mapa.</li>
                <li>Time B bane um mapa.</li>
                <li>Time A escolhe o primeiro mapa.</li>
                <li>Time B escolhe o lado inicial.</li>
                <li>Time B escolhe o segundo mapa.</li>
                <li>Time A escolhe o lado inicial.</li>
                <li>Time A e B banem um mapa cada. O mapa restante será o decisivo.</li>
              </ol>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Sistema de Veto (MD5 - Final)</h3>
              <ol style={{ listStylePosition: 'inside', color: '#ccc' }}>
                <li>Times A e B banem um mapa cada.</li>
                <li>Time A escolhe o mapa 1. Time B escolhe o mapa 2.</li>
                <li>Time A escolhe o mapa 3. Time B escolhe o mapa 4.</li>
                <li>O mapa restante será o mapa 5.</li>
              </ol>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>5. REGRAS DE PARTIDA</h2>
              <ul style={{ listStylePosition: 'inside', color: '#ccc', lineHeight: '1.8' }}>
                <li><strong>Horários:</strong> As equipes deverão estar presentes no Discord oficial com antecedência mínima de 15 minutos. Tolerância máxima de 15 minutos para W.O.</li>
                <li><strong>Prorrogação (Overtime):</strong> Em caso de empate 12x12, será jogado MR3 com US$ 10.000 iniciais (vence quem conquistar 4 rounds).</li>
                <li><strong>Pausas:</strong> Permitidas pausas táticas/técnicas para queda de internet, energia ou servidor. O uso abusivo resultará em advertência.</li>
                <li><strong>Desconexões:</strong> Será concedido tempo razoável para retorno. A organização decide a continuidade.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>6. INFRAÇÕES E PENALIDADES</h2>
              <p>É <strong>estritamente proibido</strong> utilizar qualquer software que conceda vantagem indevida (Wallhack, Aimbot, Scripts, etc) ou explorar bugs/exploits. A organização pode solicitar demos, POV ou inspeção do computador.</p>
              
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Punições</h3>
              <p>As infrações poderão resultar em advertência, perda de rounds/mapas, derrota por W.O., eliminação sumária ou banimento de futuras edições.</p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>7. TRANSMISSÕES E FAIR PLAY</h2>
              <p>A transmissão oficial será realizada pela organização. Jogadores podem transmitir com delay mínimo de 2 minutos. Stream sniping é proibido.</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#fff' }}>Todos os participantes comprometem-se a competir de forma honesta, respeitosa e esportiva (Fair Play).</p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}
