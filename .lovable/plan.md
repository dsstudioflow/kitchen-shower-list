

# Chá de Cozinha - Plano do Projeto

## Visão Geral
Aplicação web responsiva e elegante para organização de Chá de Cozinha, permitindo que convidados escolham presentes de uma lista pré-definida pelo casal, evitando duplicidades.

---

## 🎨 Design & Experiência

**Estilo Visual**
- Design moderno e minimalista com cores neutras (tons de cinza, branco, com acentos sutis)
- Tipografia limpa e espaçamento generoso
- Cards elegantes com sombras suaves
- Mobile-first com responsividade total

---

## 📱 Área do Convidado (Pública)

**Página Inicial**
- Mensagem de boas-vindas do casal (personalizável)
- Lista de presentes organizada por categorias
- Filtro por categoria e busca por nome
- Indicação visual clara: disponível ✓ ou reservado ✗

**Card do Presente**
- Imagem do item (upload pelo casal)
- Nome e descrição
- Categoria (badge colorido)
- Botão para acessar link de compra
- Botão "Vou presentear" (apenas para disponíveis)

**Fluxo de Reserva**
- Modal elegante com formulário simples
- Campos: Nome, E-mail
- Opção: "Presentear sozinho" ou "Presentear como casal" (campo extra para cônjuge)
- Confirmação com mensagem de agradecimento
- Item imediatamente bloqueado após confirmação

---

## 👩‍❤️‍👨 Área Administrativa (Casal)

**Dashboard**
- Métricas visuais: total de itens, reservados, disponíveis
- Gráfico de progresso (barra ou pizza)
- Lista rápida dos últimos presentes reservados

**Gestão de Presentes**
- Listagem com filtros e busca
- Para cada item:
  - Nome, descrição, link de compra
  - Upload de imagem
  - Categoria (Cozinha, Eletrodomésticos, Decoração, Mesa e Bar, Utilidades, Outros)
  - Status (disponível/reservado)
- Ações: Adicionar, Editar, Remover
- Opção para liberar item reservado (se convidado desistir)

**Visualização de Reservas**
- Ver quem escolheu cada item
- Nome do convidado e e-mail
- Se é presente individual ou de casal
- Data da reserva

---

## 🔧 Funcionalidades Técnicas (MVP)

**Banco de Dados (Supabase)**
- Tabela de presentes (itens, categorias, status)
- Tabela de reservas (dados do convidado, vínculo com presente)
- Storage para imagens dos itens
- Controle de concorrência para evitar duplicidade

**Preparação para o Futuro**
- Arquitetura pronta para autenticação
- Rotas separadas: `/admin` (casal) e `/` (convidados)
- Código modular e organizado

---

## ⏳ O que fica para depois

- **Autenticação**: login do casal (quando você solicitar)
- **Notificações por e-mail**: alertas quando presente for reservado
- **Histórico e relatórios**: pós-evento

---

## 📂 Estrutura de Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com lista de presentes |
| `/presente/:id` | Detalhes do presente e formulário de reserva |
| `/admin` | Dashboard do casal |
| `/admin/presentes` | Gestão completa dos itens |
| `/admin/reservas` | Visualização de todas as reservas |

