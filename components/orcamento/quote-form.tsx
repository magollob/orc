"use client"

import { useState, useCallback } from "react"
import { FileText, Download, CheckCircle, Hash, Calendar, Clock, User, Phone, CreditCard, MapPin, Watch, Palette, Shield, Package, DollarSign, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { generateQuotePDF } from "@/lib/generate-pdf"

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  const num = parseInt(digits, 10) / 100
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getAutoQuoteNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")
  return `${year}${month}${day}-${rand}`
}

function getTodayDate() {
  return new Date().toLocaleDateString("pt-BR")
}

export interface QuoteData {
  quoteNumber: string
  date: string
  validity: string
  sellerName: string
  clientName: string
  clientPhone: string
  clientCPF: string
  clientCity: string
  model: string
  customModel: string
  color: string
  warranty: string
  accessories: string[]
  productValue: string
  freight: string
}

export default function QuoteForm() {
  const [formData, setFormData] = useState<QuoteData>({
    quoteNumber: getAutoQuoteNumber(),
    date: getTodayDate(),
    validity: "1",
    sellerName: "Flávio Oliveira",
    clientName: "",
    clientPhone: "",
    clientCPF: "",
    clientCity: "Rio de Janeiro",
    model: "",
    customModel: "",
    color: "",
    warranty: "3 meses (90 dias)",
    accessories: ["Caixa original", "Cabo carregador", "Manual", "Pulseira Padrão"],
    productValue: "",
    freight: "Grátis - R$ 0,00",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const updateField = useCallback((field: keyof QuoteData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleAccessory = useCallback((accessory: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      accessories: checked
        ? [...prev.accessories, accessory]
        : prev.accessories.filter((a) => a !== accessory),
    }))
  }, [])

  const getModelDisplay = () => {
    if (formData.model === "outro") return formData.customModel
    return formData.model
  }

  const getTotal = () => {
    const digits = formData.productValue.replace(/\D/g, "")
    if (!digits) return "R$ 0,00"
    const num = parseInt(digits, 10) / 100
    return `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }

  const handleGenerate = async () => {
    if (!formData.clientName.trim()) {
      alert("Por favor, preencha o nome do cliente.")
      return
    }
    if (!formData.model) {
      alert("Por favor, selecione o modelo do produto.")
      return
    }
    if (!formData.productValue) {
      alert("Por favor, preencha o valor do produto.")
      return
    }

    setIsGenerating(true)

    try {
      await generateQuotePDF({
        ...formData,
        model: getModelDisplay(),
        total: getTotal(),
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 4000)
    } catch {
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  const accessories = [
    "Caixa original",
    "Cabo carregador",
    "Manual",
    "Pulseira Padrão",
    "+Brindes promoção (atual)",
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-orange-500/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo11.png"
              alt="Smart Ilha Logo"
              width={140}
              height={56}
              className="h-10 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
            <a href="https://www.smartilha.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">www.smartilha.com.br</a>
            <span className="w-px h-3 bg-gray-700" />
            <a href="https://www.instagram.com/smartilha" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">@smartilha</a>
            <span className="w-px h-3 bg-gray-700" />
            <span>CNPJ: 56.997.212/0001-40</span>
            <span className="w-px h-3 bg-gray-700" />
            <span>WhatsApp: (21) 98020-2797</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <FileText className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Gerador de Orçamento</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight text-balance">
            Gerar Orçamento <span className="text-orange-400">Profissional</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Preencha os dados abaixo para gerar automaticamente um orçamento em PDF formatado.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Section 1: Quote Info */}
          <section className="bg-[#111111] border border-gray-800 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Hash className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Informações do Orçamento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quoteNumber" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-500" />
                  {'Orçamento Nº'}
                </Label>
                <Input
                  id="quoteNumber"
                  value={formData.quoteNumber}
                  onChange={(e) => updateField("quoteNumber", e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  Data
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  readOnly
                  className="bg-[#1a1a1a] border-gray-700 text-gray-400 cursor-default"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="validity" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  Validade (dias)
                </Label>
                <Input
                  id="validity"
                  type="number"
                  min="1"
                  value={formData.validity}
                  onChange={(e) => updateField("validity", e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sellerName" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  Vendedor
                </Label>
                <Input
                  id="sellerName"
                  value={formData.sellerName}
                  readOnly
                  className="bg-[#1a1a1a] border-gray-700 text-gray-400 cursor-default"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Client Data */}
          <section className="bg-[#111111] border border-gray-800 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Dados do Cliente</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label htmlFor="clientName" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  Nome completo <span className="text-orange-400">*</span>
                </Label>
                <Input
                  id="clientName"
                  placeholder="Nome do cliente"
                  value={formData.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clientPhone" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  Telefone
                </Label>
                <Input
                  id="clientPhone"
                  placeholder="(00) 00000-0000"
                  value={formData.clientPhone}
                  onChange={(e) => updateField("clientPhone", formatPhone(e.target.value))}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clientCPF" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                  CPF (opcional)
                </Label>
                <Input
                  id="clientCPF"
                  placeholder="000.000.000-00"
                  value={formData.clientCPF}
                  onChange={(e) => updateField("clientCPF", formatCPF(e.target.value))}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label htmlFor="clientCity" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  Cidade
                </Label>
                <Input
                  id="clientCity"
                  placeholder="Cidade do cliente"
                  value={formData.clientCity}
                  onChange={(e) => updateField("clientCity", e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Product Description */}
          <section className="bg-[#111111] border border-gray-800 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Watch className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Descrição do Produto</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Watch className="w-3.5 h-3.5 text-gray-500" />
                  Modelo <span className="text-orange-400">*</span>
                </Label>
                <Select value={formData.model} onValueChange={(v) => updateField("model", v)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white focus:ring-orange-500/20 [&>span]:text-gray-400 data-[state=open]:border-orange-500">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-gray-700">
                    <SelectItem value="Series 11 Ultra (49mm)" className="text-white focus:bg-orange-500/10 focus:text-orange-400">
                      Series 11 Ultra (49mm)
                    </SelectItem>
                    <SelectItem value="Series 11 Pro (47mm)" className="text-white focus:bg-orange-500/10 focus:text-orange-400">
                      Series 11 Pro (47mm)
                    </SelectItem>
                    <SelectItem value="S11 Pro Mini (42mm)" className="text-white focus:bg-orange-500/10 focus:text-orange-400">
                      S11 Pro Mini (42mm)
                    </SelectItem>
                    <SelectItem value="outro" className="text-white focus:bg-orange-500/10 focus:text-orange-400">
                      Outro (manual)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.model === "outro" && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customModel" className="text-gray-300 text-sm">
                    Modelo personalizado
                  </Label>
                  <Input
                    id="customModel"
                    placeholder="Descreva o modelo"
                    value={formData.customModel}
                    onChange={(e) => updateField("customModel", e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-gray-500" />
                  Cor
                </Label>
                <Select value={formData.color} onValueChange={(v) => updateField("color", v)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white focus:ring-orange-500/20 [&>span]:text-gray-400 data-[state=open]:border-orange-500">
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-gray-700">
                    <SelectItem value="Preto" className="text-white focus:bg-orange-500/10 focus:text-orange-400">Preto</SelectItem>
                    <SelectItem value="Prata" className="text-white focus:bg-orange-500/10 focus:text-orange-400">Prata</SelectItem>
                    <SelectItem value="Dourado" className="text-white focus:bg-orange-500/10 focus:text-orange-400">Dourado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-500" />
                  Garantia
                </Label>
                <Input
                  value={formData.warranty}
                  readOnly
                  className="bg-[#1a1a1a] border-gray-700 text-gray-400 cursor-default"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-500" />
                  O que acompanha
                </Label>
                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-1">
                  {accessories.map((acc) => (
                    <label key={acc} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox
                        checked={formData.accessories.includes(acc)}
                        onCheckedChange={(checked) => toggleAccessory(acc, checked === true)}
                        className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        {acc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Values */}
          <section className="bg-[#111111] border border-gray-800 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Valores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="productValue" className="text-gray-300 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                  Valor do Produto <span className="text-orange-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <Input
                    id="productValue"
                    placeholder="0,00"
                    value={formData.productValue}
                    onChange={(e) => updateField("productValue", formatCurrency(e.target.value))}
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500/20 pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-500" />
                  Frete
                </Label>
                <Input
                  value={formData.freight}
                  readOnly
                  className="bg-[#1a1a1a] border-gray-700 text-green-400 cursor-default font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-300 text-sm">Valor Total</Label>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-md h-10 flex items-center px-3">
                  <span className="text-orange-400 font-bold text-lg">{getTotal()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Generate Button */}
          <div className="pt-2 pb-8">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base md:text-lg rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden btn-professional"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Gerando PDF...
                </span>
              ) : showSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Orçamento Gerado com Sucesso!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {'GERAR ORÇAMENTO EM PDF'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-xs">Smart Ilha - Ilha do Governador, RJ</p>
        <p className="text-gray-600 text-xs mt-1">CNPJ: 56.997.212/0001-40 | WhatsApp: (21) 98020-2797</p>
        <p className="text-gray-600 text-xs mt-1">
          <a href="https://www.smartilha.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">www.smartilha.com.br</a>
          {' | '}
          <a href="https://www.instagram.com/smartilha" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">@smartilha</a>
        </p>
      </footer>
    </div>
  )
}
