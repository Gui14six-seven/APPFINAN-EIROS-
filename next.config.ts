import type { NextConfig } from "next";

/**
 * Cabeçalhos aplicados a toda resposta. Protegem a sessão do usuário contra
 * clickjacking e vazamento de URL para terceiros.
 */
const securityHeaders = [
  // Impede que o app seja embutido em um iframe de outro site (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Impede o navegador de adivinhar o tipo de um arquivo servido.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não envia o caminho completo (que pode conter filtros) a outros domínios.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // O app não usa câmera, microfone nem localização.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
