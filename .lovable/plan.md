
# Plano: Sistema Multi-Tenant de Listas de Presentes

## Visao Geral

Transformar a aplicacao de uma unica lista para um sistema onde multiplos casais podem criar suas proprias listas de presentes isoladas, cada uma com um link unico de compartilhamento.

## Fluxo de Usuario

```text
+------------------+     +-------------------+     +--------------------+
|  Casal acessa    | --> |  Cadastro/Login   | --> |  Painel do Casal   |
|  a plataforma    |     |  com email/senha  |     |  (gerencia lista)  |
+------------------+     +-------------------+     +--------------------+
                                                            |
                                                            v
                                                   +--------------------+
                                                   |  Gera link unico   |
                                                   |  /lista/abc123     |
                                                   +--------------------+
                                                            |
                                                            v
                                                   +--------------------+
                                                   |  Convidado acessa  |
                                                   |  link e ve apenas  |
                                                   |  a lista do casal  |
                                                   +--------------------+
```

## Alteracoes no Banco de Dados

### 1. Tabela de perfis de casais (profiles)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name_1 TEXT NOT NULL,
  partner_name_2 TEXT,
  event_name TEXT DEFAULT 'Cha de Cozinha',
  event_date DATE,
  share_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

O `share_slug` sera o identificador unico do link (ex: `/lista/ana-e-joao-2026`).

### 2. Vincular presentes aos casais

Adicionar coluna `profile_id` na tabela `gifts`:

```sql
ALTER TABLE public.gifts 
ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
```

### 3. Atualizar politicas RLS

**Para `gifts`:**
- Casais autenticados podem CRUD apenas seus proprios presentes
- Visitantes podem VER presentes de qualquer lista (via slug publico)

**Para `reservations`:**
- Qualquer pessoa pode criar reserva (convidado nao precisa de conta)
- Casais podem ver/deletar reservas dos seus presentes

### 4. Sistema de roles (seguranca)

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'couple');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
```

## Novas Rotas da Aplicacao

| Rota | Descricao | Acesso |
|------|-----------|--------|
| `/` | Landing page da plataforma | Publico |
| `/auth` | Login/Cadastro de casais | Publico |
| `/dashboard` | Painel do casal logado | Autenticado |
| `/dashboard/presentes` | Gerenciar presentes | Autenticado |
| `/dashboard/reservas` | Ver reservas | Autenticado |
| `/dashboard/configuracoes` | Configurar evento e link | Autenticado |
| `/lista/:slug` | Lista publica para convidados | Publico |

## Componentes e Paginas a Criar/Modificar

### Novos Arquivos

1. **`src/pages/Auth.tsx`** - Pagina de login/cadastro
2. **`src/pages/Landing.tsx`** - Pagina inicial da plataforma
3. **`src/pages/dashboard/*`** - Refatorar admin para dashboard do casal
4. **`src/pages/GuestList.tsx`** - Lista publica (substitui Index atual)
5. **`src/hooks/useAuth.ts`** - Hook de autenticacao
6. **`src/hooks/useProfile.ts`** - Hook para perfil do casal
7. **`src/contexts/AuthContext.tsx`** - Contexto de autenticacao
8. **`src/components/dashboard/ShareLinkCard.tsx`** - Componente para copiar link

### Modificacoes

1. **`src/App.tsx`** - Novas rotas e protecao de rotas
2. **`src/hooks/useGifts.ts`** - Filtrar por `profile_id` ou `slug`
3. **`src/components/admin/*`** - Renomear para dashboard e adicionar contexto de perfil

## Detalhes Tecnicos

### Hook de Autenticacao

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
```

### Geracao de Slug Unico

```typescript
function generateSlug(name1: string, name2?: string): string {
  const base = name2 
    ? `${name1}-e-${name2}`.toLowerCase()
    : name1.toLowerCase();
  const normalized = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-');
  const random = Math.random().toString(36).substring(2, 6);
  return `${normalized}-${random}`;
}
```

### Queries Atualizadas

**Para o casal (autenticado):**
```typescript
const { data } = await supabase
  .from('gifts')
  .select('*')
  .eq('profile_id', profile.id);
```

**Para convidados (via slug):**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('id')
  .eq('share_slug', slug)
  .single();

const { data: gifts } = await supabase
  .from('gifts')
  .select('*')
  .eq('profile_id', profile.id);
```

## Ordem de Implementacao

1. Criar migrations do banco (profiles, user_roles, alteracao em gifts)
2. Atualizar politicas RLS com seguranca adequada
3. Implementar sistema de autenticacao (Auth.tsx, useAuth, AuthContext)
4. Criar pagina de onboarding para novos casais (criar perfil)
5. Refatorar area admin para dashboard do casal
6. Criar componente de compartilhamento de link
7. Criar rota publica `/lista/:slug` para convidados
8. Atualizar navbar flutuante para mostrar apenas para casais logados
9. Criar landing page atrativa

## Consideracoes de Seguranca

- Roles armazenadas em tabela separada (nao no perfil)
- RLS baseada em `auth.uid()` para operacoes de escrita
- Slugs unicos para evitar colisao
- Validacao de email no cadastro (opcional: confirmar email)
- Funcao `has_role` com SECURITY DEFINER para evitar recursao RLS

