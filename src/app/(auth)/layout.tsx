import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <Wallet className="h-6 w-6 text-primary" />
        Finanças Pessoais
      </Link>
      {children}
    </main>
  );
}
