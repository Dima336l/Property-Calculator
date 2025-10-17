'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator, TrendingUp, Home, Users, Download, Repeat, TrendingDown, Plane, ShoppingCart, Building, Save } from 'lucide-react'
import { exportBTLToPDF, exportBRRToPDF, exportHMOToPDF, exportFlipToPDF, exportHolidayLetToPDF, exportPurchaseToPDF } from '@/lib/pdf-export'

type CalculatorType = 'btl' | 'brr' | 'hmo' | 'flip' | 'holiday-let' | 'purchase' | 'rent-to-sa'

export default function CalculatorsPage() {
  const searchParams = useSearchParams()
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('btl')
  const [propertyAddress, setPropertyAddress] = useState('')
  
  // BTL State
  const [btlInputs, setBtlInputs] = useState({
    purchasePrice: 180000,
    deposit: 45000,
    stampDuty: 9000,
    refurb: 10000,
    legalFees: 1500,
    monthlyRent: 950,
    managementFee: 10,
    maintenance: 100,
    insurance: 50,
    mortgageRate: 5.5,
  })

  // Pre-fill calculator with property data from URL
  useEffect(() => {
    const price = searchParams.get('price')
    const beds = searchParams.get('beds')
    const address = searchParams.get('address')
    const city = searchParams.get('city')
    
    if (price && address) {
      const purchasePrice = parseInt(price)
      const bedrooms = beds ? parseInt(beds) : 3
      
      // Set address for display
      setPropertyAddress(`${address}, ${city || ''}`)
      
      // Calculate suggested values
      const deposit = Math.round(purchasePrice * 0.25) // 25% deposit
      const stampDuty = calculateStampDuty(purchasePrice)
      const estimatedRent = estimateRent(bedrooms, city || 'Manchester')
      
      // Pre-fill BTL calculator
      setBtlInputs({
        purchasePrice,
        deposit,
        stampDuty,
        refurb: 10000,
        legalFees: 1500,
        monthlyRent: estimatedRent,
        managementFee: 10,
        maintenance: 100,
        insurance: 50,
        mortgageRate: 5.5,
      })
      
      // Pre-fill BRR calculator
      setBrrInputs({
        purchasePrice,
        refurbCost: 30000,
        afterRepairValue: Math.round(purchasePrice * 1.2), // 20% uplift
        deposit: Math.round(purchasePrice * 0.25),
        stampDuty,
        legalFees: 1500,
        monthlyRent: estimatedRent,
        managementFee: 10,
        maintenance: 100,
        insurance: 50,
        mortgageRate: 5.5,
        refinanceLTV: 75,
      })
      
      // Pre-fill HMO calculator
      setHmoInputs({
        purchasePrice,
        refurbCost: 40000,
        deposit: Math.round(purchasePrice * 0.25),
        stampDuty,
        legalFees: 2000,
        numberOfRooms: bedrooms + 1,
        rentPerRoom: Math.round(estimatedRent / bedrooms * 1.3), // 30% uplift per room
        managementFee: 12,
        maintenance: 200,
        insurance: 100,
        utilities: 150,
        mortgageRate: 5.5,
      })
    }
  }, [searchParams])
  
  // Helper function to calculate stamp duty
  function calculateStampDuty(price: number): number {
    // UK Stamp Duty for additional properties (simplified)
    if (price <= 250000) return Math.round(price * 0.03)
    if (price <= 925000) return 7500 + Math.round((price - 250000) * 0.08)
    if (price <= 1500000) return 61500 + Math.round((price - 925000) * 0.13)
    return 136250 + Math.round((price - 1500000) * 0.15)
  }
  
  // Helper function to estimate rent based on bedrooms and location
  function estimateRent(bedrooms: number, location: string): number {
    const baseRent: { [key: number]: number } = {
      1: 700,
      2: 900,
      3: 1100,
      4: 1400,
      5: 1700,
    }
    
    // Adjust for location (simplified)
    const locationMultiplier = location.toLowerCase().includes('london') ? 1.8 : 1.0
    
    return Math.round((baseRent[bedrooms] || 1000) * locationMultiplier)
  }

  // BRR State
  const [brrInputs, setBrrInputs] = useState({
    purchasePrice: 150000,
    refurbCost: 30000,
    afterRepairValue: 220000,
    deposit: 37500,
    stampDuty: 7500,
    legalFees: 1500,
    monthlyRent: 1100,
    managementFee: 10,
    maintenance: 100,
    insurance: 50,
    mortgageRate: 5.5,
    refinanceLTV: 75,
  })

  // HMO State
  const [hmoInputs, setHmoInputs] = useState({
    purchasePrice: 200000,
    refurbCost: 40000,
    deposit: 50000,
    stampDuty: 10000,
    legalFees: 2000,
    numberOfRooms: 5,
    rentPerRoom: 450,
    managementFee: 12,
    maintenance: 200,
    insurance: 100,
    utilities: 150,
    mortgageRate: 5.5,
  })

  // Flip State
  const [flipInputs, setFlipInputs] = useState({
    purchasePrice: 150000,
    refurbCost: 30000,
    sellingPrice: 220000,
    stampDuty: 7500,
    legalFees: 1500,
    sellingFees: 5500, // Estate agent fees
    holdingCosts: 3000, // Mortgage payments during refurb
    timescale: 6, // months
  })

  // Holiday Let State
  const [holidayLetInputs, setHolidayLetInputs] = useState({
    purchasePrice: 200000,
    deposit: 50000,
    stampDuty: 10000,
    refurb: 15000,
    legalFees: 1500,
    nightlyRate: 120,
    occupancyRate: 60, // percentage
    managementFee: 15,
    cleaningPerBooking: 50,
    maintenance: 200,
    insurance: 100,
    utilities: 150,
    mortgageRate: 5.5,
  })

  // Purchase Calculator State (Most comprehensive)
  const [purchaseInputs, setPurchaseInputs] = useState({
    purchasePrice: 200000,
    deposit: 50000,
    stampDuty: 10000,
    surveyFees: 500,
    legalFees: 1500,
    brokerFees: 1000,
    refurbCost: 10000,
    mortgageRate: 5.5,
    mortgageTerm: 25,
    monthlyRent: 1000,
    managementFee: 10,
    maintenance: 100,
    insurance: 80,
    groundRent: 0,
    serviceCharge: 0,
  })

  // Rent to SA State
  const [rentToSAInputs, setRentToSAInputs] = useState({
    monthlyRent: 1200,
    numberOfRooms: 3,
    nightlyRatePerRoom: 80,
    occupancyRate: 65,
    cleaningPerBooking: 40,
    utilities: 200,
    councilTax: 150,
    internet: 40,
    supplies: 100,
    management: 15,
  })

  // Calculate BTL Results
  const calculateBTL = () => {
    const loanAmount = btlInputs.purchasePrice - btlInputs.deposit
    const monthlyMortgage = (loanAmount * (btlInputs.mortgageRate / 100)) / 12
    const monthlyManagement = (btlInputs.monthlyRent * btlInputs.managementFee) / 100
    const monthlyCosts = monthlyMortgage + monthlyManagement + btlInputs.maintenance + btlInputs.insurance
    const monthlyCashFlow = btlInputs.monthlyRent - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const totalInvestment = btlInputs.deposit + btlInputs.stampDuty + btlInputs.refurb + btlInputs.legalFees
    const roi = (annualCashFlow / totalInvestment) * 100
    const grossYield = ((btlInputs.monthlyRent * 12) / btlInputs.purchasePrice) * 100
    const netYield = (annualCashFlow / btlInputs.purchasePrice) * 100

    return {
      monthlyCashFlow,
      annualCashFlow,
      roi,
      grossYield,
      netYield,
      totalInvestment,
      monthlyMortgage,
    }
  }

  // Calculate BRR Results
  const calculateBRR = () => {
    const totalCost = brrInputs.purchasePrice + brrInputs.refurbCost
    const refinanceAmount = (brrInputs.afterRepairValue * brrInputs.refinanceLTV) / 100
    const capitalExtracted = refinanceAmount - (brrInputs.purchasePrice - brrInputs.deposit)
    const leftInDeal = totalCost + brrInputs.stampDuty + brrInputs.legalFees - capitalExtracted
    
    const monthlyMortgage = (refinanceAmount * (brrInputs.mortgageRate / 100)) / 12
    const monthlyManagement = (brrInputs.monthlyRent * brrInputs.managementFee) / 100
    const monthlyCosts = monthlyMortgage + monthlyManagement + brrInputs.maintenance + brrInputs.insurance
    const monthlyCashFlow = brrInputs.monthlyRent - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const roi = leftInDeal > 0 ? (annualCashFlow / leftInDeal) * 100 : Infinity
    const grossYield = ((brrInputs.monthlyRent * 12) / brrInputs.afterRepairValue) * 100

    return {
      monthlyCashFlow,
      annualCashFlow,
      roi,
      grossYield,
      totalCost,
      refinanceAmount,
      capitalExtracted,
      leftInDeal,
    }
  }

  // Calculate HMO Results
  const calculateHMO = () => {
    const loanAmount = hmoInputs.purchasePrice - hmoInputs.deposit
    const totalMonthlyRent = hmoInputs.numberOfRooms * hmoInputs.rentPerRoom
    const monthlyMortgage = (loanAmount * (hmoInputs.mortgageRate / 100)) / 12
    const monthlyManagement = (totalMonthlyRent * hmoInputs.managementFee) / 100
    const monthlyCosts = monthlyMortgage + monthlyManagement + hmoInputs.maintenance + hmoInputs.insurance + hmoInputs.utilities
    const monthlyCashFlow = totalMonthlyRent - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const totalInvestment = hmoInputs.deposit + hmoInputs.refurbCost + hmoInputs.stampDuty + hmoInputs.legalFees
    const roi = (annualCashFlow / totalInvestment) * 100
    const grossYield = ((totalMonthlyRent * 12) / hmoInputs.purchasePrice) * 100
    const netYield = (annualCashFlow / hmoInputs.purchasePrice) * 100

    return {
      monthlyCashFlow,
      annualCashFlow,
      roi,
      grossYield,
      netYield,
      totalInvestment,
      totalMonthlyRent,
    }
  }

  // Calculate Flip Results
  const calculateFlip = () => {
    const totalCosts = flipInputs.purchasePrice + flipInputs.refurbCost + flipInputs.stampDuty + 
                       flipInputs.legalFees + flipInputs.sellingFees + flipInputs.holdingCosts
    const profit = flipInputs.sellingPrice - totalCosts
    const roi = (profit / (flipInputs.purchasePrice + flipInputs.refurbCost + flipInputs.stampDuty + flipInputs.legalFees)) * 100
    const profitMargin = (profit / flipInputs.sellingPrice) * 100

    return {
      totalCosts,
      profit,
      roi,
      profitMargin,
    }
  }

  // Calculate Holiday Let Results
  const calculateHolidayLet = () => {
    const daysPerYear = 365
    const occupiedDays = (daysPerYear * holidayLetInputs.occupancyRate) / 100
    const averageBookings = occupiedDays / 3 // Assume 3-day average stay
    const annualRevenue = occupiedDays * holidayLetInputs.nightlyRate
    const monthlyRevenue = annualRevenue / 12
    
    const loanAmount = holidayLetInputs.purchasePrice - holidayLetInputs.deposit
    const monthlyMortgage = (loanAmount * (holidayLetInputs.mortgageRate / 100)) / 12
    const monthlyManagement = (monthlyRevenue * holidayLetInputs.managementFee) / 100
    const monthlyCleaning = (averageBookings / 12) * holidayLetInputs.cleaningPerBooking
    const monthlyCosts = monthlyMortgage + monthlyManagement + monthlyCleaning + 
                        holidayLetInputs.maintenance + holidayLetInputs.insurance + holidayLetInputs.utilities
    const monthlyCashFlow = monthlyRevenue - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const totalInvestment = holidayLetInputs.deposit + holidayLetInputs.stampDuty + 
                           holidayLetInputs.refurb + holidayLetInputs.legalFees
    const roi = (annualCashFlow / totalInvestment) * 100
    const grossYield = (annualRevenue / holidayLetInputs.purchasePrice) * 100

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyCashFlow,
      annualCashFlow,
      roi,
      grossYield,
      totalInvestment,
      occupiedDays: Math.round(occupiedDays),
    }
  }

  // Calculate Purchase Results
  const calculatePurchase = () => {
    const loanAmount = purchaseInputs.purchasePrice - purchaseInputs.deposit
    const monthlyMortgage = (loanAmount * (purchaseInputs.mortgageRate / 100)) / 12
    const monthlyManagement = (purchaseInputs.monthlyRent * purchaseInputs.managementFee) / 100
    const monthlyCosts = monthlyMortgage + monthlyManagement + purchaseInputs.maintenance + 
                        purchaseInputs.insurance + purchaseInputs.groundRent + purchaseInputs.serviceCharge
    const monthlyCashFlow = purchaseInputs.monthlyRent - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const totalInvestment = purchaseInputs.deposit + purchaseInputs.stampDuty + purchaseInputs.surveyFees +
                           purchaseInputs.legalFees + purchaseInputs.brokerFees + purchaseInputs.refurbCost
    const roi = (annualCashFlow / totalInvestment) * 100
    const grossYield = ((purchaseInputs.monthlyRent * 12) / purchaseInputs.purchasePrice) * 100
    const netYield = (annualCashFlow / purchaseInputs.purchasePrice) * 100
    const ltv = (loanAmount / purchaseInputs.purchasePrice) * 100

    return {
      monthlyCashFlow,
      annualCashFlow,
      roi,
      grossYield,
      netYield,
      totalInvestment,
      monthlyMortgage,
      ltv,
    }
  }

  // Calculate Rent to SA Results
  const calculateRentToSA = () => {
    const daysPerMonth = 30
    const occupiedDays = (daysPerMonth * rentToSAInputs.occupancyRate) / 100
    const totalRooms = rentToSAInputs.numberOfRooms
    const monthlyRevenue = occupiedDays * rentToSAInputs.nightlyRatePerRoom * totalRooms
    
    const bookingsPerMonth = (occupiedDays * totalRooms) / 3 // Assume 3-day average stay
    const monthlyCleaning = bookingsPerMonth * rentToSAInputs.cleaningPerBooking
    const monthlyManagementCost = (monthlyRevenue * rentToSAInputs.management) / 100
    
    const monthlyCosts = rentToSAInputs.monthlyRent + monthlyCleaning + rentToSAInputs.utilities +
                        rentToSAInputs.councilTax + rentToSAInputs.internet + rentToSAInputs.supplies +
                        monthlyManagementCost
    const monthlyCashFlow = monthlyRevenue - monthlyCosts
    const annualCashFlow = monthlyCashFlow * 12
    const annualRevenue = monthlyRevenue * 12
    const uplift = ((monthlyRevenue - rentToSAInputs.monthlyRent) / rentToSAInputs.monthlyRent) * 100

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyCashFlow,
      annualCashFlow,
      uplift,
      occupiedDays: Math.round(occupiedDays),
    }
  }

  const btlResults = calculateBTL()
  const brrResults = calculateBRR()
  const hmoResults = calculateHMO()
  const flipResults = calculateFlip()
  const holidayLetResults = calculateHolidayLet()
  const purchaseResults = calculatePurchase()
  const rentToSAResults = calculateRentToSA()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Investment Calculators</h1>
          <p className="text-lg text-gray-600">
            Choose a calculator strategy and analyze your deal
          </p>
          {propertyAddress && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-primary-600 font-semibold mb-1">Analyzing Property:</p>
              <p className="text-gray-900 font-medium">{propertyAddress}</p>
              <p className="text-sm text-gray-600 mt-1">
                Values have been pre-filled. Adjust assumptions as needed.
              </p>
            </div>
          )}
        </div>

        {/* Calculator Type Selector */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Calculator</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setCalculatorType('brr')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'brr'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Repeat className={`h-6 w-6 mb-2 ${calculatorType === 'brr' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Buy Refurbish Refinance</h3>
              <p className="text-xs text-gray-600">For properties you intend to refurb, pull money out and rent out</p>
            </button>

            <button
              onClick={() => setCalculatorType('flip')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'flip'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <TrendingDown className={`h-6 w-6 mb-2 ${calculatorType === 'flip' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Flip</h3>
              <p className="text-xs text-gray-600">For properties you intend to refurb and sell at a profit</p>
            </button>

            <button
              onClick={() => setCalculatorType('btl')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'btl'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Home className={`h-6 w-6 mb-2 ${calculatorType === 'btl' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Standard Buy to Let</h3>
              <p className="text-xs text-gray-600">For properties you intend to buy ready to rent out</p>
            </button>

            <button
              onClick={() => setCalculatorType('holiday-let')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'holiday-let'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Plane className={`h-6 w-6 mb-2 ${calculatorType === 'holiday-let' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Holiday Let</h3>
              <p className="text-xs text-gray-600">For properties you intend to buy and let out on a short term basis</p>
            </button>

            <button
              onClick={() => setCalculatorType('purchase')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'purchase'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ShoppingCart className={`h-6 w-6 mb-2 ${calculatorType === 'purchase' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Purchase</h3>
              <p className="text-xs text-gray-600">Full calculator with all options for purchasing a property</p>
            </button>

            <button
              onClick={() => setCalculatorType('rent-to-sa')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'rent-to-sa'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building className={`h-6 w-6 mb-2 ${calculatorType === 'rent-to-sa' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Rent to Serviced Accommodation</h3>
              <p className="text-xs text-gray-600">For properties you intend to rent and let out on a short term basis</p>
            </button>

            <button
              onClick={() => setCalculatorType('hmo')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                calculatorType === 'hmo'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className={`h-6 w-6 mb-2 ${calculatorType === 'hmo' ? 'text-primary-600' : 'text-gray-600'}`} />
              <h3 className="font-bold text-gray-900 mb-1">Rent to HMO</h3>
              <p className="text-xs text-gray-600">For properties you intend to rent and let out to multiple people</p>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs Column */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary-600" />
              {calculatorType === 'btl' && 'BTL Calculator'}
              {calculatorType === 'brr' && 'BRR Calculator'}
              {calculatorType === 'hmo' && 'HMO Calculator'}
              {calculatorType === 'flip' && 'Flip Calculator'}
              {calculatorType === 'holiday-let' && 'Holiday Let Calculator'}
              {calculatorType === 'purchase' && 'Purchase Calculator'}
              {calculatorType === 'rent-to-sa' && 'Rent to SA Calculator'}
            </h2>

            {/* BTL Inputs */}
            {calculatorType === 'btl' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={btlInputs.purchasePrice} onChange={(v) => setBtlInputs({ ...btlInputs, purchasePrice: v })} />
                <InputField label="Deposit (£)" value={btlInputs.deposit} onChange={(v) => setBtlInputs({ ...btlInputs, deposit: v })} />
                <InputField label="Stamp Duty (£)" value={btlInputs.stampDuty} onChange={(v) => setBtlInputs({ ...btlInputs, stampDuty: v })} />
                <InputField label="Refurbishment (£)" value={btlInputs.refurb} onChange={(v) => setBtlInputs({ ...btlInputs, refurb: v })} />
                <InputField label="Legal Fees (£)" value={btlInputs.legalFees} onChange={(v) => setBtlInputs({ ...btlInputs, legalFees: v })} />
                <InputField label="Monthly Rent (£)" value={btlInputs.monthlyRent} onChange={(v) => setBtlInputs({ ...btlInputs, monthlyRent: v })} />
                <InputField label="Management Fee (%)" value={btlInputs.managementFee} onChange={(v) => setBtlInputs({ ...btlInputs, managementFee: v })} />
                <InputField label="Monthly Maintenance (£)" value={btlInputs.maintenance} onChange={(v) => setBtlInputs({ ...btlInputs, maintenance: v })} />
                <InputField label="Monthly Insurance (£)" value={btlInputs.insurance} onChange={(v) => setBtlInputs({ ...btlInputs, insurance: v })} />
                <InputField label="Mortgage Rate (%)" value={btlInputs.mortgageRate} onChange={(v) => setBtlInputs({ ...btlInputs, mortgageRate: v })} step={0.1} />
              </div>
            )}

            {/* BRR Inputs */}
            {calculatorType === 'brr' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={brrInputs.purchasePrice} onChange={(v) => setBrrInputs({ ...brrInputs, purchasePrice: v })} />
                <InputField label="Refurbishment Cost (£)" value={brrInputs.refurbCost} onChange={(v) => setBrrInputs({ ...brrInputs, refurbCost: v })} />
                <InputField label="After Repair Value (£)" value={brrInputs.afterRepairValue} onChange={(v) => setBrrInputs({ ...brrInputs, afterRepairValue: v })} />
                <InputField label="Initial Deposit (£)" value={brrInputs.deposit} onChange={(v) => setBrrInputs({ ...brrInputs, deposit: v })} />
                <InputField label="Refinance LTV (%)" value={brrInputs.refinanceLTV} onChange={(v) => setBrrInputs({ ...brrInputs, refinanceLTV: v })} />
                <InputField label="Stamp Duty (£)" value={brrInputs.stampDuty} onChange={(v) => setBrrInputs({ ...brrInputs, stampDuty: v })} />
                <InputField label="Legal Fees (£)" value={brrInputs.legalFees} onChange={(v) => setBrrInputs({ ...brrInputs, legalFees: v })} />
                <InputField label="Monthly Rent (£)" value={brrInputs.monthlyRent} onChange={(v) => setBrrInputs({ ...brrInputs, monthlyRent: v })} />
                <InputField label="Mortgage Rate (%)" value={brrInputs.mortgageRate} onChange={(v) => setBrrInputs({ ...brrInputs, mortgageRate: v })} step={0.1} />
              </div>
            )}

            {/* HMO Inputs */}
            {calculatorType === 'hmo' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={hmoInputs.purchasePrice} onChange={(v) => setHmoInputs({ ...hmoInputs, purchasePrice: v })} />
                <InputField label="Refurbishment Cost (£)" value={hmoInputs.refurbCost} onChange={(v) => setHmoInputs({ ...hmoInputs, refurbCost: v })} />
                <InputField label="Number of Rooms" value={hmoInputs.numberOfRooms} onChange={(v) => setHmoInputs({ ...hmoInputs, numberOfRooms: v })} />
                <InputField label="Rent per Room (£)" value={hmoInputs.rentPerRoom} onChange={(v) => setHmoInputs({ ...hmoInputs, rentPerRoom: v })} />
                <InputField label="Deposit (£)" value={hmoInputs.deposit} onChange={(v) => setHmoInputs({ ...hmoInputs, deposit: v })} />
                <InputField label="Stamp Duty (£)" value={hmoInputs.stampDuty} onChange={(v) => setHmoInputs({ ...hmoInputs, stampDuty: v })} />
                <InputField label="Monthly Utilities (£)" value={hmoInputs.utilities} onChange={(v) => setHmoInputs({ ...hmoInputs, utilities: v })} />
                <InputField label="Mortgage Rate (%)" value={hmoInputs.mortgageRate} onChange={(v) => setHmoInputs({ ...hmoInputs, mortgageRate: v })} step={0.1} />
              </div>
            )}

            {/* Flip Inputs */}
            {calculatorType === 'flip' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={flipInputs.purchasePrice} onChange={(v) => setFlipInputs({ ...flipInputs, purchasePrice: v })} />
                <InputField label="Refurbishment Cost (£)" value={flipInputs.refurbCost} onChange={(v) => setFlipInputs({ ...flipInputs, refurbCost: v })} />
                <InputField label="Selling Price (£)" value={flipInputs.sellingPrice} onChange={(v) => setFlipInputs({ ...flipInputs, sellingPrice: v })} />
                <InputField label="Stamp Duty (£)" value={flipInputs.stampDuty} onChange={(v) => setFlipInputs({ ...flipInputs, stampDuty: v })} />
                <InputField label="Legal Fees (£)" value={flipInputs.legalFees} onChange={(v) => setFlipInputs({ ...flipInputs, legalFees: v })} />
                <InputField label="Selling Fees (£)" value={flipInputs.sellingFees} onChange={(v) => setFlipInputs({ ...flipInputs, sellingFees: v })} />
                <InputField label="Holding Costs (£)" value={flipInputs.holdingCosts} onChange={(v) => setFlipInputs({ ...flipInputs, holdingCosts: v })} />
                <InputField label="Timescale (months)" value={flipInputs.timescale} onChange={(v) => setFlipInputs({ ...flipInputs, timescale: v })} />
              </div>
            )}

            {/* Holiday Let Inputs */}
            {calculatorType === 'holiday-let' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={holidayLetInputs.purchasePrice} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, purchasePrice: v })} />
                <InputField label="Deposit (£)" value={holidayLetInputs.deposit} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, deposit: v })} />
                <InputField label="Stamp Duty (£)" value={holidayLetInputs.stampDuty} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, stampDuty: v })} />
                <InputField label="Refurbishment (£)" value={holidayLetInputs.refurb} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, refurb: v })} />
                <InputField label="Nightly Rate (£)" value={holidayLetInputs.nightlyRate} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, nightlyRate: v })} />
                <InputField label="Occupancy Rate (%)" value={holidayLetInputs.occupancyRate} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, occupancyRate: v })} />
                <InputField label="Management Fee (%)" value={holidayLetInputs.managementFee} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, managementFee: v })} />
                <InputField label="Cleaning per Booking (£)" value={holidayLetInputs.cleaningPerBooking} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, cleaningPerBooking: v })} />
                <InputField label="Monthly Utilities (£)" value={holidayLetInputs.utilities} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, utilities: v })} />
                <InputField label="Mortgage Rate (%)" value={holidayLetInputs.mortgageRate} onChange={(v) => setHolidayLetInputs({ ...holidayLetInputs, mortgageRate: v })} step={0.1} />
              </div>
            )}

            {/* Purchase Calculator Inputs */}
            {calculatorType === 'purchase' && (
              <div className="space-y-4">
                <InputField label="Purchase Price (£)" value={purchaseInputs.purchasePrice} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, purchasePrice: v })} />
                <InputField label="Deposit (£)" value={purchaseInputs.deposit} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, deposit: v })} />
                <InputField label="Stamp Duty (£)" value={purchaseInputs.stampDuty} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, stampDuty: v })} />
                <InputField label="Survey Fees (£)" value={purchaseInputs.surveyFees} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, surveyFees: v })} />
                <InputField label="Legal Fees (£)" value={purchaseInputs.legalFees} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, legalFees: v })} />
                <InputField label="Broker Fees (£)" value={purchaseInputs.brokerFees} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, brokerFees: v })} />
                <InputField label="Refurbishment (£)" value={purchaseInputs.refurbCost} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, refurbCost: v })} />
                <InputField label="Monthly Rent (£)" value={purchaseInputs.monthlyRent} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, monthlyRent: v })} />
                <InputField label="Ground Rent (£/month)" value={purchaseInputs.groundRent} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, groundRent: v })} />
                <InputField label="Service Charge (£/month)" value={purchaseInputs.serviceCharge} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, serviceCharge: v })} />
                <InputField label="Mortgage Rate (%)" value={purchaseInputs.mortgageRate} onChange={(v) => setPurchaseInputs({ ...purchaseInputs, mortgageRate: v })} step={0.1} />
              </div>
            )}

            {/* Rent to SA Inputs */}
            {calculatorType === 'rent-to-sa' && (
              <div className="space-y-4">
                <InputField label="Monthly Rent to Landlord (£)" value={rentToSAInputs.monthlyRent} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, monthlyRent: v })} />
                <InputField label="Number of Rooms" value={rentToSAInputs.numberOfRooms} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, numberOfRooms: v })} />
                <InputField label="Nightly Rate per Room (£)" value={rentToSAInputs.nightlyRatePerRoom} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, nightlyRatePerRoom: v })} />
                <InputField label="Occupancy Rate (%)" value={rentToSAInputs.occupancyRate} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, occupancyRate: v })} />
                <InputField label="Cleaning per Booking (£)" value={rentToSAInputs.cleaningPerBooking} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, cleaningPerBooking: v })} />
                <InputField label="Monthly Utilities (£)" value={rentToSAInputs.utilities} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, utilities: v })} />
                <InputField label="Council Tax (£/month)" value={rentToSAInputs.councilTax} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, councilTax: v })} />
                <InputField label="Internet (£/month)" value={rentToSAInputs.internet} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, internet: v })} />
                <InputField label="Supplies (£/month)" value={rentToSAInputs.supplies} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, supplies: v })} />
                <InputField label="Management Fee (%)" value={rentToSAInputs.management} onChange={(v) => setRentToSAInputs({ ...rentToSAInputs, management: v })} />
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl shadow-lg border-2 border-primary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Results</h2>
              <button
                onClick={() => {
                  if (calculatorType === 'btl') {
                    exportBTLToPDF({ ...btlInputs, results: btlResults })
                  } else if (calculatorType === 'brr') {
                    exportBRRToPDF({ ...brrInputs, results: brrResults })
                  } else if (calculatorType === 'hmo') {
                    exportHMOToPDF({ ...hmoInputs, results: hmoResults })
                  } else if (calculatorType === 'flip') {
                    exportFlipToPDF({ ...flipInputs, results: flipResults })
                  } else if (calculatorType === 'holiday-let') {
                    exportHolidayLetToPDF({ ...holidayLetInputs, results: holidayLetResults })
                  } else if (calculatorType === 'purchase') {
                    exportPurchaseToPDF({ ...purchaseInputs, results: purchaseResults })
                  }
                }}
                className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>

            {/* BTL Results */}
            {calculatorType === 'btl' && (
              <div className="space-y-4">
                <ResultCard label="Monthly Cash Flow" value={`£${btlResults.monthlyCashFlow.toFixed(2)}`} positive={btlResults.monthlyCashFlow >= 0} />
                <ResultCard label="Annual Cash Flow" value={`£${btlResults.annualCashFlow.toFixed(2)}`} positive={btlResults.annualCashFlow >= 0} />
                <ResultCard label="ROI" value={`${btlResults.roi.toFixed(2)}%`} positive={btlResults.roi >= 0} />
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard label="Gross Yield" value={`${btlResults.grossYield.toFixed(2)}%`} />
                  <ResultCard label="Net Yield" value={`${btlResults.netYield.toFixed(2)}%`} />
                </div>
                <ResultCard label="Total Investment" value={`£${btlResults.totalInvestment.toLocaleString()}`} />
              </div>
            )}

            {/* BRR Results */}
            {calculatorType === 'brr' && (
              <div className="space-y-4">
                <ResultCard label="Capital Extracted" value={`£${brrResults.capitalExtracted.toFixed(2)}`} positive />
                <ResultCard label="Left in Deal" value={`£${brrResults.leftInDeal.toFixed(2)}`} />
                <ResultCard label="Monthly Cash Flow" value={`£${brrResults.monthlyCashFlow.toFixed(2)}`} positive={brrResults.monthlyCashFlow >= 0} />
                <ResultCard label="ROI" value={brrResults.roi === Infinity ? '∞%' : `${brrResults.roi.toFixed(2)}%`} positive={brrResults.roi >= 0} />
                <ResultCard label="Gross Yield (ARV)" value={`${brrResults.grossYield.toFixed(2)}%`} />
              </div>
            )}

            {/* HMO Results */}
            {calculatorType === 'hmo' && (
              <div className="space-y-4">
                <ResultCard label="Total Monthly Rent" value={`£${hmoResults.totalMonthlyRent.toFixed(2)}`} positive />
                <ResultCard label="Monthly Cash Flow" value={`£${hmoResults.monthlyCashFlow.toFixed(2)}`} positive={hmoResults.monthlyCashFlow >= 0} />
                <ResultCard label="Annual Cash Flow" value={`£${hmoResults.annualCashFlow.toFixed(2)}`} positive={hmoResults.annualCashFlow >= 0} />
                <ResultCard label="ROI" value={`${hmoResults.roi.toFixed(2)}%`} positive={hmoResults.roi >= 0} />
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard label="Gross Yield" value={`${hmoResults.grossYield.toFixed(2)}%`} />
                  <ResultCard label="Net Yield" value={`${hmoResults.netYield.toFixed(2)}%`} />
                </div>
              </div>
            )}

            {/* Flip Results */}
            {calculatorType === 'flip' && (
              <div className="space-y-4">
                <ResultCard label="Total Costs" value={`£${flipResults.totalCosts.toLocaleString()}`} />
                <ResultCard label="Profit" value={`£${flipResults.profit.toFixed(2)}`} positive={flipResults.profit >= 0} />
                <ResultCard label="ROI" value={`${flipResults.roi.toFixed(2)}%`} positive={flipResults.roi >= 0} />
                <ResultCard label="Profit Margin" value={`${flipResults.profitMargin.toFixed(2)}%`} positive={flipResults.profitMargin >= 0} />
              </div>
            )}

            {/* Holiday Let Results */}
            {calculatorType === 'holiday-let' && (
              <div className="space-y-4">
                <ResultCard label="Monthly Revenue" value={`£${holidayLetResults.monthlyRevenue.toFixed(2)}`} positive />
                <ResultCard label="Annual Revenue" value={`£${holidayLetResults.annualRevenue.toFixed(2)}`} positive />
                <ResultCard label="Occupied Days/Year" value={`${holidayLetResults.occupiedDays}`} />
                <ResultCard label="Monthly Cash Flow" value={`£${holidayLetResults.monthlyCashFlow.toFixed(2)}`} positive={holidayLetResults.monthlyCashFlow >= 0} />
                <ResultCard label="Annual Cash Flow" value={`£${holidayLetResults.annualCashFlow.toFixed(2)}`} positive={holidayLetResults.annualCashFlow >= 0} />
                <ResultCard label="ROI" value={`${holidayLetResults.roi.toFixed(2)}%`} positive={holidayLetResults.roi >= 0} />
                <ResultCard label="Gross Yield" value={`${holidayLetResults.grossYield.toFixed(2)}%`} />
              </div>
            )}

            {/* Purchase Calculator Results */}
            {calculatorType === 'purchase' && (
              <div className="space-y-4">
                <ResultCard label="Total Investment" value={`£${purchaseResults.totalInvestment.toLocaleString()}`} />
                <ResultCard label="LTV" value={`${purchaseResults.ltv.toFixed(2)}%`} />
                <ResultCard label="Monthly Cash Flow" value={`£${purchaseResults.monthlyCashFlow.toFixed(2)}`} positive={purchaseResults.monthlyCashFlow >= 0} />
                <ResultCard label="Annual Cash Flow" value={`£${purchaseResults.annualCashFlow.toFixed(2)}`} positive={purchaseResults.annualCashFlow >= 0} />
                <ResultCard label="ROI" value={`${purchaseResults.roi.toFixed(2)}%`} positive={purchaseResults.roi >= 0} />
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard label="Gross Yield" value={`${purchaseResults.grossYield.toFixed(2)}%`} />
                  <ResultCard label="Net Yield" value={`${purchaseResults.netYield.toFixed(2)}%`} />
                </div>
              </div>
            )}

            {/* Rent to SA Results */}
            {calculatorType === 'rent-to-sa' && (
              <div className="space-y-4">
                <ResultCard label="Monthly Revenue" value={`£${rentToSAResults.monthlyRevenue.toFixed(2)}`} positive />
                <ResultCard label="Annual Revenue" value={`£${rentToSAResults.annualRevenue.toFixed(2)}`} positive />
                <ResultCard label="Occupied Days/Month" value={`${rentToSAResults.occupiedDays}`} />
                <ResultCard label="Monthly Cash Flow" value={`£${rentToSAResults.monthlyCashFlow.toFixed(2)}`} positive={rentToSAResults.monthlyCashFlow >= 0} />
                <ResultCard label="Annual Cash Flow" value={`£${rentToSAResults.annualCashFlow.toFixed(2)}`} positive={rentToSAResults.annualCashFlow >= 0} />
                <ResultCard label="Uplift vs Rent" value={`${rentToSAResults.uplift.toFixed(2)}%`} positive />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function InputField({ 
  label, 
  value, 
  onChange, 
  step = 1 
}: { 
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  )
}

function ResultCard({ 
  label, 
  value, 
  positive 
}: { 
  label: string
  value: string
  positive?: boolean
}) {
  const colorClass = positive === true 
    ? 'text-green-600' 
    : positive === false 
    ? 'text-red-600' 
    : 'text-gray-900'
    
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
