export type GiftCategory = 
  | 'Cozinha' 
  | 'Eletrodomésticos' 
  | 'Decoração' 
  | 'Mesa e Bar' 
  | 'Utilidades' 
  | 'Outros';

export const GIFT_CATEGORIES: GiftCategory[] = [
  'Cozinha',
  'Eletrodomésticos',
  'Decoração',
  'Mesa e Bar',
  'Utilidades',
  'Outros',
];

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  purchase_link: string | null;
  category: GiftCategory;
  price: number | null;
  is_reserved: boolean;
  created_at: string;
  updated_at: string;
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export interface Reservation {
  id: string;
  gift_id: string;
  guest_name: string;
  guest_email: string;
  is_couple: boolean;
  spouse_name: string | null;
  created_at: string;
}

export interface GiftWithReservation extends Gift {
  reservation?: Reservation;
}
