import Link from 'next/link';
import { getTeam, matches, matchDetails, players, teams } from './data';
import Comments from '../components/Comments';
import TeamLogo from './components/TeamLogo';
import MapPoolStats from './components/MapPoolStats';
import TwitchLiveStream from './components/TwitchLiveStream';
import GrandFinalShowdown from './components/GrandFinalShowdown';

const kdOf = (player: (typeof players)[number]) => player.kills / (player.deaths || 1);

export default function Home() {
  const leaders = [...players].sort((a, b) => kdOf(b) - kdOf(a)).slice(0, 5);
  const recentMatches = [...matches].sort((a, b) => b.id - a.id).slice(0, 6);
  const totalKills = players.reduce((sum, player) => sum + player.kills, 0);
  const leader = leaders[0];

  return (
    <main className="season-home">
      <section className="season-hero">
        <div className="season-hero-intro">
          <span className="season-kicker"><span className="status-pulse-dot" /> Temporada 01 · reta final</span>
          <h1>O campeonato<br /><em>chegou na final.</em></h1>
          <p>Venvanse e Os Desacreditados estão na decisão. Acompanhe a chave, os números reais da temporada e a resenha da comunidade em um só lugar.</p>
          <div className="season-actions">
            <Link href="#final" className="btn-primary">Ver confronto final</Link>
            <Link href="/ranking" className="btn-secondary">Classificação</Link>
            <Link href="/lobby" className="btn-secondary">Entrar no lobby</Link>
          </div>
        </div>
        <aside className="season-final-rail" aria-label="Status da grande final">
          <div>
            <span className="final-rail-label">Próximo evento · MD3</span>
            <h2>Grande final</h2>
            <div className="final-team-row"><span>Venvanse</span><b>vs</b><span>Os Desacreditados</span></div>
            <p>Semifinais encerradas: os dois finalistas venceram suas séries por 2–0.</p>
          </div>
          <Link className="final-rail-link" href="/ranking">Abrir chave dos playoffs →</Link>
        </aside>
      </section>

      <section className="season-metrics" aria-label="Resumo da temporada">
        <div className="season-metric"><strong>{matches.length}</strong><span>Mapas registrados</span></div>
        <div className="season-metric"><strong>{players.length}</strong><span>Jogadores no ranking</span></div>
        <div className="season-metric"><strong>{totalKills}</strong><span>Kills acumuladas</span></div>
        <div className="season-metric"><strong>{leader ? kdOf(leader).toFixed(2) : '—'}</strong><span>Maior K/D · {leader?.name || '—'}</span></div>
      </section>

      <section id="final" className="dashboard-grid">
        <div className="dashboard-section full"><GrandFinalShowdown /></div>

        <section className="dashboard-section">
          <div className="dashboard-heading"><h2>Últimos resultados</h2><Link href="/ranking">Ver classificação →</Link></div>
          <div className="glass-card match-list">
            {recentMatches.map((match) => {
              const teamA = getTeam(match.teamA);
              const teamB = getTeam(match.teamB);
              const map = matchDetails[String(match.id)]?.map || 'Mapa não informado';
              return (
                <Link key={match.id} href={`/partida/${match.id}`} className="match-list-item">
                  <span className="match-list-team">{teamA.name}</span>
                  <strong className="match-list-score">{match.scoreA}–{match.scoreB}<small>{map}</small></strong>
                  <span className="match-list-team">{teamB.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-heading"><h2>Na ponta</h2><Link href="/ranking">Ranking completo →</Link></div>
          <div className="glass-card leader-list">
            {leaders.map((player, index) => {
              const team = getTeam(player.teamId);
              return (
                <Link key={player.name} href={`/jogador/${encodeURIComponent(player.name)}`} className="leader-row">
                  <strong className="leader-rank">{String(index + 1).padStart(2, '0')}</strong>
                  <span className="leader-name"><strong>{player.name}</strong><span>{team.name} · {player.kills}K / {player.deaths}D</span></span>
                  <strong className="leader-kd">{kdOf(player).toFixed(2)}<small>K/D</small></strong>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section full"><TwitchLiveStream /></section>
        <section className="dashboard-section full"><MapPoolStats /></section>

        <section className="dashboard-section full">
          <div className="dashboard-heading"><h2>As oito equipes</h2><Link href="/jogadores">Conhecer jogadores →</Link></div>
          <div className="team-strip">
            {teams.map((team) => (
              <Link href={`/time/${team.id}`} key={team.id}>
                <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={52} borderRadius="0" />
                <span>{team.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section full"><Comments /></section>
      </section>
    </main>
  );
}
