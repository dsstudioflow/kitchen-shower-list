-- 1. Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'couple');

-- 2. Criar tabela de roles (separada do perfil por segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 3. Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Função SECURITY DEFINER para verificar roles (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Criar tabela de perfis de casais
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name_1 TEXT NOT NULL,
  partner_name_2 TEXT,
  event_name TEXT DEFAULT 'Chá de Cozinha',
  event_date DATE,
  share_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. Adicionar coluna profile_id na tabela gifts
ALTER TABLE public.gifts 
ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 8. Trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS PARA user_roles
-- ============================================

-- Admins podem ver todas as roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Usuários podem ver suas próprias roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Apenas admins podem inserir roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- POLÍTICAS RLS PARA profiles
-- ============================================

-- Qualquer pessoa pode ver perfis (para acessar via slug)
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Usuários podem criar seu próprio perfil
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- ============================================
-- REMOVER POLÍTICAS ANTIGAS DE gifts
-- ============================================

DROP POLICY IF EXISTS "Todos podem ver presentes" ON public.gifts;
DROP POLICY IF EXISTS "Todos podem inserir presentes" ON public.gifts;
DROP POLICY IF EXISTS "Todos podem atualizar presentes" ON public.gifts;
DROP POLICY IF EXISTS "Todos podem deletar presentes" ON public.gifts;

-- ============================================
-- NOVAS POLÍTICAS RLS PARA gifts
-- ============================================

-- Qualquer pessoa pode ver presentes (para convidados via slug)
CREATE POLICY "Anyone can view gifts"
ON public.gifts
FOR SELECT
USING (true);

-- Casais autenticados podem inserir seus próprios presentes
CREATE POLICY "Couples can insert own gifts"
ON public.gifts
FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

-- Casais autenticados podem atualizar seus próprios presentes
CREATE POLICY "Couples can update own gifts"
ON public.gifts
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid());

-- Casais autenticados podem deletar seus próprios presentes
CREATE POLICY "Couples can delete own gifts"
ON public.gifts
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- ============================================
-- ATUALIZAR POLÍTICAS DE reservations
-- ============================================

-- Manter política de visualização pública
-- Manter política de criação pública (convidados não precisam de conta)

-- Adicionar política para casais deletarem reservas dos seus presentes
CREATE POLICY "Couples can delete reservations of own gifts"
ON public.reservations
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.gifts
    WHERE gifts.id = reservations.gift_id
    AND gifts.profile_id = auth.uid()
  )
);

-- Função para atribuir role 'couple' automaticamente ao criar perfil
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'couple')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger para atribuir role automaticamente
CREATE TRIGGER on_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_profile();