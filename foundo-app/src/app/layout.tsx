import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clip — Matchmaking curado para co-fundação",
  description:
    "Clip conecta fundadores de startups e talentos técnicos (builders) para criarem juntos o próximo unicórnio através de curadoria e matchmaking inteligente.",
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
    title: "Clip — Matchmaking curado para co-fundação",
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
