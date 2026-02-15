import type { Metadata } from "next"
import QuoteForm from "@/components/orcamento/quote-form"

export const metadata: Metadata = {
  title: "Gerar Orçamento - Smart Ilha",
  description: "Gere orçamentos profissionais em PDF para smartwatches Smart Ilha.",
}

export default function Page() {
  return <QuoteForm />
}
