import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#0d0e12]/80 backdrop-blur-md border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-xl tracking-tight text-white hover:text-primary transition-colors flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary shrink-0 shadow-[0_0_10px_rgba(194,255,0,0.2)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span className="hidden sm:inline">Gym Motivator</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-semibold text-text-muted hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/schedule" className="text-sm font-semibold text-text-muted hover:text-white transition-colors">
            Schedule
          </Link>
          <Link href="/notes" className="text-sm font-semibold text-text-muted hover:text-white transition-colors">
            Journal
          </Link>
        </div>
      </div>
    </nav>
  );
}
