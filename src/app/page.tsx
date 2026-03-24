"use client";

import { useEffect, useState } from 'react';
import { usePusher } from '@/hooks/usePusher';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { pushEnabled, subscribeToTopics } = usePusher();
  const [notifications, setNotifications] = useState({
    morning: true,
    workout: true,
    evening: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update subscriptions when toggles change, but only if push is globally enabled
  useEffect(() => {
    if (pushEnabled) {
      applySubscriptions();
    }
  }, [notifications, pushEnabled]);

  if (!mounted) return null;

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const applySubscriptions = async () => {
    const activeTopics = Object.entries(notifications)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);
    await subscribeToTopics(activeTopics);
  };

  const handleEnablePush = async () => {
    // If permission wasn't granted yet, this might trigger a prompt
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return alert("Notifications blocked by browser.");
    }
    await applySubscriptions();
  };

  const testPushNotification = async () => {
    try {
      const response = await fetch('/api/notifications/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'workout', secret: 'my_secure_github_action_secret' })
      });
      if (!response.ok) throw new Error('Failed to trigger');
      console.log('Test notification sent!');
    } catch (e) {
      console.error(e);
      alert('Error triggering test notification');
    }
  };

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <header className="animate-fade-in" style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-xl">
            Ignite Your <span className="text-gradient">Drive</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', lineHeight: '1.6' }}>
            Elevate your training unyieldingly. Manage your daily motivations and stay completely focused on crushing your goals.
          </p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {pushEnabled && (
            <button className="btn-secondary" onClick={testPushNotification} style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
              Test Push
            </button>
          )}

          <button 
            className="btn-primary" 
            onClick={handleEnablePush}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: pushEnabled ? 'var(--bg-surface)' : 'var(--primary)',
              color: pushEnabled ? 'var(--primary)' : '#000',
              border: pushEnabled ? '1px solid var(--primary)' : 'none'
            }}
          >
            {pushEnabled ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Push Active
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Enable Push
              </>
            )}
          </button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Morning Notification Card */}
        <article className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(194, 255, 0, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <h2 className="heading-lg">Morning Kickstart</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
            Daily quotes and motivation sent at 9:00 AM as you head into the office to start your day with an iron mindset.
          </p>
          <div className="switch-container">
            <span style={{ fontWeight: '500' }}>Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.morning} onChange={() => toggleNotification('morning')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>

        {/* Pre-Workout Notification Card */}
        <article className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(194, 255, 0, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
               <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43 1.43-1.43-1.43-1.43 1.43-1.43Z"/></svg>
            </div>
            <h2 className="heading-lg">Pre-Workout Call</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
            No excuses. Sent at 6:00 PM as you head home to shift from employee mode to athlete mode and dial in your focus.
          </p>
          <div className="switch-container">
            <span style={{ fontWeight: '500' }}>Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.workout} onChange={() => toggleNotification('workout')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>

        {/* Evening Notification Card */}
        <article className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(194, 255, 0, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </div>
            <h2 className="heading-lg">Evening Reflection</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
            Sent at 11:00 PM. Review your progress, celebrate tiny wins, prep tomorrow's gym bag, and go to sleep.
          </p>
          <div className="switch-container">
            <span style={{ fontWeight: '500' }}>Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.evening} onChange={() => toggleNotification('evening')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>
      </section>

      <section className="animate-fade-in" style={{ marginTop: '5rem', animationDelay: '0.4s', background: 'var(--bg-surface)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Progress Tracking System</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Your history shows a 14-day streak! Don't let the fire die out. The difference between who you are and who you want to be is what you do today.
        </p>
        <button className="btn-secondary">View Performance Stats</button>
      </section>
    </main>
  );
}
