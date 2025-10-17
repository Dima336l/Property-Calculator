import jsPDF from 'jspdf'

export interface BTLCalculation {
  purchasePrice: number
  deposit: number
  stampDuty: number
  refurb: number
  legalFees: number
  monthlyRent: number
  managementFee: number
  maintenance: number
  insurance: number
  mortgageRate: number
  results: {
    monthlyCashFlow: number
    annualCashFlow: number
    roi: number
    grossYield: number
    netYield: number
    totalInvestment: number
    monthlyMortgage: number
  }
}

export interface BRRCalculation {
  purchasePrice: number
  refurbCost: number
  afterRepairValue: number
  deposit: number
  stampDuty: number
  legalFees: number
  monthlyRent: number
  managementFee: number
  maintenance: number
  insurance: number
  mortgageRate: number
  refinanceLTV: number
  results: {
    monthlyCashFlow: number
    annualCashFlow: number
    roi: number
    grossYield: number
    totalCost: number
    refinanceAmount: number
    capitalExtracted: number
    leftInDeal: number
  }
}

export interface HMOCalculation {
  purchasePrice: number
  refurbCost: number
  deposit: number
  stampDuty: number
  legalFees: number
  numberOfRooms: number
  rentPerRoom: number
  managementFee: number
  maintenance: number
  insurance: number
  utilities: number
  mortgageRate: number
  results: {
    monthlyCashFlow: number
    annualCashFlow: number
    roi: number
    grossYield: number
    netYield: number
    totalInvestment: number
    totalMonthlyRent: number
  }
}

