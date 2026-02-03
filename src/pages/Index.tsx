import { useState, useMemo } from 'react';
import { Heart, Gift, Sparkles } from 'lucide-react';
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
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-16 text-center md:py-24">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Lista de Presentes</span>
          </div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-3xl bg-primary/30 blur-2xl" />
              <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-emerald-600 p-5 shadow-2xl shadow-primary/30">
                <Heart className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">Chá de Cozinha</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Escolha um presente especial para nos ajudar a montar nossa nova casa. 
            Cada item foi escolhido com carinho!
          </p>

          {/* Stats */}
          <div className="mx-auto mt-12 flex max-w-md justify-center">
            <div className="glass flex w-full items-center justify-around rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground md:text-5xl">
                  {stats.total}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Total
                </div>
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">
                  {stats.available}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Disponíveis
                </div>
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="text-center">
                <div className="text-4xl font-bold text-muted-foreground md:text-5xl">
                  {stats.reserved}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Reservados
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-10">
          <GiftFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative mx-auto mb-6 h-12 w-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              </div>
              <p className="text-muted-foreground">Carregando presentes...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-destructive">Erro ao carregar presentes. Tente novamente.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredGifts.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
              <Gift className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
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
            {filteredGifts.map((gift, index) => (
              <div 
                key={gift.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <GiftCard gift={gift} onReserve={handleReserve} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Feito com <Heart className="inline-block h-4 w-4 text-primary" /> para celebrar nosso amor
          </p>
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
