export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string; // yyyy-MM-dd
  type: TransactionType;
  category: string;
  created_at: string;
};

export type TransactionInput = {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
};

export const INCOME_CATEGORIES = ["Salário", "Freelance", "Outros"] as const;

export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
] as const;

export const ALL_CATEGORIES = Array.from(
  new Set<string>([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]),
);

export function categoriesFor(type: TransactionType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
