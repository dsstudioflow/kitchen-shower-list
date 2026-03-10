import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gift, Users, ExternalLink, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useState } from 'react';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/presentes', icon: Gift, label: 'Presentes' },
  { to: '/dashboard/reservas', icon: Users, label: 'Reservas' },
  { to: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { profile, signOut, loading } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const coupleNames = profile?.partner_name_2 
    ? `${profile.partner_name_1} & ${profile.partner_name_2}`
    : profile?.partner_name_1;

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
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <NavLink to="/dashboard" className="flex items-center gap-2 md:gap-3 min-w-0">
            <img src={logo} alt="Lista de Presentes" className="h-8 w-8 flex-shrink-0 object-contain" />
            <div className="min-w-0">
              <span className="block truncate font-display text-sm font-bold text-foreground md:text-lg">
                {loading ? 'Carregando...' : coupleNames || 'Minha Lista'}
              </span>
              {profile?.event_name && (
                <p className="truncate text-xs text-muted-foreground">{profile.event_name}</p>
              )}
            </div>
          </NavLink>
          <div className="flex items-center gap-2 md:gap-3">
            {profile?.share_slug && (
              <Button 
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <a href={`/lista/${profile.share_slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver lista
                </a>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="hidden sm:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/30 bg-background/95 backdrop-blur-xl sm:hidden">
            <div className="container mx-auto px-4 py-3 space-y-2">
              {profile?.share_slug && (
                <a 
                  href={`/lista/${profile.share_slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver lista pública
                </a>
              )}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Navigation */}
      <nav className="sticky top-[57px] z-40 border-b border-border/30 bg-background/60 backdrop-blur-md md:top-[65px]">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 md:py-3 scrollbar-none">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-all duration-300 md:gap-2 md:px-5 md:py-2.5 md:text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}