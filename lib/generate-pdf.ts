import jsPDF from "jspdf"

interface PDFData {
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
  total: string
}

function loadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) { reject(new Error("No canvas context")); return }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = reject
    img.src = src
  })
}

export async function generateQuotePDF(data: PDFData) {
  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  // Colors
  const orange = [249, 115, 22] as const
  const darkGray = [30, 30, 30] as const
  const medGray = [100, 100, 100] as const
  const lightGray = [200, 200, 200] as const
  const white = [255, 255, 255] as const

  // Load logo
  let logoBase64: string | null = null
  try {
    logoBase64 = await loadImageAsBase64("/images/logo11.png")
  } catch {
    // logo not available, continue without
  }

  // ---- HEADER ----
  // Background bar
  doc.setFillColor(...darkGray)
  doc.rect(0, 0, pageWidth, 38, "F")

  // Orange accent line
  doc.setFillColor(...orange)
  doc.rect(0, 38, pageWidth, 1.5, "F")

  // Logo
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", margin, 6, 40, 16)
  } else {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.setTextColor(...orange)
    doc.text("SMART ILHA", margin, 20)
  }

  // Company info on the right
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...lightGray)
  const companyLines = [
    "www.smartilha.com.br | @smartilha",
    "CNPJ: 56.997.212/0001-40",
    "WhatsApp: (21) 98020-2797",
    "Ilha do Governador - RJ",
  ]
  companyLines.forEach((line, i) => {
    doc.text(line, pageWidth - margin, 10 + i * 4.5, { align: "right" })
  })

  // ---- QUOTE TITLE ----
  let y = 48

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(...darkGray)
  doc.text("ORÇAMENTO", margin, y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...medGray)
  doc.text(`Nº ${data.quoteNumber}`, margin + 62, y)

  // Date, validity, and seller on right
  doc.setFontSize(9)
  doc.text(`Data: ${data.date}`, pageWidth - margin, y - 4, { align: "right" })
  doc.text(`Validade: ${data.validity} dia(s)`, pageWidth - margin, y + 1, { align: "right" })
  doc.text(`Vendedor: ${data.sellerName}`, pageWidth - margin, y + 6, { align: "right" })

  y += 10

  // Divider line
  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // ---- HELPER: Section title ----
  function sectionTitle(title: string, yPos: number): number {
    doc.setFillColor(249, 115, 22)
    doc.rect(margin, yPos, 3, 6, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(...darkGray)
    doc.text(title, margin + 6, yPos + 5)
    return yPos + 12
  }

  // ---- HELPER: Field row ----
  function fieldRow(label: string, value: string, yPos: number): number {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(...medGray)
    doc.text(label, margin + 4, yPos)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...darkGray)
    doc.text(value || "-", margin + 50, yPos)
    return yPos + 6
  }

  // ---- CLIENT DATA ----
  y = sectionTitle("DADOS DO CLIENTE", y)

  // Client box
  doc.setFillColor(248, 248, 248)
  doc.roundedRect(margin, y - 3, contentWidth, 32, 2, 2, "F")

  y = fieldRow("Nome:", data.clientName, y + 2)
  y = fieldRow("Telefone:", data.clientPhone || "-", y)
  y = fieldRow("CPF:", data.clientCPF || "-", y)
  y = fieldRow("Cidade:", data.clientCity || "-", y)

  y += 6

  // ---- PRODUCT DESCRIPTION ----
  y = sectionTitle("DESCRIÇÃO DO PRODUTO", y)

  doc.setFillColor(248, 248, 248)
  doc.roundedRect(margin, y - 3, contentWidth, 32, 2, 2, "F")

  y = fieldRow("Modelo:", data.model || "-", y + 2)
  y = fieldRow("Cor:", data.color || "-", y)
  y = fieldRow("Garantia:", data.warranty, y)
  y = fieldRow("Acompanha:", data.accessories.join(", ") || "-", y)

  y += 8

  // ---- VALUES TABLE ----
  y = sectionTitle("VALORES", y)

  // Table header
  doc.setFillColor(...darkGray)
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...white)
  doc.text("Descrição", margin + 4, y + 5.5)
  doc.text("Valor", pageWidth - margin - 4, y + 5.5, { align: "right" })
  y += 10

  // Product row
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...darkGray)
  doc.text(data.model || "Produto", margin + 4, y + 4)
  doc.text(`R$ ${data.productValue || "0,00"}`, pageWidth - margin - 4, y + 4, { align: "right" })

  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.2)
  doc.line(margin, y + 7, pageWidth - margin, y + 7)
  y += 9

  // Freight row
  doc.text("Frete", margin + 4, y + 4)
  doc.setTextColor(34, 197, 94) // green
  doc.text(data.freight, pageWidth - margin - 4, y + 4, { align: "right" })

  doc.setDrawColor(...lightGray)
  doc.line(margin, y + 7, pageWidth - margin, y + 7)
  y += 10

  // Total box
  doc.setFillColor(...orange)
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(...white)
  doc.text("TOTAL", margin + 6, y + 8)
  doc.setFontSize(14)
  doc.text(data.total, pageWidth - margin - 6, y + 8.5, { align: "right" })

  y += 22

  // ---- FOOTER ----
  // Divider
  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 6

  doc.setFont("helvetica", "italic")
  doc.setFontSize(8)
  doc.setTextColor(...medGray)
  doc.text("Este orçamento não caracteriza reserva de produto.", margin, y)
  y += 4
  doc.text("Garantia de 90 dias contra defeitos de fabricação.", margin, y)
  y += 8

  // Bottom accent bar
  doc.setFillColor(...orange)
  doc.rect(0, 287, pageWidth, 10, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(...white)
  doc.text("Smart Ilha - Tecnologia e Confiança | www.smartilha.com.br | @smartilha", pageWidth / 2, 292.5, { align: "center" })

  // Save file
  const clientSlug = data.clientName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  doc.save(`orcamento-smart-ilha-${clientSlug || "cliente"}.pdf`)
}
