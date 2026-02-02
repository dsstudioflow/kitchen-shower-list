import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Gift, GiftWithReservation, Reservation, GiftCategory } from '@/types/gift';

export function useGifts() {
  return useQuery({
    queryKey: ['gifts'],
    queryFn: async (): Promise<GiftWithReservation[]> => {
      const { data: gifts, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });

      if (giftsError) throw giftsError;

      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*');

      if (reservationsError) throw reservationsError;

      return (gifts || []).map((gift) => ({
        ...gift,
        category: gift.category as GiftCategory,
        reservation: reservations?.find((r) => r.gift_id === gift.id),
      }));
    },
  });
}

export function useCreateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gift: Omit<Gift, 'id' | 'created_at' | 'updated_at' | 'is_reserved'>) => {
      const { data, error } = await supabase
        .from('gifts')
        .insert(gift)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export function useUpdateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...gift }: Partial<Gift> & { id: string }) => {
      const { data, error } = await supabase
        .from('gifts')
        .update(gift)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export function useDeleteGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export function useReserveGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id' | 'created_at'>) => {
      // First, update the gift as reserved
      const { error: updateError } = await supabase
        .from('gifts')
        .update({ is_reserved: true })
        .eq('id', reservation.gift_id);

      if (updateError) throw updateError;

      // Then create the reservation
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();

      if (error) {
        // Rollback if reservation fails
        await supabase
          .from('gifts')
          .update({ is_reserved: false })
          .eq('id', reservation.gift_id);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export function useReleaseGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftId: string) => {
      // Delete the reservation
      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('gift_id', giftId);

      if (deleteError) throw deleteError;

      // Update the gift as not reserved
      const { error: updateError } = await supabase
        .from('gifts')
        .update({ is_reserved: false })
        .eq('id', giftId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}
