import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GIFT_CATEGORIES, type GiftCategory } from '@/types/gift';
import { cn } from '@/lib/utils';

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
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar presente..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-14 rounded-2xl border-border/50 bg-card/60 pl-12 text-base backdrop-blur-sm transition-all focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
            selectedCategory === null
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
              : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
          )}
        >
          Todos
        </button>
        {GIFT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
