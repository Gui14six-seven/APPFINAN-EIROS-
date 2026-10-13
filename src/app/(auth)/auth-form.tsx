"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signUp, type AuthState } from "./actions";

type Mode = "signin" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const isSignIn = mode === "signin";
  const [state, action, pending] = useActionState<AuthState, FormData>(
    isSignIn ? signIn : signUp,
    {},
  );
  const redirectTo = useSearchParams().get("redirect") ?? "/dashboard";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isSignIn ? "Entrar" : "Criar conta"}
        </CardTitle>
        <CardDescription>
          {isSignIn
            ? "Acesse o seu painel financeiro."
            : "Comece a organizar suas finanças em minutos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectTo} />

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          {state.message ? (
            <p className="text-sm text-success" role="status">
              {state.message}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? "Aguarde..."
              : isSignIn
                ? "Entrar"
                : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignIn ? (
            <>
              Não tem conta?{" "}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
