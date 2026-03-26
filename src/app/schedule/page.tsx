"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SCHEDULE_DATA = {
  Monday: { 
    title: "Chest + Triceps", color: "text-red-500", 
    image: "/images/workouts/monday.avif",
    exercises: ["Bench press", "Incline DB press", "High to low cable fly", "Cable fly / pec deck", "Overhead extension", "Pushdowns"] 
  },
  Tuesday: { 
    title: "Back + Biceps", color: "text-blue-500", 
    image: "/images/workouts/tuesday.avif",
    exercises: ["Lat pulldown", "Seated cable rowing", "Lat pullovers", "T-bar rowing", "Cable curls", "Reverse cable curls"] 
  },
  Wednesday: { 
    title: "Shoulders + Abs", color: "text-yellow-500", 
    image: "/images/workouts/wednesday.avif",
    exercises: ["DB press", "Lateral raises", "Upright rows", "Face pulls / reverse fly", "Shrugs", "Abs (crunches, plank)"] 
  },
  Thursday: { 
    title: "Legs", color: "text-green-500", 
    image: "/images/workouts/thursday.avif",
    exercises: ["Hack squat / barbell squats", "Leg press", "Leg extension", "Seated hamstring curls", "Adductors", "Calf raises"] 
  },
  Friday: { 
    title: "Arms", color: "text-primary", 
    image: "/images/workouts/friday.avif",
    exercises: ["Cable curls", "Hammer curls", "Triceps extensions", "Pushdowns", "Forearms"] 
  },
  Saturday: { 
    title: "Upper Pump + Abs", color: "text-orange-500", 
    image: "/images/workouts/saturday.avif",
    exercises: ["Machine chest press", "Cable fly", "Pec deck", "Lateral raises", "Rear delts", "Abs"] 
  },
  Sunday: { 
    title: "Rest", color: "text-slate-400", 
    image: "/images/workouts/sunday.avif",
    exercises: [] 
  }
};

export default function SchedulePage() {
  const [mounted, setMounted] = useState(false);
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [todayName, setTodayName] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Set the initial active tab to whatever today actually is
    const todayIndex = (new Date().getDay() + 6) % 7; // map 0 (Sun) to 6, 1 (Mon) to 0
    const today = WEEK_DAYS[todayIndex];
    setTodayName(today);
    setActiveDay(today);

    // load logs from local storage
    const saved = window.localStorage.getItem('gym_workout_dates');
    if (saved) {
      const dates = JSON.parse(saved);
      setWorkoutDates(dates);
      checkIfLoggedToday(dates);
    }
  }, []);

  const getTodayStr = (): string => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  const checkIfLoggedToday = (dates: string[]) => {
    const todayStr = getTodayStr();
    setHasLoggedToday(dates.includes(todayStr));
  };

  const logWorkoutForToday = () => {
    const todayStr = getTodayStr();
    if (!workoutDates.includes(todayStr)) {
      const newDates = [...workoutDates, todayStr];
      setWorkoutDates(newDates);
      window.localStorage.setItem('gym_workout_dates', JSON.stringify(newDates));
      checkIfLoggedToday(newDates);
    }
  };

  if (!mounted) return null;

  const activeData = SCHEDULE_DATA[activeDay as keyof typeof SCHEDULE_DATA];

  return (
    <main className="w-full max-w-7xl mx-auto px-5 py-8 lg:py-16 flex flex-col min-h-screen">
      
      {/* Page Header */}
      <header className="mb-6 lg:mb-10 animate-fade-in">
         <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-2 text-center lg:text-left">
           Training <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-[#00e676]">Schedule</span>
         </h1>
      </header>

      {/* Navigation - Mobile Select & Desktop Pills */}
      <div className="animate-fade-in group">
        {/* Mobile Dropdown Wrapper */}
        <div className="sm:hidden mb-6 relative">
          <select 
            value={activeDay} 
            onChange={(e) => setActiveDay(e.target.value)}
            className="w-full bg-surface border border-border-subtle py-3 px-5 rounded-2xl text-base font-bold text-white outline-none appearance-none shadow-lg cursor-pointer transition-all focus:border-primary/50"
          >
            {WEEK_DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        {/* Desktop Horizontal Pills Wrapper */}
        <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10 lg:mb-12">
          {WEEK_DAYS.map(day => (
            <button 
              key={day} 
              onClick={() => setActiveDay(day)}
              className={`px-5 py-2.5 rounded-full font-bold transition-all duration-300 border-2 ${
                activeDay === day 
                  ? 'bg-white text-black border-white shadow-[0_8px_20px_rgba(255,255,255,0.2)] scale-105' 
                  : 'bg-transparent text-text-muted border-border-subtle hover:border-text-main hover:text-text-main hover:bg-surface'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout Grid */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
        
        {/* Left Column: Hero Header Card (Sticky on Large Screens) */}
        <div className="lg:sticky lg:top-24 mb-8 lg:mb-0 animate-fade-in">
          <div className="relative w-full rounded-3xl overflow-hidden min-h-[220px] lg:h-[600px] border border-border-subtle shadow-2xl group ring-1 ring-white/10">
            {/* Background Image */}
            <Image 
              src={activeData.image} 
              alt={activeData.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              priority
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent lg:bg-linear-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full p-6 sm:p-12 flex flex-col justify-end">
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-1 text-white drop-shadow-2xl">{activeDay}</h2>
                  <h3 className={`text-2xl sm:text-4xl font-bold font-display ${activeData.color} drop-shadow-xl inline-block`}>
                    {activeData.title}
                  </h3>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm font-semibold text-white w-fit">
                  {activeData.exercises.length > 0 ? `${activeData.exercises.length} Exercises` : 'Recovery & Zen'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exercises & Action Button */}
        <div className="flex flex-col animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {activeData.exercises.length > 0 ? (
            <div className="flex flex-col gap-3 mb-12">
              {activeData.exercises.map((ex, i) => (
                <div key={i} className="bg-surface p-4 sm:p-6 rounded-2xl border border-border-subtle hover:border-primary/20 hover:shadow-xl hover:translate-x-1 transition-all duration-300 flex items-center gap-4 group/item">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg bg-[#0d0e12] ${activeData.color} border border-border-subtle group-hover/item:border-primary/30 transition-colors shadow-inner`}>
                    {i + 1}
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-white leading-tight capitalize tracking-tight">{ex}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface p-10 text-center rounded-3xl border border-border-subtle mb-10 shadow-xl animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-5 bg-slate-400/10 rounded-full flex items-center justify-center text-slate-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 text-white">Rest Day</h3>
              <p className="text-text-muted text-base max-w-sm mx-auto italic">"Muscles are torn in the gym, fed in the kitchen, and built in bed."</p>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center pb-12 mt-auto">
            {hasLoggedToday ? (
              <button disabled className="bg-surface-hover text-primary/70 border border-primary/20 py-4.5 rounded-full font-bold opacity-80 cursor-not-allowed flex items-center justify-center gap-2 w-full text-base shadow-inner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Workout Logged
              </button>
            ) : (
              <button 
                onClick={logWorkoutForToday} 
                className="bg-primary text-black py-4.5 rounded-full font-extrabold transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(194,255,0,0.2)] w-full text-base active:scale-95 group/btn relative overflow-hidden"
              >
                <span className="relative z-10">{activeDay === todayName ? 'Crush Today\'s Workout' : `Mark Workout Complete`}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
