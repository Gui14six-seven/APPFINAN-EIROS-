import Link from "next/link";
import { Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <Wallet className="h-6 w-6 text-primary" />
        Finanças Pessoais
      </Link>
      {children}
    </main>
  );
}
