"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

/**
 * Script injetado antes da primeira pintura: aplica o tema salvo (ou o do
 * sistema) ainda no HTML, para a página não piscar clara antes de escurecer.
 */
export const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (prefersDark ? "dark" : "light");
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Só depois de montar sabemos o tema real (o script acima já o aplicou),
  // então o ícone nunca é renderizado com o valor errado no servidor.
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Modo privativo ou storage bloqueado: o tema vale só para esta visita.
    }
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      {/* Antes de montar, nenhum ícone: evita trocar de ícone na hidratação. */}
      {theme === null ? (
        <span className="h-4 w-4" />
      ) : isDark ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </Button>
  );
}
