import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finanças Pessoais — controle simples e visual",
  description:
    "Registre receitas e despesas, acompanhe seu saldo mensal e exporte relatórios.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
