"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

/**
 * Paleta categórica validada (OKLab/CVD) nas duas superfícies: os valores de
 * cada tema vivem em globals.css, então o gráfico acompanha o tema sem
 * re-renderizar. A ordem dos slots é o mecanismo de segurança para daltonismo:
 * não embaralhe nem gere cores extras, e a 8ª categoria em diante cai em
 * "Outros".
 */
const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

export type CategorySlice = { category: string; total: number };

export function CategoryChart({ data }: { data: CategorySlice[] }) {
  const total = data.reduce((sum, d) => sum + d.total, 0);

  if (!data.length || total <= 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        Sem despesas no período selecionado.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="h-[220px] w-full sm:w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={2}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            >
              {data.map((slice, index) => (
                <Cell
                  key={slice.category}
                  fill={PALETTE[index % PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda com valores: identidade nunca depende só da cor. */}
      <ul className="flex-1 space-y-2">
        {data.map((slice, index) => (
          <li
            key={slice.category}
            className="flex items-center gap-3 text-sm"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: PALETTE[index % PALETTE.length] }}
            />
            <span className="flex-1 truncate text-foreground">
              {slice.category}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round((slice.total / total) * 100)}%
            </span>
            <span className="w-24 text-right font-medium tabular-nums">
              {formatCurrency(slice.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
