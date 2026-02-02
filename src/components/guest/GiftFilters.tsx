import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GIFT_CATEGORIES, type GiftCategory } from '@/types/gift';

interface GiftFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedCategory: GiftCategory | null;
  onCategoryChange: (category: GiftCategory | null) => void;
}

export function GiftFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: GiftFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar presente..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          Todos
        </Button>
        {GIFT_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
