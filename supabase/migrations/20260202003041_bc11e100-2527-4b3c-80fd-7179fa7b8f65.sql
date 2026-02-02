-- Tabela de presentes
CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  purchase_link TEXT,
  category TEXT NOT NULL DEFAULT 'Outros',
  is_reserved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de reservas
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  is_couple BOOLEAN NOT NULL DEFAULT false,
  spouse_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(gift_id)
);

-- Habilitar RLS
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Políticas para gifts (público pode ler, admin pode tudo - sem auth por enquanto)
CREATE POLICY "Todos podem ver presentes"
ON public.gifts FOR SELECT
USING (true);

CREATE POLICY "Todos podem inserir presentes"
ON public.gifts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Todos podem atualizar presentes"
ON public.gifts FOR UPDATE
USING (true);

CREATE POLICY "Todos podem deletar presentes"
ON public.gifts FOR DELETE
USING (true);

-- Políticas para reservations (público pode ler e criar)
CREATE POLICY "Todos podem ver reservas"
ON public.reservations FOR SELECT
USING (true);

CREATE POLICY "Todos podem criar reservas"
ON public.reservations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Todos podem deletar reservas"
ON public.reservations FOR DELETE
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_gifts_updated_at
BEFORE UPDATE ON public.gifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Bucket para imagens dos presentes
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true);

-- Políticas de storage
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-images');

CREATE POLICY "Todos podem fazer upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gift-images');

CREATE POLICY "Todos podem atualizar imagens"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gift-images');

CREATE POLICY "Todos podem deletar imagens"
ON storage.objects FOR DELETE
USING (bucket_id = 'gift-images');