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

1. **Importe o repositório** em vercel.com/new. A Vercel detecta Next.js
   sozinha: não mexa em build command, output ou install command.

2. **Defina as duas variáveis de ambiente** (Settings → Environment Variables),
   marcando os três ambientes (Production, Preview, Development):

   | Nome | Onde achar no Supabase |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → chave `anon` / `publishable` |

   Sem elas o build passa, mas toda página falha em tempo de execução.

3. **Rode `supabase/schema.sql`** no SQL Editor do Supabase, se ainda não rodou.

4. **Libere o domínio da Vercel no Supabase** (Authentication → URL
   Configuration): ponha a URL de produção em _Site URL_ e acrescente
   `https://seu-app.vercel.app/**` em _Redirect URLs_. Sem isso o login em
   produção não conclui.

5. **Deploy.** Cada push na `main` publica automaticamente.

## Segurança das chaves

As duas variáveis acima têm o prefixo `NEXT_PUBLIC_` justamente porque
**precisam** chegar ao navegador: é de lá que o usuário autentica e consulta os
próprios dados. Isso é o desenho do Supabase, não um descuido. A chave `anon`
(ou `publishable`) não dá acesso a nada por si só: quem decide o que cada
requisição enxerga é o Row Level Security, e as policies em
`supabase/schema.sql` restringem toda leitura e escrita a `auth.uid() =
user_id`.

O que **nunca** pode ir ao front-end nem ao repositório:

- a chave `service_role` (ou `secret`), que ignora RLS por completo;
- a senha do banco e a connection string do Postgres;
- qualquer token de acesso pessoal do Supabase.

Nada disso é usado neste projeto, e o app não tem nenhuma variável de servidor:
não há `.env` versionado, e `.gitignore` cobre `.env` e `.env*.local`. Se algum
dia precisar de um segredo de servidor, declare-o **sem** o prefixo
`NEXT_PUBLIC_` e use-o apenas em Server Actions ou Route Handlers.

Duas conferências que valem antes de publicar:

- RLS **ativo** na tabela `transactions` (Supabase → Table Editor → o cadeado
  deve estar fechado). Sem RLS, a chave pública expõe a tabela inteira.
- Confirmação de e-mail ligada em produção (Authentication → Providers →
  Email), para não aceitar cadastro em endereço alheio.

## Validação feita

`npm run build` compila sem erros de tipo ou lint. A lógica de dados fica em
`src/lib/transactions.ts` e a validação de formulário em
`src/app/dashboard/actions.ts` (valor positivo, data no formato correto,
categoria coerente com o tipo), além do RLS e dos `CHECK` no banco. As Server
Actions revalidam a sessão a cada chamada e filtram todo update e delete por
`user_id`, de modo que um id adivinhado não alcança o dado de outra pessoa.
