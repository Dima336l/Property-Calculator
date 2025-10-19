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

// Property Brochure PDF Export
export interface PropertyBrochureData {
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  yield?: number
  monthlyRent?: number
  roi?: number
  description: string
  keyFeatures?: string[]
  listedDate?: string
  tenure?: string
  squareFeet?: number
  hasGarden?: boolean
  hasParking?: boolean
  imageUrl?: string
  images?: string[] // Array of image URLs
}

export interface BrochureSettings {
  includePhotos: boolean
  includeFinancials: boolean
  includeAreaData: boolean
  includeComparables: boolean
  yourName: string
  yourCompany: string
  yourEmail: string
  yourPhone: string
}

export async function exportPropertyBrochureToPDF(
  property: PropertyBrochureData, 
  settings: BrochureSettings,
  propertyAddress?: string,
  aiVerdict?: string
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Cover Page with gradient effect (using overlapping rectangles)
  doc.setFillColor(2, 132, 199)
  doc.rect(0, 0, pageWidth, 80, 'F')
  
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Investment Opportunity', pageWidth / 2, 35, { align: 'center' })
  
  yPos = 60
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.text(property.address, pageWidth / 2, yPos, { align: 'center' })
  
  // Price Box
  yPos = 95
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(2, 132, 199)
  doc.setLineWidth(2)
  doc.roundedRect(30, yPos, pageWidth - 60, 45, 3, 3, 'FD')
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(60, 60, 60)
  doc.text('Asking Price', pageWidth / 2, yPos + 12, { align: 'center' })
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(2, 132, 199)
  doc.text(`£${property.price.toLocaleString()}`, pageWidth / 2, yPos + 28, { align: 'center' })
  
  if (property.yield && property.yield > 0) {
    yPos += 50
    doc.setFillColor(34, 197, 94)
    doc.setDrawColor(34, 197, 94)
    doc.roundedRect(30, yPos, pageWidth - 60, 30, 3, 3, 'FD')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(255, 255, 255)
    doc.text('Estimated Yield', 40, yPos + 12)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(`${property.yield.toFixed(1)}%`, pageWidth - 40, yPos + 12, { align: 'right' })
  }

  // New Page
  doc.addPage()
  yPos = 20

  // Property Overview with styled header
  doc.setFillColor(2, 132, 199)
  doc.rect(0, yPos - 10, pageWidth, 15, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Property Overview', 20, yPos)
  yPos += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const propertyDetails = [
    ['Address:', property.address],
    ['Property Type:', property.propertyType],
    ['Bedrooms:', property.bedrooms.toString()],
    ['Bathrooms:', property.bathrooms.toString()],
  ]

  if (property.tenure) {
    propertyDetails.push(['Tenure:', property.tenure])
  }
  if (property.squareFeet && property.squareFeet > 0) {
    propertyDetails.push(['Floor Area:', `${property.squareFeet.toLocaleString()} sq ft`])
  }
  if (property.listedDate) {
    propertyDetails.push(['Listed Date:', property.listedDate])
  }

  // Property details in a styled box
  doc.setFillColor(248, 250, 252)
  doc.rect(15, yPos - 5, pageWidth - 30, propertyDetails.length * 8 + 10, 'F')
  
  propertyDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60, 60, 60)
    doc.text(label, 25, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(value, pageWidth - 25, yPos, { align: 'right' })
    yPos += 8
  })

  yPos += 15

  // Property Description with styled header
  doc.setFillColor(2, 132, 199)
  doc.rect(0, yPos - 10, pageWidth, 15, 'F')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Property Description', 20, yPos)
  yPos += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  const descriptionLines = doc.splitTextToSize(property.description, pageWidth - 40)
  doc.text(descriptionLines, 20, yPos)
  yPos += descriptionLines.length * 5 + 15

  // Key Features
  if (property.keyFeatures && property.keyFeatures.length > 0) {
    doc.setFillColor(2, 132, 199)
    doc.rect(0, yPos - 10, pageWidth, 15, 'F')
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Key Features', 20, yPos)
    yPos += 15

    doc.setFillColor(248, 250, 252)
    const featureBoxHeight = property.keyFeatures.length * 7 + 8
    doc.rect(15, yPos - 5, pageWidth - 30, featureBoxHeight, 'F')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    property.keyFeatures.forEach((feature) => {
      doc.text(`+ ${feature}`, 25, yPos)
      yPos += 7
    })
    yPos += 13
  }

  // Additional Features
  if (property.hasGarden || property.hasParking) {
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(2, 132, 199)
    doc.text('Additional Features', 20, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    if (property.hasGarden) {
      doc.text('+ Garden', 25, yPos)
      yPos += 7
    }
    if (property.hasParking) {
      doc.text('+ Parking', 25, yPos)
      yPos += 7
    }
    yPos += 10
  }

  // Property Photos (if enabled and available)
  console.log('PDF - Images check:', {
    includePhotos: settings.includePhotos,
    hasImages: !!property.images,
    imageCount: property.images?.length || 0,
    firstImage: property.images?.[0]?.substring(0, 50) + '...' || 'none'
  })
  
  if (settings.includePhotos) {
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(2, 132, 199)
    doc.rect(0, yPos - 10, pageWidth, 15, 'F')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Property Photos', 20, yPos)
    yPos += 20

    if (property.images && property.images.length > 0) {
      console.log(`PDF - Adding ${property.images.length} images to PDF`)
      
      // Load and add images to PDF
      const imagesToInclude = property.images.slice(0, 6) // Limit to 6 images
      const imagesPerRow = 2
      const imageWidth = (pageWidth - 40) / imagesPerRow - 5
      const imageHeight = imageWidth * 0.75 // 4:3 aspect ratio
      
      let imageCount = 0
      
      for (let i = 0; i < imagesToInclude.length; i++) {
        const imageData = imagesToInclude[i]
        console.log(`PDF - Processing image ${i + 1}/${imagesToInclude.length}`)
        console.log(`PDF - Image data type: ${typeof imageData}`)
        console.log(`PDF - Image data length: ${imageData?.length || 0}`)
        console.log(`PDF - Image data starts with: ${imageData?.substring(0, 50)}...`)
        
        try {
          // Skip if image data is not valid
          if (!imageData || !imageData.startsWith('data:image/')) {
            console.warn(`PDF - Skipping invalid image data at index ${i}`)
            continue
          }
          
          // Check if we need a new page
          if (yPos + imageHeight > 270) {
            doc.addPage()
            yPos = 20
          }
          
          // Calculate position (2 images per row)
          const col = imageCount % imagesPerRow
          const xPos = 15 + col * (imageWidth + 10)
          
          // Detect image format from base64 data
          let format: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG'
          if (imageData.includes('data:image/png')) {
            format = 'PNG'
          } else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) {
            format = 'JPEG'
          } else if (imageData.includes('data:image/webp')) {
            format = 'WEBP'
          }
          
          console.log(`PDF - Adding image with format: ${format} at position (${xPos}, ${yPos})`)
          // Add image to PDF (images should be base64 encoded)
          doc.addImage(imageData, format, xPos, yPos, imageWidth, imageHeight)
          
          // Move to next position
          if (col === imagesPerRow - 1) {
            yPos += imageHeight + 10
          }
          
          imageCount++
          console.log(`PDF - Successfully added image ${i + 1} to PDF`)
        } catch (error) {
          console.error(`PDF - Error adding image ${i + 1}:`, error)
          console.error(`PDF - Image data that failed (first 200 chars):`, imageData?.substring(0, 200))
          // Continue with next image
        }
      }
      
      // Add spacing after images
      if (imageCount % imagesPerRow !== 0) {
        yPos += imageHeight + 10
      }
      
      if (imageCount === 0) {
        // No images were successfully added
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(100, 100, 100)
        doc.text('Property images could not be loaded. Please check the console for details.', 20, yPos)
        yPos += 10
      }
      
      yPos += 10
    } else {
      // No images provided
      console.log('PDF - No images to display')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(100, 100, 100)
      doc.text('No property images available.', 20, yPos)
      yPos += 20
    }
  }

  // Financial Analysis (if enabled)
  if (settings.includeFinancials && (property.monthlyRent || property.roi)) {
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(2, 132, 199)
    doc.rect(0, yPos - 10, pageWidth, 15, 'F')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Financial Analysis', 20, yPos)
    yPos += 20

    // Financial metrics in styled boxes
    if (property.monthlyRent) {
      doc.setFillColor(240, 253, 244)
      doc.rect(15, yPos - 5, pageWidth - 30, 28, 'F')
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Monthly Rental Income:', 25, yPos)
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text(`£${property.monthlyRent.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
      yPos += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('Annual Rental Income:', 25, yPos)
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94)
      doc.text(`£${(property.monthlyRent * 12).toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
      yPos += 18
    }

    if (property.yield && property.yield > 0) {
      // Single box for both yield and ROI
      doc.setFillColor(240, 253, 244)
      doc.rect(15, yPos - 5, pageWidth - 30, 20, 'F')
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Gross Yield:', 25, yPos)
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text(`${property.yield.toFixed(1)}%`, pageWidth - 25, yPos, { align: 'right' })
      yPos += 18
    }

    if (property.roi) {
      // Separate box for ROI
      doc.setFillColor(240, 253, 244)
      doc.rect(15, yPos - 5, pageWidth - 30, 20, 'F')
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Return on Investment:', 25, yPos)
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text(`${property.roi.toFixed(1)}%`, pageWidth - 25, yPos, { align: 'right' })
      yPos += 18
    }
  }

  // AI Verdict Section - Right after Financial Analysis
  // Only add new page if absolutely necessary (very close to bottom)
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  // Blue header like Financial Analysis
  doc.setFillColor(2, 132, 199)
  doc.rect(0, yPos - 10, pageWidth, 15, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('AI Investment Verdict', 20, yPos)
  yPos += 20

  // AI verdict text in a light background box
  const verdict = aiVerdict || 'AI analysis unavailable. Please ensure Ollama is running for AI-powered property insights and investment recommendations.'
  console.log('PDF - AI verdict being added:', verdict)
  
  // Light background box for the verdict text
  doc.setFillColor(248, 250, 252)
  // Box goes from x=15 to x=pageWidth-15, so width is pageWidth-30
  const boxWidth = pageWidth - 30
  // Use much larger text width to ensure it fills the box
  const textWidth = boxWidth + 130
  const verdictLines = doc.splitTextToSize(verdict, textWidth)
  const boxHeight = verdictLines.length * 5 + 10
  doc.rect(15, yPos - 5, boxWidth, boxHeight, 'F')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  // Text starts at x=15 and uses full box width
  doc.text(verdictLines, 15, yPos)
  yPos += verdictLines.length * 5 + 10
  
  // Ensure proper spacing after AI verdict section
  yPos += 10

  // Investment Highlights
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }

  doc.setFillColor(2, 132, 199)
  doc.rect(0, yPos - 10, pageWidth, 15, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Investment Highlights', 20, yPos)
  yPos += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  
  const highlights = [
    'High rental yield property in prime location',
    'Strong demand for rental properties in the area',
    'Excellent transport links and local amenities',
    'Potential for value appreciation',
    'Suitable for BTL or BRR strategy',
  ]

  highlights.forEach((highlight) => {
    doc.text(`• ${highlight}`, 25, yPos)
    yPos += 7
  })

  // Contact Information
  yPos += 5
  if (yPos > 200) {
    doc.addPage()
    yPos = 20
  }

  // Dark contact box
  doc.setFillColor(30, 41, 59)
  doc.roundedRect(15, yPos - 5, pageWidth - 30, 55, 3, 3, 'F')
  
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Contact Information', 25, yPos + 5)
  yPos += 20

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Email: ' + settings.yourEmail, 25, yPos)
  yPos += 8
  doc.text('Phone: ' + settings.yourPhone, 25, yPos)
  yPos += 8
  doc.text('Name: ' + settings.yourName, 25, yPos)
  yPos += 8
  doc.text('Company: ' + settings.yourCompany, 25, yPos)

  // Footer with modern styling
  yPos = pageHeight - 15
  doc.setFillColor(2, 132, 199)
  doc.rect(0, yPos - 5, pageWidth, 20, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.text('Generated by Property Calculator - Professional Property Investment Tools', pageWidth / 2, yPos + 3, { align: 'center' })
  doc.setFontSize(8)
  doc.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPos + 8, { align: 'center' })

  // Save
  const fileName = `Property-Brochure-${property.address.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`
  doc.save(fileName)
}

