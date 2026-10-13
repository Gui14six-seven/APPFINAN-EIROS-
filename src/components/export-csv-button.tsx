"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Evita injeção de fórmula ao abrir o CSV no Excel/Sheets. */
function escapeCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function toCsv(transactions: Transaction[]) {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type === "income" ? "Receita" : "Despesa",
    t.amount.toFixed(2).replace(".", ","),
  ]);

  // Ponto e vírgula + BOM: o padrão que Excel pt-BR abre corretamente.
  return (
    "﻿" +
    [header, ...rows].map((row) => row.map(escapeCell).join(";")).join("\r\n")
  );
}

export function ExportCsvButton({
  transactions,
  filename,
}: {
  transactions: Transaction[];
  filename: string;
}) {
  function handleExport() {
    const blob = new Blob([toCsv(transactions)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={!transactions.length}
    >
      <Download />
      Exportar CSV
    </Button>
  );
}
