import { useMemo } from 'react';
import { Gift, Check, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useGifts } from '@/hooks/useGifts';
import type { GiftWithReservation } from '@/types/gift';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  variant = 'default'
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  description?: string;
  variant?: 'default' | 'primary' | 'muted';
}) {
  const variants = {
    default: 'border-border/50 bg-card/80',
    primary: 'border-primary/30 bg-primary/5',
    muted: 'border-border/30 bg-muted/50',
  };

  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    muted: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className={`${variants[variant]} backdrop-blur-sm transition-all hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${iconVariants[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RecentReservations({ gifts }: { gifts: GiftWithReservation[] }) {
  const recentReservations = useMemo(() => {
    return gifts
      .filter((g) => g.reservation)
      .sort((a, b) => 
        new Date(b.reservation!.created_at).getTime() - 
        new Date(a.reservation!.created_at).getTime()
      )
      .slice(0, 5);
  }, [gifts]);

  if (recentReservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Últimas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma reserva realizada ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Últimas Reservas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentReservations.map((gift) => (
          <div key={gift.id} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{gift.name}</p>
              <p className="text-xs text-muted-foreground">
                {gift.reservation!.guest_name}
                {gift.reservation!.is_couple && gift.reservation!.spouse_name && (
                  <> e {gift.reservation!.spouse_name}</>
                )}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(gift.reservation!.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: gifts, isLoading } = useGifts();

  const stats = useMemo(() => {
    if (!gifts) return { total: 0, reserved: 0, available: 0, percentage: 0 };
    const reserved = gifts.filter((g) => g.is_reserved).length;
    return {
      total: gifts.length,
      reserved,
      available: gifts.length - reserved,
      percentage: gifts.length > 0 ? Math.round((reserved / gifts.length) * 100) : 0,
    };
  }, [gifts]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso do seu chá de cozinha
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total de Presentes"
            value={stats.total}
            icon={Gift}
            description="Itens na lista"
          />
          <StatCard
            title="Reservados"
            value={stats.reserved}
            icon={Check}
            description="Presentes confirmados"
          />
          <StatCard
            title="Disponíveis"
            value={stats.available}
            icon={Clock}
            description="Aguardando reserva"
          />
        </div>

        {/* Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {stats.reserved} de {stats.total} presentes reservados
              </span>
              <span className="font-medium">{stats.percentage}%</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <RecentReservations gifts={gifts || []} />
      </div>
    </AdminLayout>
  );
}
