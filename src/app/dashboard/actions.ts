"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categoriesFor, type TransactionType } from "@/lib/types";

export type TransactionFormState = { error?: string; ok?: boolean };

/** Aceita "1.234,56" e "1234.56". */
function parseAmount(raw: string) {
  const normalized = raw.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

function parseForm(formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();
  const amount = parseAmount(String(formData.get("amount") ?? ""));
  const date = String(formData.get("date") ?? "");
  const type = String(formData.get("type") ?? "") as TransactionType;
  const category = String(formData.get("category") ?? "");

  if (!description || description.length > 120) {
    return { error: "Descrição obrigatória (até 120 caracteres)." } as const;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Informe um valor maior que zero." } as const;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Informe uma data válida." } as const;
  }
  if (type !== "income" && type !== "expense") {
    return { error: "Selecione o tipo da transação." } as const;
  }
  if (!categoriesFor(type).includes(category)) {
    return { error: "Selecione uma categoria válida para esse tipo." } as const;
  }

  return {
    data: {
      description,
      amount: Math.round(amount * 100) / 100,
      date,
      type,
      category,
    },
  } as const;
}

export async function createTransaction(
  _prev: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("transactions")
    .insert({ ...parsed.data, user_id: user.id });

  if (error) return { error: "Não foi possível salvar a transação." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTransaction(
  _prev: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Transação não encontrada." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Entre novamente." };

  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Não foi possível atualizar a transação." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTransaction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}
