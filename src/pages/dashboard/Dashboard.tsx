import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ShareLinkCard } from '@/components/dashboard/ShareLinkCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGifts } from '@/hooks/useGifts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuthContext();
  const { data: gifts, isLoading: giftsLoading } = useGifts(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    total: gifts?.length || 0,
    reserved: gifts?.filter(g => g.is_reserved).length || 0,
    available: (gifts?.length || 0) - (gifts?.filter(g => g.is_reserved).length || 0),
    percentage: gifts?.length 
      ? Math.round((gifts.filter(g => g.is_reserved).length / gifts.length) * 100) 
      : 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="font-display text-3xl font-bold">
            Olá, {profile?.partner_name_1}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie sua lista de presentes e acompanhe as reservas
          </p>
        </div>

        {/* Share Link */}
        {profile?.share_slug && (
          <ShareLinkCard slug={profile.share_slug} />
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Presentes
              </CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                itens na lista
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponíveis
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-primary/20" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.available}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                aguardando reserva
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reservados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.reserved}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                por convidados
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progresso
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.percentage}%</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reservations Preview */}
        {gifts && gifts.filter(g => g.is_reserved).length > 0 && (
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Últimas Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gifts
                  .filter(g => g.is_reserved && g.reservation)
                  .slice(0, 3)
                  .map((gift) => (
                    <div 
                      key={gift.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div>
                        <p className="font-medium">{gift.name}</p>
                        <p className="text-sm text-muted-foreground">
                          por {gift.reservation?.guest_name}
                          {gift.reservation?.is_couple && gift.reservation.spouse_name && (
                            <> & {gift.reservation.spouse_name}</>
                          )}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Reservado
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
