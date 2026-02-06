-- Criar função SECURITY DEFINER para atualizar is_reserved
CREATE OR REPLACE FUNCTION public.set_gift_reserved(gift_id uuid, reserved boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.gifts
  SET is_reserved = reserved
  WHERE id = gift_id;
END;
$$;

-- Corrigir os dados existentes - marcar presentes com reservas como reservados
UPDATE public.gifts g
SET is_reserved = true
WHERE EXISTS (
  SELECT 1 FROM public.reservations r WHERE r.gift_id = g.id
);

-- Garantir que presentes sem reserva estejam como não reservados
UPDATE public.gifts g
SET is_reserved = false
WHERE NOT EXISTS (
  SELECT 1 FROM public.reservations r WHERE r.gift_id = g.id
);