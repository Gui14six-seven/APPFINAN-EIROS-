import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Wallet className="h-5 w-5 text-primary" />
            Finanças Pessoais
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container space-y-6 py-8">{children}</main>
    </div>
  );
}
