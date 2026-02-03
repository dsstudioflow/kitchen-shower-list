import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gift, Users, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/presentes', icon: Gift, label: 'Presentes' },
  { to: '/admin/reservas', icon: Users, label: 'Reservas' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <NavLink to="/admin" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/30 blur-lg" />
              <div className="relative rounded-xl bg-gradient-to-br from-primary to-emerald-600 p-2.5">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Painel Admin
            </span>
          </NavLink>
          <NavLink 
            to="/" 
            className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Ver site
          </NavLink>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[65px] z-40 border-b border-border/30 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
