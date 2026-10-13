import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Entrar | Finanças Pessoais" };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
