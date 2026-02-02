import { useMemo } from 'react';
import { Users, Gift, Calendar, Mail } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGifts } from '@/hooks/useGifts';

export default function AdminReservations() {
  const { data: gifts, isLoading } = useGifts();

  const reservations = useMemo(() => {
    if (!gifts) return [];
    return gifts
      .filter((g) => g.reservation)
      .sort((a, b) =>
        new Date(b.reservation!.created_at).getTime() -
        new Date(a.reservation!.created_at).getTime()
      );
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
          <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">
            Veja quem escolheu cada presente
          </p>
        </div>

        {reservations.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium">Nenhuma reserva ainda</h3>
            <p className="text-muted-foreground">
              As reservas aparecerão aqui quando os convidados escolherem presentes.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presente</TableHead>
                  <TableHead>Convidado</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((gift) => (
                  <TableRow key={gift.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="hidden h-12 w-12 overflow-hidden rounded-lg bg-muted sm:block">
                          {gift.image_url ? (
                            <img
                              src={gift.image_url}
                              alt={gift.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Gift className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{gift.name}</p>
                          <Badge variant="secondary" className="mt-1">
                            {gift.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {gift.reservation!.guest_name}
                          {gift.reservation!.is_couple && gift.reservation!.spouse_name && (
                            <span className="text-muted-foreground"> e {gift.reservation!.spouse_name}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <a 
                            href={`mailto:${gift.reservation!.guest_email}`}
                            className="hover:underline"
                          >
                            {gift.reservation!.guest_email}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={gift.reservation!.is_couple ? 'default' : 'outline'}>
                        {gift.reservation!.is_couple ? 'Casal' : 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(gift.reservation!.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
