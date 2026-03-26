import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border-subtle mt-auto py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-display font-bold text-white tracking-tight">Gym Motivator</span>
        </div>
        
        <p className="text-text-muted text-sm text-center md:text-left">
          Stay focused. Stay disciplined. Ignite your drive.
        </p>
        
        <div className="flex items-center gap-4">
          <Link href="/schedule" className="text-text-muted hover:text-primary text-sm transition-colors">
            Schedule
          </Link>
          <Link href="/notes" className="text-text-muted hover:text-primary text-sm transition-colors">
            Journal
          </Link>
        </div>
      </div>
    </footer>
  );
}
