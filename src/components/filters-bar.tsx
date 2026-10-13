"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CATEGORIES } from "@/lib/types";
import { MONTHS } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 4 + i);

export function FiltersBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const month = params.get("month") ?? String(new Date().getMonth() + 1);
  const year = params.get("year") ?? String(CURRENT_YEAR);
  const category = params.get("category") ?? "all";
  const [search, setSearch] = useState(params.get("q") ?? "");

  function push(next: Record<string, string>) {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all") query.delete(key);
      else query.set(key, value);
    }
    startTransition(() => router.push(`/dashboard?${query.toString()}`));
  }

  // Busca com debounce para não navegar a cada tecla.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (search === current) return;

    const timer = setTimeout(() => push({ q: search }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      data-pending={isPending ? "" : undefined}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por descrição"
          className="pl-9"
          aria-label="Buscar por descrição"
        />
      </div>

      <Select value={month} onValueChange={(value) => push({ month: value })}>
        <SelectTrigger aria-label="Mês">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Todo o ano</SelectItem>
          {MONTHS.map((name, index) => (
            <SelectItem key={name} value={String(index + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={(value) => push({ year: value })}>
        <SelectTrigger aria-label="Ano">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={category}
        onValueChange={(value) => push({ category: value })}
      >
        <SelectTrigger aria-label="Categoria">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {ALL_CATEGORIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
