import { Gift, ExternalLink, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type GiftWithReservation, formatPrice } from '@/types/gift';

interface GiftCardProps {
  gift: GiftWithReservation;
  onReserve: (gift: GiftWithReservation) => void;
}

const categoryColors: Record<string, string> = {
  'Cozinha': 'bg-primary/20 text-primary border-primary/30',
  'Eletrodomésticos': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Decoração': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'Mesa e Bar': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Utilidades': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Outros': 'bg-muted text-muted-foreground border-border',
};

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-500 ${
      gift.is_reserved 
        ? 'opacity-50' 
        : 'hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2'
    }`}>
      {/* Glow effect on hover */}
      {!gift.is_reserved && (
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
      
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
        {gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-2xl bg-muted/50 p-6">
              <Gift className="h-12 w-12 text-muted-foreground/30" />
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Category badge */}
        <div className="absolute left-4 top-4">
          <Badge 
            variant="outline" 
            className={`border backdrop-blur-md text-xs font-medium ${categoryColors[gift.category] || categoryColors['Outros']}`}
          >
            {gift.category}
          </Badge>
        </div>
        
        {/* Reserved overlay */}
        {gift.is_reserved && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/20 p-4 ring-4 ring-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Reservado
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {gift.name}
          </h3>
          {gift.price !== null && gift.price > 0 && (
            <span className="shrink-0 text-lg font-bold text-primary">
              {formatPrice(gift.price)}
            </span>
          )}
        </div>
        {gift.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {gift.description}
          </p>
        )}
        
        <div className="flex gap-3">
          {gift.purchase_link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border/50 bg-transparent hover:border-primary/40 hover:bg-primary/5"
              asChild
            >
              <a href={gift.purchase_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver
              </a>
            </Button>
          )}
          <Button
            size="sm"
            className={`flex-1 transition-all duration-300 ${
              gift.is_reserved 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
            }`}
            disabled={gift.is_reserved}
            onClick={() => onReserve(gift)}
          >
            {gift.is_reserved ? (
              'Indisponível'
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Presentear
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
