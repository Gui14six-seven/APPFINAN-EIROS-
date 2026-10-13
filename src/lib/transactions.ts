import type { SupabaseClient } from "@supabase/supabase-js";
import { monthRange } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

export type Filters = {
  year: number;
  month: number; // 1-12, ou 0 para "todo o ano"
  category: string; // "all" ou nome da categoria
  q: string;
};

export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const now = new Date();
  const toInt = (value: string | string[] | undefined, fallback: number) => {
    const n = Number(Array.isArray(value) ? value[0] : value);
    return Number.isInteger(n) ? n : fallback;
  };

  const year = toInt(params.year, now.getFullYear());
  const month = toInt(params.month, now.getMonth() + 1);
  const category = String(
    (Array.isArray(params.category) ? params.category[0] : params.category) ??
      "all",
  );
  const q = String((Array.isArray(params.q) ? params.q[0] : params.q) ?? "");

  return {
    year: year >= 2000 && year <= 2100 ? year : now.getFullYear(),
    month: month >= 0 && month <= 12 ? month : now.getMonth() + 1,
    category,
    q: q.slice(0, 80),
  };
}

export async function fetchTransactions(
  supabase: SupabaseClient,
  userId: string,
  filters: Filters,
): Promise<Transaction[]> {
  const { from, to } =
    filters.month === 0
      ? { from: `${filters.year}-01-01`, to: `${filters.year}-12-31` }
      : monthRange(filters.year, filters.month);

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.q.trim()) {
    // Escapa os curingas do LIKE para que a busca seja literal.
    const term = filters.q.trim().replace(/[%_\\]/g, (c) => `\\${c}`);
    query = query.ilike("description", `%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  })) as Transaction[];
}

export function summarize(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }

  return { income, expense, balance: income - expense };
}

/** Total de despesas por categoria, da maior para a menor. */
export function expensesByCategory(transactions: Transaction[]) {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }

  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
