import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/app/dashboard/actions";
import type { Transaction } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TransactionDialog } from "@/components/transaction-dialog";

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteTransaction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Excluir transação"
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 />
      </Button>
    </form>
  );
}

function Amount({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        isIncome ? "text-success" : "text-destructive",
      )}
    >
      {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
    </span>
  );
}

export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (!transactions.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada com esses filtros.
      </p>
    );
  }

  return (
    <>
      {/* Mobile: lista de cards */}
      <ul className="divide-y md:hidden">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(transaction.date)} · {transaction.category}
              </p>
              <Amount transaction={transaction} />
            </div>
            <TransactionDialog transaction={transaction} />
            <DeleteButton id={transaction.id} />
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 font-medium">Data</th>
              <th className="py-2 font-medium">Descrição</th>
              <th className="py-2 font-medium">Categoria</th>
              <th className="py-2 text-right font-medium">Valor</th>
              <th className="py-2 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-3 tabular-nums text-muted-foreground">
                  {formatDate(transaction.date)}
                </td>
                <td className="max-w-[18rem] truncate py-3 font-medium">
                  {transaction.description}
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {transaction.category}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Amount transaction={transaction} />
                </td>
                <td className="py-3">
                  <div className="flex justify-end">
                    <TransactionDialog transaction={transaction} />
                    <DeleteButton id={transaction.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
