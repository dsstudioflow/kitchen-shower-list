import { Gift, ExternalLink, Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GiftWithReservation } from '@/types/gift';

interface GiftCardProps {
  gift: GiftWithReservation;
  onReserve: (gift: GiftWithReservation) => void;
}

const categoryColors: Record<string, string> = {
  'Cozinha': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Eletrodomésticos': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Decoração': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'Mesa e Bar': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Utilidades': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Outros': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${gift.is_reserved ? 'opacity-75' : 'hover:shadow-lg'}`}>
      <div className="relative aspect-square bg-muted">
        {gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gift className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge className={categoryColors[gift.category] || categoryColors['Outros']}>
            {gift.category}
          </Badge>
        </div>
        {gift.is_reserved && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="rounded-full bg-muted p-3">
              <Check className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 font-semibold text-foreground">{gift.name}</h3>
        {gift.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{gift.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {gift.purchase_link && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={gift.purchase_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              Ver produto
            </a>
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1"
          disabled={gift.is_reserved}
          onClick={() => onReserve(gift)}
        >
          {gift.is_reserved ? (
            <>
              <X className="mr-1 h-4 w-4" />
              Reservado
            </>
          ) : (
            'Vou presentear'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
