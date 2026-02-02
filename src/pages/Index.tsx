import { useState, useMemo } from 'react';
import { Heart, Gift } from 'lucide-react';
import { GiftCard } from '@/components/guest/GiftCard';
import { GiftFilters } from '@/components/guest/GiftFilters';
import { ReservationModal } from '@/components/guest/ReservationModal';
import { useGifts } from '@/hooks/useGifts';
import type { GiftWithReservation, GiftCategory } from '@/types/gift';

const Index = () => {
  const { data: gifts, isLoading, error } = useGifts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | null>(null);
  const [selectedGift, setSelectedGift] = useState<GiftWithReservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGifts = useMemo(() => {
    if (!gifts) return [];

    return gifts.filter((gift) => {
      const matchesSearch = gift.name.toLowerCase().includes(search.toLowerCase()) ||
        gift.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || gift.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [gifts, search, selectedCategory]);

  const stats = useMemo(() => {
    if (!gifts) return { total: 0, reserved: 0, available: 0 };
    const reserved = gifts.filter((g) => g.is_reserved).length;
    return {
      total: gifts.length,
      reserved,
      available: gifts.length - reserved,
    };
  }, [gifts]);

  const handleReserve = (gift: GiftWithReservation) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Heart className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Chá de Cozinha
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Escolha um presente especial para nos ajudar a montar nossa nova casa. 
            Cada item foi escolhido com carinho!
          </p>

          {/* Stats */}
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{stats.reserved}</div>
              <div className="text-sm text-muted-foreground">Reservados</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <GiftFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground">Carregando presentes...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-8 text-center">
            <p className="text-destructive">Erro ao carregar presentes. Tente novamente.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredGifts.length === 0 && (
          <div className="py-12 text-center">
            <Gift className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium text-foreground">
              {gifts?.length === 0 ? 'Nenhum presente cadastrado ainda' : 'Nenhum presente encontrado'}
            </h3>
            <p className="text-muted-foreground">
              {gifts?.length === 0 
                ? 'O casal ainda não adicionou presentes à lista.'
                : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        )}

        {/* Gift Grid */}
        {!isLoading && !error && filteredGifts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onReserve={handleReserve} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Feito com ❤️ para celebrar nosso amor</p>
        </div>
      </footer>

      {/* Reservation Modal */}
      <ReservationModal
        gift={selectedGift}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Index;
