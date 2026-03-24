"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <header className="animate-fade-in" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-xl">
            Your Daily <span className="text-gradient">Schedule</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', lineHeight: '1.6' }}>
            A detailed breakdown of your training timeline. Execute precisely.
          </p>
        </div>
        <div>
          <Link href="/">
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Morning Block */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ minWidth: '100px', fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
            09:00
          </div>
          <div style={{ flex: 1, borderLeft: '2px dashed var(--border-color)', paddingLeft: '2rem', paddingBottom: '2rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>The Daily Grind & Office Prep</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Head to the office. Drink your water. Attack your professional goals without losing sight of your fitness journey tonight.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: '#22252c', borderRadius: '4px', fontSize: '0.9rem', color: 'white' }}>Hydration</span>
              <span style={{ padding: '0.25rem 0.75rem', background: '#22252c', borderRadius: '4px', fontSize: '0.9rem', color: 'white' }}>Mindset</span>
            </div>
          </div>
        </div>

        {/* Workout Block */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ minWidth: '100px', fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
            18:00
          </div>
          <div style={{ flex: 1, borderLeft: '2px dashed var(--border-color)', paddingLeft: '2rem', paddingBottom: '2rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Pre-Workout Transition</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Commute home, disconnect from work, and consume your pre-workout. The real shift starts now.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(194,255,0,0.1)', border: '1px solid var(--primary)', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--primary)' }}>Main Event</span>
            </div>
          </div>
        </div>

        {/* Evening Block */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.3s', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ minWidth: '100px', fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>
            23:00
          </div>
          <div style={{ flex: 1, borderLeft: '2px dashed transparent', paddingLeft: '2rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Evening Reflection & Sleep Prep</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Log off completely. Prepare the gym bag for tomorrow, stretch heavy muscles, and begin recovery sleep.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
