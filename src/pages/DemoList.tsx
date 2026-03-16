import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Calendar, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GiftCard } from '@/components/guest/GiftCard';
import { GiftFilters } from '@/components/guest/GiftFilters';
import type { GiftWithReservation, GiftCategory } from '@/types/gift';
import logo from '@/assets/logo.png';

const DEMO_GIFTS: GiftWithReservation[] = [
  {
    id: 'demo-1',
    name: 'Jogo de Panelas Antiaderente',
    description: 'Conjunto com 5 peças em alumínio com revestimento cerâmico. Inclui frigideira, caçarola e panelas.',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Cozinha',
    price: 89.90,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'demo-2',
    name: 'Jogo de Cama Casal',
    description: 'Lençol macio em algodão 200 fios. Perfeito para noites confortáveis.',
    image_url: 'https://images.unsplash.com/photo-1522771739806-8c8aff14df26?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Quarto',
    price: 79.90,
    is_reserved: true,
    profile_id: null,
    created_at: '',
    updated_at: '',
    reservation: {
      id: 'res-1',
      gift_id: 'demo-2',
      guest_name: 'Maria Silva',
      guest_email: 'maria@email.com',
      is_couple: false,
      spouse_name: null,
      created_at: '',
    },
  },
  {
    id: 'demo-3',
    name: 'Cafeteira Elétrica',
    description: 'Cafeteira prática para o dia a dia. Prepara até 15 xícaras.',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Cozinha',
    price: 59.90,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'demo-4',
    name: 'Jogo de Toalhas',
    description: 'Kit com 4 toalhas felpudas em algodão. Macias e absorventes.',
    image_url: 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Banheiro',
    price: 49.90,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'demo-5',
    name: 'Almofadas Decorativas',
    description: 'Kit com 4 almofadas em tons neutros para sala de estar.',
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Sala',
    price: 69.90,
    is_reserved: true,
    profile_id: null,
    created_at: '',
    updated_at: '',
    reservation: {
      id: 'res-2',
      gift_id: 'demo-5',
      guest_name: 'João e Ana',
      guest_email: 'joao@email.com',
      is_couple: true,
      spouse_name: 'Ana',
      created_at: '',
    },
  },
  {
    id: 'demo-6',
    name: 'Organizador de Roupas',
    description: 'Cesto organizador dobrável para roupas. Prático e resistente.',
    image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Área de Serviço',
    price: 39.90,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'demo-7',
    name: 'Abajur de Mesa',
    description: 'Abajur com design moderno e luz quente para o quarto.',
    image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Quarto',
    price: 45.00,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'demo-8',
    name: 'Conjunto de Potes',
    description: 'Kit com 6 potes herméticos para armazenar alimentos.',
    image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop',
    purchase_link: null,
    category: 'Cozinha',
    price: 34.90,
    is_reserved: false,
    profile_id: null,
    created_at: '',
    updated_at: '',
  },
];

export default function DemoList() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | null>(null);

  const filteredGifts = useMemo(() => {
    return DEMO_GIFTS.filter((gift) => {
      const matchesSearch = gift.name.toLowerCase().includes(search.toLowerCase()) ||
        gift.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || gift.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const stats = useMemo(() => {
    const reserved = DEMO_GIFTS.filter((g) => g.is_reserved).length;
    return {
      total: DEMO_GIFTS.length,
      reserved,
      available: DEMO_GIFTS.length - reserved,
    };
  }, []);

  const handleReserve = () => {
    // Demo mode: show info instead of reserving
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

      {/* Demo Banner */}
      <div className="relative z-10 border-b border-primary/20 bg-primary/10 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-2.5 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2 text-xs text-primary sm:text-sm">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Este é um <strong>exemplo</strong> de como sua lista ficará para os convidados</span>
          </div>
          <Button size="sm" className="h-8 text-xs" asChild>
            <Link to="/auth">
              Criar minha lista
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-10 text-center sm:py-12 md:py-24">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary sm:px-4 sm:py-2 sm:text-sm md:mb-8">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Chá de Casa Nova</span>
          </div>

          {/* Logo */}
          <div className="mb-4 flex justify-center sm:mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-3xl bg-primary/30 blur-2xl" />
              <img src={logo} alt="Lista de Presentes" className="relative h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight sm:text-3xl md:mb-3 md:text-5xl lg:text-7xl">
            <span className="text-gradient">Lucas & Mariana</span>
          </h1>
          <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm md:mb-4 md:text-base">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>15 de março de 2026</span>
          </div>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-lg">
            Escolha um presente especial para nos ajudar a montar nossa nova casa.
            Cada item foi escolhido com carinho!
          </p>

          {/* Stats */}
          <div className="mx-auto mt-6 flex max-w-xs justify-center sm:mt-8 sm:max-w-md md:mt-12">
            <div className="glass flex w-full items-center justify-around rounded-2xl p-3 sm:p-4 md:p-6">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground sm:text-2xl md:text-5xl">{stats.total}</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:mt-1 sm:text-xs md:mt-2 md:text-sm">Total</div>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:h-10 md:h-16" />
              <div className="text-center">
                <div className="text-xl font-bold text-primary sm:text-2xl md:text-5xl">{stats.available}</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:mt-1 sm:text-xs md:mt-2 md:text-sm">Disponíveis</div>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:h-10 md:h-16" />
              <div className="text-center">
                <div className="text-xl font-bold text-muted-foreground sm:text-2xl md:text-5xl">{stats.reserved}</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:mt-1 sm:text-xs md:mt-2 md:text-sm">Reservados</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container relative mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <GiftFilters
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Gift Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
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

        {filteredGifts.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
              <Gift className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Nenhum presente encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="relative border-t border-border/30 py-10 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-lg">
            <h2 className="mb-3 font-display text-xl font-bold sm:text-2xl md:mb-4 md:text-3xl">
              Gostou? Crie a sua lista!
            </h2>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base md:mb-8">
              É rápido, gratuito e seus convidados vão adorar a experiência.
            </p>
            <Button size="lg" className="h-11 w-full px-6 text-sm sm:h-12 sm:w-auto sm:px-8 sm:text-base" asChild>
              <Link to="/auth">
                Criar minha lista agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/30 py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Lista de Presentes" className="mx-auto mb-2 h-6 w-6 object-contain opacity-60" />
          <p className="text-xs text-muted-foreground sm:text-sm">
            Feito com amor para celebrar o amor
          </p>
        </div>
      </footer>
    </div>
  );
}
