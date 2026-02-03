import { Gift, ExternalLink, Check, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GiftWithReservation } from '@/types/gift';

interface GiftCardProps {
  gift: GiftWithReservation;
  onReserve: (gift: GiftWithReservation) => void;
}

const categoryColors: Record<string, string> = {
  'Cozinha': 'bg-primary/15 text-primary border-primary/20',
  'Eletrodomésticos': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Decoração': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'Mesa e Bar': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Utilidades': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Outros': 'bg-muted text-muted-foreground border-border',
};

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  return (
    <Card className={`group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 ${
      gift.is_reserved 
        ? 'opacity-60' 
        : 'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1'
    }`}>
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        {gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Gift className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <Badge 
            variant="outline" 
            className={`border backdrop-blur-sm ${categoryColors[gift.category] || categoryColors['Outros']}`}
          >
            {gift.category}
          </Badge>
        </div>
        {gift.is_reserved && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/20 p-3">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Reservado</span>
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
          {gift.name}
        </h3>
        {gift.description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {gift.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-3 p-5 pt-0">
        {gift.purchase_link && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border/50 hover:border-primary/30 hover:bg-primary/5"
            asChild
          >
            <a href={gift.purchase_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver produto
            </a>
          </Button>
        )}
        <Button
          size="sm"
          className={`flex-1 ${
            gift.is_reserved 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
          }`}
          disabled={gift.is_reserved}
          onClick={() => onReserve(gift)}
        >
          {gift.is_reserved ? (
            'Indisponível'
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Vou presentear
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
