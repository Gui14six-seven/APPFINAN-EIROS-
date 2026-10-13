"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesFor, type Transaction, type TransactionType } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/app/dashboard/actions";

export function TransactionDialog({
  transaction,
}: {
  transaction?: Transaction;
}) {
  const isEdit = Boolean(transaction);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "expense",
  );
  const [category, setCategory] = useState(transaction?.category ?? "");

  const [state, action, pending] = useActionState<TransactionFormState, FormData>(
    isEdit ? updateTransaction : createTransaction,
    {},
  );

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  // Ao reabrir, volta ao estado original (ou limpo, na criação).
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setType(transaction?.type ?? "expense");
      setCategory(transaction?.category ?? "");
    }
  }

  const options = categoriesFor(type);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" aria-label="Editar transação">
            <Pencil />
          </Button>
        ) : (
          <Button>
            <Plus />
            Nova transação
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Informe os dados do lançamento. Valores sempre positivos: o tipo
            define se entra ou sai.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          {isEdit ? (
            <input type="hidden" name="id" value={transaction!.id} />
          ) : null}
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="category" value={category} />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              defaultValue={transaction?.description}
              placeholder="Ex.: Mercado da semana"
              maxLength={120}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                defaultValue={transaction?.amount}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={transaction?.date ?? todayISO()}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as TransactionType);
                  setCategory(""); // categorias mudam com o tipo
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
