'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PlayerChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-rajdhani)' }}>Evolução de K/D por Partida</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid var(--cyan)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: 'var(--cyan)', fontWeight: 'bold' }}
          />
          <Line type="monotone" dataKey="kd" stroke="var(--cyan)" strokeWidth={3} dot={{ r: 5, fill: 'var(--cyan)', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 8 }} name="K/D Ratio" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
