'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>AO VIVO / EM BREVE</span>;
  }

  return (
    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)' }}>{timeLeft.days}</strong>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dias</span>
      </div>
      <span style={{ color: 'var(--text-muted)' }}>:</span>
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <strong style={{ display: 'block', fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{String(timeLeft.hours).padStart(2, '0')}</strong>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Horas</span>
      </div>
      <span style={{ color: 'var(--text-muted)' }}>:</span>
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <strong style={{ display: 'block', fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{String(timeLeft.minutes).padStart(2, '0')}</strong>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min</span>
      </div>
      <span style={{ color: 'var(--text-muted)' }}>:</span>
      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)' }}>{String(timeLeft.seconds).padStart(2, '0')}</strong>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seg</span>
      </div>
    </div>
  );
}
