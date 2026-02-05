import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGifts } from '@/hooks/useGifts';
import { formatPrice } from '@/types/gift';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DashboardReservations() {
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const { data: gifts, isLoading: giftsLoading } = useGifts(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || giftsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const reservedGifts = gifts?.filter(g => g.is_reserved && g.reservation) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">Reservas</h1>
          <p className="text-muted-foreground">
            Acompanhe os presentes reservados pelos seus convidados
          </p>
        </div>

        {/* Table */}
        {reservedGifts.length > 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Reservado por</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservedGifts.map((gift) => (
                  <TableRow key={gift.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {gift.image_url && (
                          <img 
                            src={gift.image_url} 
                            alt={gift.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{gift.name}</p>
                          <Badge variant="secondary" className="mt-1">
                            {gift.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {gift.price ? formatPrice(gift.price) : '-'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {gift.reservation?.guest_name}
                          {gift.reservation?.is_couple && gift.reservation.spouse_name && (
                            <span className="text-muted-foreground">
                              {' '}&amp; {gift.reservation.spouse_name}
                            </span>
                          )}
                        </p>
                        {gift.reservation?.is_couple && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Casal
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${gift.reservation?.guest_email}`}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Mail className="h-3 w-3" />
                        {gift.reservation?.guest_email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {gift.reservation?.created_at && format(
                          new Date(gift.reservation.created_at),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma reserva ainda. Compartilhe sua lista com seus convidados!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
