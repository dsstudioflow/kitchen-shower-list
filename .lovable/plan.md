
# Plano: Corrigir Erro 404 na Vercel para Rotas Dinamicas

## O Problema

Quando voce acessa diretamente uma rota como `/lista/ana-e-joao-1234` na Vercel, o servidor retorna 404. Isso acontece porque:

1. A Vercel procura um arquivo fisico nesse caminho
2. Como nao existe, retorna 404
3. O React Router nunca tem a chance de processar a rota

Este e um problema comum em Single Page Applications (SPAs) com roteamento client-side.

## A Solucao

Criar um arquivo de configuracao da Vercel (`vercel.json`) que redireciona todas as requisicoes para o `index.html`, permitindo que o React Router processe as rotas.

## Implementacao

### Criar arquivo `vercel.json` na raiz do projeto

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esta configuracao diz a Vercel:
- Para qualquer rota acessada (incluindo `/lista/:slug`)
- Sirva o arquivo `index.html`
- O React Router entao processa a URL e renderiza o componente correto

## Por que isso funciona?

```text
Sem vercel.json:
Usuario -> /lista/abc -> Vercel procura arquivo -> Nao encontra -> 404

Com vercel.json:
Usuario -> /lista/abc -> Vercel serve index.html -> React Router -> GuestList.tsx
```

## Passos apos implementacao

1. Fazer commit do arquivo `vercel.json`
2. Push para o GitHub
3. A Vercel vai fazer deploy automaticamente
4. Testar acessando diretamente a URL `/lista/seu-slug`