export function exportBTLToPDF(data: BTLCalculation, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199) // Primary blue
  doc.text('Buy-to-Let Investment Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Purchase Details
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Purchase Details', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const purchaseDetails = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Deposit:', `£${data.deposit.toLocaleString()}`],
    ['Stamp Duty:', `£${data.stampDuty.toLocaleString()}`],
    ['Refurbishment:', `£${data.refurb.toLocaleString()}`],
    ['Legal Fees:', `£${data.legalFees.toLocaleString()}`],
    ['Mortgage Rate:', `${data.mortgageRate}%`],
  ]

  purchaseDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 5

  // Rental Income
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Rental Income & Costs', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)

  const rentalDetails = [
    ['Monthly Rent:', `£${data.monthlyRent.toLocaleString()}`],
    ['Management Fee:', `${data.managementFee}%`],
    ['Monthly Maintenance:', `£${data.maintenance.toLocaleString()}`],
    ['Monthly Insurance:', `£${data.insurance.toLocaleString()}`],
    ['Monthly Mortgage:', `£${data.results.monthlyMortgage.toFixed(2)}`],
  ]

  rentalDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  // Results Section (Highlighted)
  doc.setFillColor(240, 249, 255)
  doc.rect(15, yPos - 5, pageWidth - 30, 70, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(2, 132, 199)
  doc.text('Investment Returns', 20, yPos)
  yPos += 10

  // Key Metrics
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  
  doc.text('Monthly Cash Flow:', 25, yPos)
  doc.setTextColor(data.results.monthlyCashFlow >= 0 ? 34 : 220, data.results.monthlyCashFlow >= 0 ? 197 : 53, data.results.monthlyCashFlow >= 0 ? 94 : 69)
  doc.text(`£${data.results.monthlyCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('Annual Cash Flow:', 25, yPos)
  doc.setTextColor(data.results.annualCashFlow >= 0 ? 34 : 220, data.results.annualCashFlow >= 0 ? 197 : 53, data.results.annualCashFlow >= 0 ? 94 : 69)
  doc.text(`£${data.results.annualCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('ROI:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.roi.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('Gross Yield:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.grossYield.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('Net Yield:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.netYield.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 15

  // Total Investment
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text('Total Investment Required:', 25, yPos)
  doc.setFontSize(14)
  doc.setTextColor(2, 132, 199)
  doc.text(`£${data.results.totalInvestment.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated by PropertyPro - Property Investment Calculator', pageWidth / 2, yPos, { align: 'center' })

  // Save
  doc.save(`BTL-Analysis-${Date.now()}.pdf`)
}

export function exportBRRToPDF(data: BRRCalculation, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199)
  doc.text('BRR Investment Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 8
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Buy, Refurbish, Refinance Strategy', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 6
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Purchase & Refurb Details
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Deal Structure', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const dealDetails = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Refurbishment Cost:', `£${data.refurbCost.toLocaleString()}`],
    ['Total Cost:', `£${data.results.totalCost.toLocaleString()}`],
    ['After Repair Value:', `£${data.afterRepairValue.toLocaleString()}`],
    ['Refinance LTV:', `${data.refinanceLTV}%`],
    ['Mortgage Rate:', `${data.mortgageRate}%`],
  ]

  dealDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  // Capital Extraction (Highlighted)
  doc.setFillColor(240, 253, 244)
  doc.rect(15, yPos - 5, pageWidth - 30, 25, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(34, 197, 94)
  doc.text('Capital Extraction', 20, yPos)
  yPos += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Refinance Amount:', 25, yPos)
  doc.text(`£${data.results.refinanceAmount.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.text('Capital Extracted:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`£${data.results.capitalExtracted.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.text('Left in Deal:', 25, yPos)
  doc.setTextColor(2, 132, 199)
  doc.text(`£${data.results.leftInDeal.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 15

  // Rental Returns
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Rental Returns', 20, yPos)
  yPos += 8

  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)

  const returnDetails = [
    ['Monthly Rent:', `£${data.monthlyRent.toLocaleString()}`],
    ['Monthly Cash Flow:', `£${data.results.monthlyCashFlow.toFixed(2)}`],
    ['Annual Cash Flow:', `£${data.results.annualCashFlow.toFixed(2)}`],
    ['Gross Yield (ARV):', `${data.results.grossYield.toFixed(2)}%`],
  ]

  returnDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  // ROI (Highlighted)
  doc.setFillColor(240, 249, 255)
  doc.rect(15, yPos - 5, pageWidth - 30, 15, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text('Return on Investment:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  const roiText = data.results.roi === Infinity ? '∞%' : `${data.results.roi.toFixed(2)}%`
  doc.text(roiText, pageWidth - 25, yPos, { align: 'right' })

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated by PropertyPro - Property Investment Calculator', pageWidth / 2, yPos, { align: 'center' })

  // Save
  doc.save(`BRR-Analysis-${Date.now()}.pdf`)
}

export function exportHMOToPDF(data: HMOCalculation, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199)
  doc.text('HMO Investment Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 8
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('House in Multiple Occupation', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 6
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Property Details
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Property Details', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const propertyDetails = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Refurbishment:', `£${data.refurbCost.toLocaleString()}`],
    ['Deposit:', `£${data.deposit.toLocaleString()}`],
    ['Stamp Duty:', `£${data.stampDuty.toLocaleString()}`],
    ['Legal Fees:', `£${data.legalFees.toLocaleString()}`],
    ['Number of Rooms:', `${data.numberOfRooms}`],
    ['Rent per Room:', `£${data.rentPerRoom.toLocaleString()}/month`],
  ]

  propertyDetails.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  // Monthly Income (Highlighted)
  doc.setFillColor(240, 253, 244)
  doc.rect(15, yPos - 5, pageWidth - 30, 15, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(34, 197, 94)
  doc.text('Total Monthly Rent', 20, yPos)
  
  doc.setFontSize(18)
  doc.text(`£${data.results.totalMonthlyRent.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 15

  // Operating Costs
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Monthly Operating Costs', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)

  const costs = [
    ['Management Fee:', `${data.managementFee}%`],
    ['Maintenance:', `£${data.maintenance.toLocaleString()}`],
    ['Insurance:', `£${data.insurance.toLocaleString()}`],
    ['Utilities:', `£${data.utilities.toLocaleString()}`],
  ]

  costs.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  // Results (Highlighted)
  doc.setFillColor(240, 249, 255)
  doc.rect(15, yPos - 5, pageWidth - 30, 50, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(2, 132, 199)
  doc.text('Investment Returns', 20, yPos)
  yPos += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  
  doc.text('Monthly Cash Flow:', 25, yPos)
  doc.setTextColor(data.results.monthlyCashFlow >= 0 ? 34 : 220, data.results.monthlyCashFlow >= 0 ? 197 : 53, data.results.monthlyCashFlow >= 0 ? 94 : 69)
  doc.text(`£${data.results.monthlyCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('Annual Cash Flow:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`£${data.results.annualCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('ROI:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.roi.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setTextColor(0, 0, 0)
  doc.text('Gross Yield:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.grossYield.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Generated by PropertyPro - Property Investment Calculator', pageWidth / 2, yPos, { align: 'center' })

  // Save
  doc.save(`HMO-Analysis-${Date.now()}.pdf`)
}

// Flip Calculator PDF Export
export function exportFlipToPDF(data: any, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199)
  doc.text('Property Flip Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Purchase & Costs', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const details = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Refurbishment:', `£${data.refurbCost.toLocaleString()}`],
    ['Stamp Duty:', `£${data.stampDuty.toLocaleString()}`],
    ['Legal Fees:', `£${data.legalFees.toLocaleString()}`],
    ['Selling Fees:', `£${data.sellingFees.toLocaleString()}`],
    ['Holding Costs:', `£${data.holdingCosts.toLocaleString()}`],
    ['Timescale:', `${data.timescale} months`],
  ]

  details.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  doc.setFillColor(240, 249, 255)
  doc.rect(15, yPos - 5, pageWidth - 30, 40, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(2, 132, 199)
  doc.text('Profit Analysis', 20, yPos)
  yPos += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Total Costs:', 25, yPos)
  doc.text(`£${data.results.totalCosts.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.text('Selling Price:', 25, yPos)
  doc.text(`£${data.sellingPrice.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(16)
  doc.text('Profit:', 25, yPos)
  doc.setTextColor(data.results.profit >= 0 ? 34 : 220, data.results.profit >= 0 ? 197 : 53, data.results.profit >= 0 ? 94 : 69)
  doc.text(`£${data.results.profit.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })

  yPos += 15
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.text('ROI:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.roi.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })

  doc.save(`Flip-Analysis-${Date.now()}.pdf`)
}

// Holiday Let PDF Export
export function exportHolidayLetToPDF(data: any, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199)
  doc.text('Holiday Let Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Property Details', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const details = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Deposit:', `£${data.deposit.toLocaleString()}`],
    ['Nightly Rate:', `£${data.nightlyRate.toLocaleString()}`],
    ['Occupancy Rate:', `${data.occupancyRate}%`],
    ['Occupied Days/Year:', `${data.results.occupiedDays}`],
  ]

  details.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  doc.setFillColor(240, 253, 244)
  doc.rect(15, yPos - 5, pageWidth - 30, 50, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(34, 197, 94)
  doc.text('Revenue & Returns', 20, yPos)
  yPos += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Monthly Revenue:', 25, yPos)
  doc.text(`£${data.results.monthlyRevenue.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.text('Annual Revenue:', 25, yPos)
  doc.text(`£${data.results.annualRevenue.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.text('Monthly Cash Flow:', 25, yPos)
  doc.setTextColor(data.results.monthlyCashFlow >= 0 ? 34 : 220, data.results.monthlyCashFlow >= 0 ? 197 : 53, data.results.monthlyCashFlow >= 0 ? 94 : 69)
  doc.text(`£${data.results.monthlyCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.text('ROI:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.roi.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.text('Gross Yield:', 25, yPos)
  doc.text(`${data.results.grossYield.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })

  doc.save(`HolidayLet-Analysis-${Date.now()}.pdf`)
}

// Purchase Calculator PDF Export
export function exportPurchaseToPDF(data: any, propertyAddress?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  doc.setFontSize(24)
  doc.setTextColor(2, 132, 199)
  doc.text('Full Purchase Analysis', pageWidth / 2, yPos, { align: 'center' })
  
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  
  if (propertyAddress) {
    yPos += 6
    doc.text(propertyAddress, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Purchase Costs', 20, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const details = [
    ['Purchase Price:', `£${data.purchasePrice.toLocaleString()}`],
    ['Deposit:', `£${data.deposit.toLocaleString()}`],
    ['Stamp Duty:', `£${data.stampDuty.toLocaleString()}`],
    ['Survey Fees:', `£${data.surveyFees.toLocaleString()}`],
    ['Legal Fees:', `£${data.legalFees.toLocaleString()}`],
    ['Broker Fees:', `£${data.brokerFees.toLocaleString()}`],
    ['Refurbishment:', `£${data.refurbCost.toLocaleString()}`],
    ['LTV:', `${data.results.ltv.toFixed(2)}%`],
  ]

  details.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 10

  doc.setFillColor(240, 249, 255)
  doc.rect(15, yPos - 5, pageWidth - 30, 50, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(2, 132, 199)
  doc.text('Investment Returns', 20, yPos)
  yPos += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Total Investment:', 25, yPos)
  doc.text(`£${data.results.totalInvestment.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.text('Monthly Cash Flow:', 25, yPos)
  doc.setTextColor(data.results.monthlyCashFlow >= 0 ? 34 : 220, data.results.monthlyCashFlow >= 0 ? 197 : 53, data.results.monthlyCashFlow >= 0 ? 94 : 69)
  doc.text(`£${data.results.monthlyCashFlow.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.text('ROI:', 25, yPos)
  doc.setTextColor(34, 197, 94)
  doc.text(`${data.results.roi.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.text('Gross Yield:', 25, yPos)
  doc.text(`${data.results.grossYield.toFixed(2)}%`, pageWidth - 25, yPos, { align: 'right' })

  doc.save(`Purchase-Analysis-${Date.now()}.pdf`)
}

