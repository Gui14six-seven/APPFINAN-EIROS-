# FinançasPessoaisAPP

Web app de gestão financeira pessoal: registre receitas e despesas, categorize,
acompanhe o saldo mensal em um dashboard visual e exporte as transações em CSV.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · componentes
shadcn/ui · Recharts · Supabase (PostgreSQL + Auth + RLS) · Vercel.

## Como rodar

1. **Crie o projeto no Supabase** (supabase.com) e rode `supabase/schema.sql`
   no SQL Editor. Ele cria a tabela `transactions`, os índices e as policies de
   Row Level Security — cada usuário só acessa os próprios lançamentos.

2. **Configure as variáveis de ambiente.** Copie `.env.example` para
   `.env.local` e preencha com os dados de _Project Settings → API_:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   ```

3. **Instale e suba o servidor:**

   ```bash
   npm install
   npm run dev
   ```

   Abra http://localhost:3000, crie uma conta em `/cadastro` e comece a lançar.

> Se a confirmação de e-mail estiver ativa no Supabase (_Authentication →
> Providers → Email_), o cadastro pede confirmação antes do primeiro acesso.
> Para testar mais rápido em desenvolvimento, desative essa opção.

## Funcionalidades

- **Autenticação** por e-mail/senha (Supabase Auth). Rotas `/dashboard`
  protegidas no middleware; sessão renovada via cookies.
- **Dashboard** com cards de receitas, despesas e saldo do período.
- **Gráfico de rosca** de despesas por categoria, com legenda e valores
  (paleta categórica validada para contraste e daltonismo).
- **CRUD de transações**: descrição, valor, data, tipo e categoria, em diálogo.
- **Categorias pré-definidas**, filtradas pelo tipo do lançamento.
- **Filtros** por mês/ano e categoria + busca por descrição (com debounce),
  tudo refletido na URL — o estado é compartilhável.
- **Exportar CSV** das transações filtradas, no formato que o Excel pt-BR abre
  direto (BOM + separador `;`).
- **Responsivo**: tabela no desktop, lista de cards no mobile.
- **Landing page** pública com chamada para cadastro.

## Estrutura

```
src/
  app/
    (auth)/           login, cadastro e server actions de autenticação
    dashboard/        layout protegido, página e actions de CRUD
    page.tsx          landing page
  components/
    ui/               primitivos shadcn/ui (button, card, input, select, dialog…)
    category-chart    gráfico de despesas por categoria (Recharts)
    filters-bar       filtros de período/categoria e busca
    transaction-*     diálogo de criação/edição e tabela
    export-csv-button exportação client-side
  lib/
    supabase/         clients browser/server e renovação de sessão
    transactions.ts   query com filtros, resumo e agregação por categoria
    types.ts          tipos e categorias
    utils.ts          formatação (BRL, datas) e helpers de período
supabase/schema.sql   tabela + RLS
```

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe na Vercel, defina `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente do projeto.
3. Em _Supabase → Authentication → URL Configuration_, adicione o domínio da
   Vercel como Site URL / Redirect URL.

## Validação feita

`npm run build` compila sem erros de tipo ou lint. A lógica de dados fica em
`src/lib/transactions.ts` e a validação de formulário em
`src/app/dashboard/actions.ts` (valor positivo, data no formato correto,
categoria coerente com o tipo) — além do RLS e dos `CHECK` no banco.
