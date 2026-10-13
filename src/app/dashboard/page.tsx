import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryChart } from "@/components/category-chart";
import { ExportCsvButton } from "@/components/export-csv-button";
import { FiltersBar } from "@/components/filters-bar";
import { TransactionDialog } from "@/components/transaction-dialog";
import { TransactionsTable } from "@/components/transactions-table";
import { createClient } from "@/lib/supabase/server";
import {
  expensesByCategory,
  fetchTransactions,
  parseFilters,
  summarize,
} from "@/lib/transactions";
import { cn, formatCurrency, MONTHS } from "@/lib/utils";

export const metadata = { title: "Dashboard — Finanças Pessoais" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const transactions = await fetchTransactions(supabase, user.id, filters);
  const { income, expense, balance } = summarize(transactions);
  const byCategory = expensesByCategory(transactions);

  const periodLabel =
    filters.month === 0
      ? String(filters.year)
      : `${MONTHS[filters.month - 1]} de ${filters.year}`;

  const csvName = `transacoes-${filters.year}-${String(filters.month).padStart(2, "0")}.csv`;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{periodLabel}</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton transactions={transactions} filename={csvName} />
          <TransactionDialog />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Receitas"
          value={income}
          icon={<ArrowUpCircle className="h-4 w-4 text-success" />}
          valueClass="text-success"
        />
        <SummaryCard
          label="Despesas"
          value={expense}
          icon={<ArrowDownCircle className="h-4 w-4 text-destructive" />}
          valueClass="text-destructive"
        />
        <SummaryCard
          label="Saldo"
          value={balance}
          icon={<Scale className="h-4 w-4 text-muted-foreground" />}
          valueClass={balance < 0 ? "text-destructive" : "text-foreground"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>
            Ajuste período, categoria ou busque por descrição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-10" />}>
            <FiltersBar />
          </Suspense>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Despesas por categoria</CardTitle>
            <CardDescription>{periodLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={byCategory} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Transações</CardTitle>
            <CardDescription>
              {transactions.length === 1
                ? "1 lançamento"
                : `${transactions.length} lançamentos`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsTable transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className={cn("text-2xl font-bold tabular-nums", valueClass)}>
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}
