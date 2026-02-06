import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Gift, GiftWithReservation, Reservation, GiftCategory } from '@/types/gift';

// Hook para buscar presentes do casal autenticado
export function useGifts(profileId?: string) {
  return useQuery({
    queryKey: ['gifts', profileId],
    queryFn: async (): Promise<GiftWithReservation[]> => {
      let query = supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileId) {
        query = query.eq('profile_id', profileId);
      }

      const { data: gifts, error: giftsError } = await query;

      if (giftsError) throw giftsError;

      const giftIds = (gifts || []).map(g => g.id);
      
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .in('gift_id', giftIds.length > 0 ? giftIds : ['']);

      if (reservationsError) throw reservationsError;

      return (gifts || []).map((gift) => ({
        ...gift,
        category: gift.category as GiftCategory,
        reservation: reservations?.find((r) => r.gift_id === gift.id),
      }));
    },
    enabled: profileId !== undefined,
  });
}

// Hook para buscar presentes via slug (para convidados)
export function useGiftsBySlug(slug?: string) {
  return useQuery({
    queryKey: ['gifts-by-slug', slug],
    queryFn: async (): Promise<GiftWithReservation[]> => {
      if (!slug) return [];

      // Primeiro busca o perfil pelo slug
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('share_slug', slug)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return [];

      // Depois busca os presentes do perfil
      const { data: gifts, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (giftsError) throw giftsError;

      const giftIds = (gifts || []).map(g => g.id);
      
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('*')
        .in('gift_id', giftIds.length > 0 ? giftIds : ['']);

      if (reservationsError) throw reservationsError;

      return (gifts || []).map((gift) => ({
        ...gift,
        category: gift.category as GiftCategory,
        reservation: reservations?.find((r) => r.gift_id === gift.id),
      }));
    },
    enabled: !!slug,
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
      // Invalidate both query keys to update admin and public views
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      queryClient.invalidateQueries({ queryKey: ['gifts-by-slug'] });
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
      // Invalidate both query keys to update admin and public views
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      queryClient.invalidateQueries({ queryKey: ['gifts-by-slug'] });
    },
  });
}
