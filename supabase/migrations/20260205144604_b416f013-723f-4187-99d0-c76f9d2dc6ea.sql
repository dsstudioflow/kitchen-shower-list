-- Corrigir política de DELETE em reservations para ser mais segura
-- Remover a política antiga que permite DELETE para todos
DROP POLICY IF EXISTS "Todos podem deletar reservas" ON public.reservations;

-- Agora apenas casais autenticados podem deletar reservas dos seus presentes
-- (política já criada na migration anterior)