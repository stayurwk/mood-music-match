import { Link, useLocation } from "wouter";
import { Music2, History } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Music2 className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Mood<span className="text-primary">Tunes</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive('/') 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-muted-foreground hover:text-white hover:bg-white/5'}
            `}>
              Recommend
            </Link>
            
            <Link href="/history" className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive('/history') 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-muted-foreground hover:text-white hover:bg-white/5'}
            `}>
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
