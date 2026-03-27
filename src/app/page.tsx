"use client";

import { useEffect, useState } from 'react';
import { usePusher } from '@/hooks/usePusher';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { pushEnabled, subscribeToTopics } = usePusher();
  const [notifications, setNotifications] = useState({
    morning: true,
    workout: true,
    evening: true
  });

  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  useEffect(() => {
    setMounted(true);
    // load streak from local storage
    const saved = window.localStorage.getItem('gym_workout_dates');
    if (saved) {
      const dates = JSON.parse(saved);
      setWorkoutDates(dates);
      calculateAndSetStreak(dates);
    }
  }, []);

  const getTodayStr = (): string => {
    // get local date string YYYY-MM-DD reliably without timezones breaking it
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  const calculateAndSetStreak = (dates: string[]) => {
    if (dates.length === 0) return setStreak(0);
    
    const uniqueDates = Array.from(new Set(dates)).sort((a,b) => new Date(b).getTime() - new Date(a).getTime()); 
    const todayStr = getTodayStr();
    setHasLoggedToday(uniqueDates.includes(todayStr));

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const firstLogged = new Date(uniqueDates[0]);
    firstLogged.setHours(0,0,0,0);
    
    // if the most recent log isn't today or yesterday, streak is broken
    if (firstLogged.getTime() !== today.getTime() && firstLogged.getTime() !== yesterday.getTime()) {
      return setStreak(0);
    }

    let currentStreak = 0;
    let expectedDate = firstLogged;
    
    for (const dStr of uniqueDates) {
      const d = new Date(dStr);
      d.setHours(0,0,0,0);
      if (d.getTime() === expectedDate.getTime()) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; 
      }
    }
    setStreak(currentStreak);
  };

  const logWorkoutForToday = () => {
    const todayStr = getTodayStr();
    if (!workoutDates.includes(todayStr)) {
      const newDates = [...workoutDates, todayStr];
      setWorkoutDates(newDates);
      window.localStorage.setItem('gym_workout_dates', JSON.stringify(newDates));
      calculateAndSetStreak(newDates);
    }
  };

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
    <main className="w-full max-w-7xl mx-auto px-5 py-8 lg:py-16 flex flex-col min-h-screen">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 lg:mb-16 animate-fade-in">
        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Ignite Your <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-[#00e676]">Drive</span>
          </h1>
          <p className="text-text-muted text-base sm:text-lg mt-2 lg:mt-4 max-w-2xl leading-relaxed">
            Elevate your training unyieldingly. Manage your daily motivations and stay completely focused on crushing your goals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {pushEnabled && (
            <button 
              className="bg-transparent text-text-main border border-border-subtle hover:bg-surface hover:border-text-muted px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold transition-all duration-200 text-sm sm:text-base"
              onClick={testPushNotification}
            >
              Test Push
            </button>
          )}

          <button
            className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-display font-semibold transition-all duration-200 text-sm sm:text-base
              ${pushEnabled 
                ? 'bg-surface text-primary border border-primary' 
                : 'bg-primary text-black hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(194,255,0,0.3)]'
              }`}
            onClick={handleEnablePush}
          >
            {pushEnabled ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Push Active
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Enable Push
              </>
            )}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Morning Notification Card */}
        <article className="bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold">Morning Kickstart</h2>
          </div>
          <p className="text-text-muted text-sm sm:text-base mb-6 leading-relaxed">
            Daily quotes and motivation sent at 9:00 AM as you head into the office to start your day with an iron mindset.
          </p>
          <div className="switch-container">
            <span className="font-medium text-sm sm:text-base">Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.morning} onChange={() => toggleNotification('morning')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>

        {/* Pre-Workout Notification Card */}
        <article className="bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43 1.43-1.43-1.43-1.43 1.43-1.43Z" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold">Pre-Workout Call</h2>
          </div>
          <p className="text-text-muted text-sm sm:text-base mb-6 leading-relaxed">
            No excuses. Sent at 6:00 PM as you head home to shift from employee mode to athlete mode and dial in your focus.
          </p>
          <div className="switch-container">
            <span className="font-medium text-sm sm:text-base">Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.workout} onChange={() => toggleNotification('workout')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>

        {/* Evening Notification Card */}
        <article className="bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold">Evening Reflection</h2>
          </div>
          <p className="text-text-muted text-sm sm:text-base mb-6 leading-relaxed">
            Sent at 11:00 PM. Review your progress, celebrate tiny wins, prep tomorrow's gym bag, and go to sleep.
          </p>
          <div className="switch-container">
            <span className="font-medium text-sm sm:text-base">Active</span>
            <label className="switch">
              <input type="checkbox" checked={notifications.evening} onChange={() => toggleNotification('evening')} />
              <span className="slider round"></span>
            </label>
          </div>
        </article>
      </section>

      <section className="mt-10 lg:mt-20 bg-surface p-6 sm:p-10 rounded-2xl border border-border-subtle text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl sm:text-4xl font-semibold mb-4 text-white tracking-tight">Progress Tracking System</h2>
        <div className="flex justify-center items-center mb-4 sm:mb-6">
           <div className="bg-surface-hover rounded-2xl px-5 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shadow-xl border border-border-subtle/50">
             <div className="text-4xl sm:text-5xl font-display font-extrabold text-primary">{streak}</div>
             <div className="text-base sm:text-lg text-text-muted font-medium text-left">
               <div>Day</div>
               <div>Streak</div>
             </div>
           </div>
        </div>
        <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          {streak > 0 
            ? `Your history shows a ${streak}-day streak! Don't let the fire die out. The difference between who you are and who you want to be is what you do today.`
            : `You don't have an active streak right now. Log a workout today to light the fire!`}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {!hasLoggedToday ? (
            <button 
              onClick={logWorkoutForToday} 
              className="bg-primary text-black px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(194,255,0,0.3)] shadow-lg w-full sm:w-auto"
            >
              Log Workout for Today
            </button>
          ) : (
            <button 
              disabled
              className="bg-surface-hover text-primary border border-primary/30 px-8 py-3 rounded-full font-semibold opacity-90 cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Workout Completed Today
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
