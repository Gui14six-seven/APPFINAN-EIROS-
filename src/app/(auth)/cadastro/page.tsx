import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Criar conta | Finanças Pessoais" };

export default function CadastroPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
