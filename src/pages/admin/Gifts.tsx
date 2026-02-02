import { useState } from 'react';
import { Plus, Pencil, Trash2, RotateCcw, Gift } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { GiftFormModal } from '@/components/admin/GiftFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useGifts, useDeleteGift, useReleaseGift } from '@/hooks/useGifts';
import { useToast } from '@/hooks/use-toast';
import type { Gift as GiftType } from '@/types/gift';

export default function AdminGifts() {
  const { data: gifts, isLoading } = useGifts();
  const deleteGift = useDeleteGift();
  const releaseGift = useReleaseGift();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [releaseConfirmId, setReleaseConfirmId] = useState<string | null>(null);

  const filteredGifts = gifts?.filter((gift) =>
    gift.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleEdit = (gift: GiftType) => {
    setEditingGift(gift);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteGift.mutateAsync(deleteConfirmId);
      toast({ title: 'Presente removido com sucesso!' });
    } catch {
      toast({ title: 'Erro ao remover presente', variant: 'destructive' });
    }
    setDeleteConfirmId(null);
  };

  const handleRelease = async () => {
    if (!releaseConfirmId) return;
    try {
      await releaseGift.mutateAsync(releaseConfirmId);
      toast({ title: 'Reserva liberada com sucesso!' });
    } catch {
      toast({ title: 'Erro ao liberar reserva', variant: 'destructive' });
    }
    setReleaseConfirmId(null);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingGift(null);
  };

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Presentes</h1>
            <p className="text-muted-foreground">
              Gerencie os itens da sua lista
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar presente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Table */}
        {filteredGifts.length === 0 ? (
          <div className="py-12 text-center">
            <Gift className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium">Nenhum presente encontrado</h3>
            <p className="mb-4 text-muted-foreground">
              {gifts?.length === 0 
                ? 'Comece adicionando seu primeiro presente à lista.'
                : 'Tente ajustar a busca.'}
            </p>
            {gifts?.length === 0 && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar primeiro presente
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presente</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGifts.map((gift) => (
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
                          <p className="text-sm text-muted-foreground line-clamp-1 sm:hidden">
                            {gift.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary">{gift.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {gift.is_reserved ? (
                        <Badge variant="outline">Reservado</Badge>
                      ) : (
                        <Badge>Disponível</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {gift.is_reserved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Liberar reserva"
                            onClick={() => setReleaseConfirmId(gift.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(gift)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(gift.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <GiftFormModal
        gift={editingGift}
        open={isFormOpen}
        onOpenChange={handleFormClose}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover presente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O presente será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Release Confirmation */}
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
            <AlertDialogAction onClick={handleRelease}>Liberar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
