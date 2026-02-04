import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gift, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Site' },
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/presentes', icon: Gift, label: 'Presentes' },
  { to: '/admin/reservas', icon: Users, label: 'Reservas' },
];

export function AdminFloatingNav() {
  const location = useLocation();
  
  // Only show on admin routes or root
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // For now, show the nav on admin routes
  // Later this can be controlled by authentication
  if (!isAdminRoute && location.pathname !== '/') return null;

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-2xl border border-border/40 bg-card/80 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        {/* Glow effect behind */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-primary/10 blur-xl" />
        
        {navItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to) && item.to !== '/';
          const isHome = item.to === '/' && location.pathname === '/';
          const active = isActive || isHome;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-xl px-4 py-2.5 transition-all duration-300',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {/* Active indicator glow */}
              {active && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-primary/50 blur-md" />
              )}
              
              <item.icon className={cn(
                'h-5 w-5 transition-transform duration-300',
                active ? 'scale-110' : 'group-hover:scale-110'
              )} />
              
              <span className={cn(
                'mt-1 text-[10px] font-medium transition-all duration-300',
                active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
