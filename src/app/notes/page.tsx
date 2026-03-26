"use client";

import { useEffect, useState } from 'react';

type NoteCategory = 'PR' | 'Recap' | 'Goal' | 'Cue';

interface GymNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  date: string;
}

const CATEGORIES: { label: string; value: NoteCategory; color: string }[] = [
  { label: '🔥 PR', value: 'PR', color: 'text-red-500 border-red-500/30 bg-red-500/10' },
  { label: '📝 Recap', value: 'Recap', color: 'text-blue-500 border-blue-500/30 bg-blue-500/10' },
  { label: '🚀 Goal', value: 'Goal', color: 'text-primary border-primary/30 bg-primary/10' },
  { label: '💡 Cue', value: 'Cue', color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' },
];

export default function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<GymNote[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Recap');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem('gym_motivator_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNotes = (updatedNotes: GymNote[]) => {
    setNotes(updatedNotes);
    window.localStorage.setItem('gym_motivator_notes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!content.trim()) return;
    const newNote: GymNote = {
      id: Date.now().toString(),
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    saveNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  if (!mounted) return null;

  return (
    <main className="w-full max-w-4xl mx-auto px-5 py-8 lg:py-16 flex flex-col min-h-screen">
      
      {/* Page Header */}
      <header className="flex items-center justify-between mb-8 lg:mb-12 animate-fade-in">
         <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
           Training <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-[#00e676]">Journal</span>
         </h1>
         <button 
           onClick={() => setIsAdding(!isAdding)}
           className="bg-primary text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-hover transition-all duration-300 active:scale-90"
         >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
             {isAdding ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M12 5v14M5 12h14"/>}
           </svg>
         </button>
      </header>

      {/* Dynamic Add Note Form */}
      {isAdding && (
        <section className="bg-surface border border-border-subtle p-6 rounded-3xl mb-12 animate-slide-up shadow-2xl ring-1 ring-white/5">
           <h2 className="text-xl font-bold mb-6 text-white">Capture Training Thought</h2>
           
           <div className="flex flex-col gap-5">
             <div>
               <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block pl-1">Title (Optional)</label>
               <input 
                 type="text" 
                 placeholder="e.g., Heavy Squat Session" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="w-full bg-[#0d0e12] border border-border-subtle p-4 rounded-2xl text-white outline-none focus:border-primary/50 transition-colors"
               />
             </div>

             <div>
               <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block pl-1">Category</label>
               <div className="flex flex-wrap gap-2">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat.value}
                     onClick={() => setCategory(cat.value)}
                     className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                       category === cat.value ? cat.color : 'bg-transparent border-border-subtle text-text-muted hover:border-text-muted'
                     }`}
                   >
                     {cat.label}
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block pl-1">Thoughts</label>
               <textarea 
                 placeholder="How did you feel today? Any wins or form corrections?" 
                 rows={4}
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 className="w-full bg-[#0d0e12] border border-border-subtle p-4 rounded-2xl text-white outline-none focus:border-primary/50 transition-colors resize-none"
               />
             </div>

             <button 
               onClick={addNote}
               disabled={!content.trim()}
               className="bg-primary text-black font-extrabold py-4 rounded-2xl hover:bg-primary-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(194,255,0,0.2)]"
             >
               Add to Journal
             </button>
           </div>
        </section>
      )}

      {/* Notes List */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {notes.length > 0 ? (
          notes.map((note) => {
            const catInfo = CATEGORIES.find(c => c.value === note.category)!;
            return (
              <article key={note.id} className="bg-surface border border-border-subtle p-6 rounded-3xl hover:border-primary/20 transition-all duration-300 group shadow-lg">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border mb-3 ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{note.title}</h3>
                    <p className="text-xs text-text-muted font-semibold mt-1">{note.date}</p>
                  </div>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </article>
            );
          })
        ) : (
          <div className="text-center py-20 px-6 border-2 border-dashed border-border-subtle rounded-3xl opacity-60">
             <div className="bg-surface-hover w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-text-muted">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No Entries Yet</h3>
             <p className="text-text-muted max-w-xs mx-auto">Start documenting your training journey today. Every win counts.</p>
          </div>
        )}
      </div>

    </main>
  );
}
