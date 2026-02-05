import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GiftFormModal } from '@/components/admin/GiftFormModal';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGifts, useDeleteGift, useReleaseGift } from '@/hooks/useGifts';
import type { GiftWithReservation } from '@/types/gift';
import { formatPrice } from '@/types/gift';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Unlock } from 'lucide-react';

export default function DashboardGifts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuthContext();
  const { data: gifts, isLoading: giftsLoading } = useGifts(user?.id);
  const deleteGift = useDeleteGift();
  const releaseGift = useReleaseGift();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftWithReservation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [releaseConfirmId, setReleaseConfirmId] = useState<string | null>(null);

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

  const handleEdit = (gift: GiftWithReservation) => {
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteGift.mutateAsync(deleteConfirmId);
      toast({ title: 'Presente excluído!' });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
    setDeleteConfirmId(null);
  };

  const handleRelease = async () => {
    if (!releaseConfirmId) return;
    try {
      await releaseGift.mutateAsync(releaseConfirmId);
      toast({ title: 'Reserva liberada!' });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
    setReleaseConfirmId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGift(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Presentes</h1>
            <p className="text-muted-foreground">
              Gerencie os itens da sua lista
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {/* Table */}
        {gifts && gifts.length > 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gifts.map((gift) => (
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
                          {gift.description && (
                            <p className="max-w-xs truncate text-sm text-muted-foreground">
                              {gift.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{gift.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {gift.price ? formatPrice(gift.price) : '-'}
                    </TableCell>
                    <TableCell>
                      {gift.is_reserved ? (
                        <Badge variant="outline" className="border-muted-foreground/30">
                          Reservado
                        </Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          Disponível
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(gift)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {gift.is_reserved && (
                            <DropdownMenuItem onClick={() => setReleaseConfirmId(gift.id)}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Liberar reserva
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => setDeleteConfirmId(gift.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum presente cadastrado ainda.
            </p>
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro presente
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      <GiftFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        gift={editingGift}
        profileId={user.id}
      />

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir presente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O presente será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação de liberação */}
      <AlertDialog open={!!releaseConfirmId} onOpenChange={() => setReleaseConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liberar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              O presente voltará a ficar disponível para outros convidados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRelease}>
              Liberar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
