import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  partner_name_1: string;
  partner_name_2: string | null;
  event_name: string;
  event_date: string | null;
  share_slug: string;
  created_at: string;
  updated_at: string;
}

function generateSlug(name1: string, name2?: string): string {
  const base = name2 
    ? `${name1}-e-${name2}`.toLowerCase()
    : name1.toLowerCase();
  const normalized = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${normalized}-${random}`;
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useProfileBySlug(slug?: string) {
  return useQuery({
    queryKey: ['profile-by-slug', slug],
    queryFn: async (): Promise<Profile | null> => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('share_slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: {
      id: string;
      partner_name_1: string;
      partner_name_2?: string;
      event_name?: string;
      event_date?: string;
    }) => {
      const slug = generateSlug(profile.partner_name_1, profile.partner_name_2);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: profile.id,
          partner_name_1: profile.partner_name_1,
          partner_name_2: profile.partner_name_2 || null,
          event_name: profile.event_name || 'Chá de Cozinha',
          event_date: profile.event_date || null,
          share_slug: slug,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['profile-by-slug', data.share_slug] });
    },
  });
}
