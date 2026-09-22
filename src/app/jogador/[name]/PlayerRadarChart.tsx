'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PlayerRadarAttributes } from '../../../types/champions';

interface PlayerRadarChartProps {
  attributes: PlayerRadarAttributes;
  playerName: string;
}

export default function PlayerRadarChart({ attributes, playerName }: PlayerRadarChartProps) {
  const chartData = [
    { subject: 'FOGO (K/D)', value: attributes.firepower, fullMark: 100 },
    { subject: 'MIRA (HS%)', value: attributes.aim, fullMark: 100 },
    { subject: 'SUPORTE (ASS)', value: attributes.support, fullMark: 100 },
    { subject: 'SOBREVIVÊNCIA', value: attributes.survival, fullMark: 100 },
    { subject: 'IMPACTO (ADR)', value: attributes.impact, fullMark: 100 },
  ];

  const overallRating = Math.round(
    (attributes.firepower * 0.3 +
      attributes.impact * 0.25 +
      attributes.aim * 0.2 +
      attributes.survival * 0.15 +
      attributes.support * 0.1)
  );

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.8rem',
        borderRadius: '18px',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 240, 255, 0.08)',
      }}
    >
      {/* Header do Card com Arquétipo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <span className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            PERFIL TÁTICO HLTV PRO
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{attributes.archetype.icon}</span>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: attributes.archetype.color, fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>
                {attributes.archetype.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0', maxWidth: '420px' }}>
                {attributes.archetype.description}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Geral do Jogador */}
        <div
          style={{
            background: 'rgba(255, 215, 0, 0.08)',
            border: '1.5px solid rgba(255, 215, 0, 0.35)',
            borderRadius: '14px',
            padding: '0.6rem 1rem',
            textAlign: 'center',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.15)',
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#ffd700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>
            RATING GERAL
          </span>
          <strong style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1.1 }}>
            {overallRating}
          </strong>
          <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>/ 99</span>
        </div>
      </div>

      {/* Gráfico Radar */}
      <div style={{ width: '100%', height: 280, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(0, 240, 255, 0.2)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="var(--text-muted)"
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-rajdhani)' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="rgba(255, 255, 255, 0.1)"
              tick={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div style={{
                      background: 'rgba(6, 11, 24, 0.95)',
                      border: '1px solid #00f0ff',
                      borderRadius: '8px',
                      padding: '0.5rem 0.8rem',
                      color: '#fff',
                      fontSize: '0.8rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    }}>
                      <strong style={{ color: '#00f0ff', display: 'block' }}>{item.subject}</strong>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.value}</span> / 100
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name={playerName}
              dataKey="value"
              stroke="#00f0ff"
              fill="#00f0ff"
              fillOpacity={0.4}
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00f0ff', strokeWidth: 1.5, stroke: '#080e1c' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Barras de Atributos com Valores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginTop: '0.8rem',
        paddingTop: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Poder de Fogo</span>
          <strong style={{ fontSize: '1.15rem', color: '#00f0ff', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{attributes.firepower}</strong>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Mira (HS%)</span>
          <strong style={{ fontSize: '1.15rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{attributes.aim}</strong>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Suporte</span>
          <strong style={{ fontSize: '1.15rem', color: '#10b981', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{attributes.support}</strong>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Sobrevivência</span>
          <strong style={{ fontSize: '1.15rem', color: '#a855f7', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{attributes.survival}</strong>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Impacto</span>
          <strong style={{ fontSize: '1.15rem', color: '#ff3366', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{attributes.impact}</strong>
        </div>
      </div>

      {/* Nota de Cobertura de Dados (Tratamento resiliente de HS e Dano) */}
      <div style={{ marginTop: '0.7rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
          ✦ Estatísticas calibradas com base em {attributes.dataCoverage.totalMatches} mapas oficiais disputados na temporada.
        </span>
      </div>
    </div>
  );
}
