import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Download,
  ListFilter,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Dashboard visual",
    text: "Receitas, despesas e saldo do mês em cards, com gráfico de pizza por categoria.",
  },
  {
    icon: ListFilter,
    title: "Filtros e busca",
    text: "Filtre por mês, ano e categoria, ou busque direto pela descrição da transação.",
  },
  {
    icon: Download,
    title: "Exportar CSV",
    text: "Baixe as transações filtradas em um clique e leve para a planilha que quiser.",
  },
  {
    icon: Smartphone,
    title: "No celular também",
    text: "Layout responsivo: registre um gasto na fila do caixa, sem atrito.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5 text-primary" />
            Finanças Pessoais
          </span>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Ir ao dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/cadastro">Criar conta</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <span className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Controle financeiro sem planilha
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Saiba para onde vai o seu dinheiro
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Registre receitas e despesas, categorize em segundos e acompanhe o
            saldo do mês em um painel claro, tudo em um só lugar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={user ? "/dashboard" : "/cadastro"}>
                Começar agora
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Card key={title}>
                <CardContent className="space-y-3 p-6">
                  <span className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <p className="container text-center text-sm text-muted-foreground">
          Finanças Pessoais. Seus dados são privados, protegidos por Row Level
          Security.
        </p>
      </footer>
    </div>
  );
}
