import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gerar Orçamento - Smart Ilha",
  description:
    "Gere orçamentos profissionais em PDF para smartwatches Smart Ilha. Preencha os dados e baixe o PDF formatado.",
  keywords: "orçamento, smartwatch, smart ilha, pdf, cotação",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
