import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundo — Onde founders e devs se encontram para construir juntos",
  description:
    "A plataforma de matchmaking curado onde founders não-técnicos e construtores técnicos se encontram com segurança para co-fundar startups no Brasil.",
  keywords: [
    "co-founder",
    "startup",
    "matchmaking",
    "founder",
    "developer",
    "Brasil",
    "empreendedorismo",
  ],
  openGraph: {
    title: "Foundo — Matchmaking curado para co-fundação",
    description:
      "Encontre seu co-founder técnico ou comercial com segurança e intencionalidade.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
