'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Mail, Image, TrendingUp, MapPin, Home, Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { exportPropertyBrochureToPDF, PropertyBrochureData, BrochureSettings } from '@/lib/pdf-export'

export default function PackagingPage() {
  const searchParams = useSearchParams()
  const [selectedProperty, setSelectedProperty] = useState<PropertyBrochureData>({
    address: '123 High Street, Manchester, M1 1AA',
    price: 185000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Terraced House',
    yield: 6.5,
    monthlyRent: 950,
    roi: 12.5,
    description: 'Excellent investment opportunity in a prime Manchester location. This property requires modernisation but offers strong rental yields and capital growth potential.',
  })

  const [propertyUrl, setPropertyUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)

  const [brochureSettings, setBrochureSettings] = useState<BrochureSettings>({
    includePhotos: true,
    includeFinancials: true,
    includeAreaData: true,
    includeComparables: true,
    yourName: 'John Smith',
    yourCompany: 'Property Investments Ltd',
    yourEmail: '[email protected]',
    yourPhone: '+44 7700 900000',
  })

  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('Generating PDF...')

  const handleScrapeProperty = async () => {
    if (!propertyUrl.trim()) return
    
    setIsScraping(true)
    try {
      const response = await fetch('/api/scrape-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: propertyUrl })
      })
      
      if (!response.ok) {
        throw new Error('Failed to scrape property data')
      }
      
      const propertyData = await response.json()
      
      console.log('Received property data:', propertyData)
      
      // Check if we got an error response
      if (propertyData.error) {
        throw new Error(propertyData.error)
      }
      
      // Ensure we have valid data with defaults
      const safePropertyData = {
        address: propertyData.address || 'Property Address',
        price: propertyData.price || 0,
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        propertyType: propertyData.propertyType || 'Property',
        yield: propertyData.yield || 0,
        monthlyRent: propertyData.monthlyRent || 0,
        roi: propertyData.roi || 0,
        description: propertyData.description || 'Property description not available.',
        keyFeatures: propertyData.keyFeatures || [],
        hasGarden: propertyData.hasGarden || false,
        hasParking: propertyData.hasParking || false,
        listedDate: propertyData.listedDate || new Date().toLocaleDateString(),
        squareFeet: propertyData.squareFeet || 0,
        tenure: propertyData.tenure || '',
        imageUrl: propertyData.imageUrl || '',
        images: propertyData.images || [] // Array of image URLs
      }
      
      console.log('Safe property data:', safePropertyData)
      setSelectedProperty(safePropertyData)
      setPropertyUrl('') // Clear the URL after successful scraping
    } catch (error) {
      console.error('Error scraping property:', error)
      alert('Failed to scrape property data. Please check the URL and try again.')
    } finally {
      setIsScraping(false)
    }
  }

  // Load property data from URL parameters
  useEffect(() => {
    const propertyId = searchParams.get('propertyId')
    const address = searchParams.get('address')
    const price = searchParams.get('price')
    const beds = searchParams.get('beds')
    const baths = searchParams.get('baths')
    const propertyType = searchParams.get('propertyType')

    if (propertyId && address && price) {
      setSelectedProperty({
        address: decodeURIComponent(address),
        price: parseInt(price),
        bedrooms: beds ? parseInt(beds) : 0,
        bathrooms: baths ? parseInt(baths) : 0,
        propertyType: propertyType ? decodeURIComponent(propertyType) : 'Property',
        yield: 0,
        monthlyRent: 0,
        roi: 0,
        description: 'Property details will be loaded from the property listing.',
      })
    }
  }, [searchParams])
  // Helper function to convert image URL to base64
  const imageUrlToBase64 = async (url: string): Promise<string> => {
    try {
      console.log(`Fetching image from URL: ${url}`)
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        }
      })
      
      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        return ''
      }
      
      const blob = await response.blob()
      console.log(`Image blob size: ${blob.size} bytes, type: ${blob.type}`)
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          console.log(`Base64 conversion successful, length: ${result.length}`)
          resolve(result)
        }
        reader.onerror = (error) => {
          console.error('FileReader error:', error)
          reject(error)
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error converting image to base64:', error)
      console.error('Image URL that failed:', url)
      return ''
    }
  }

  const handleDownloadPDF = async () => {
    setLoading(true)
    try {
      // Fetch AI verdict first
      setLoadingStatus('Analyzing property with AI...')
      let aiVerdict = undefined
      try {
        console.log('Fetching AI verdict for property:', selectedProperty.address)
        const verdictResponse = await fetch('/api/ai-verdict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ property: selectedProperty, calculationType: 'property-brochure' })
        })
        const verdictData = await verdictResponse.json()
        console.log('AI verdict response:', verdictData)
        if (verdictData.verdict) {
          aiVerdict = verdictData.verdict
          console.log('AI verdict received:', aiVerdict)
        }
      } catch (verdictError) {
        console.error('Failed to fetch AI verdict:', verdictError)
        // Continue with PDF generation even if AI verdict fails
      }

      // Convert images to base64 if we have them
      setLoadingStatus('Loading property images...')
      const propertyWithBase64Images = { ...selectedProperty }
      if (selectedProperty.images && selectedProperty.images.length > 0) {
        console.log(`Converting ${selectedProperty.images.length} images to base64...`)
        console.log('Image URLs to convert:', selectedProperty.images.slice(0, 3))
        const base64Images: string[] = []
        for (const imageUrl of selectedProperty.images.slice(0, 6)) {
          console.log(`Converting image: ${imageUrl}`)
          const base64 = await imageUrlToBase64(imageUrl)
          if (base64) {
            console.log(`Successfully converted image to base64 (length: ${base64.length})`)
            base64Images.push(base64)
          } else {
            console.log(`Failed to convert image: ${imageUrl}`)
          }
        }
        propertyWithBase64Images.images = base64Images
        console.log(`Converted ${base64Images.length} images to base64`)
      } else {
        console.log('No images found to convert')
      }

      setLoadingStatus('Generating PDF brochure...')
      await exportPropertyBrochureToPDF(propertyWithBase64Images, brochureSettings, undefined, aiVerdict)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStatus('Generating PDF...')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Deal Packaging & Brochures</h1>
          <p className="text-lg text-gray-600">
            Generate professional deal packages and brochures for your investors
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Brochure Settings</h2>

              {/* Property URL Input */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Source</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Property URL (Zoopla, Rightmove, etc.)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://www.zoopla.co.uk/for-sale/details/..."
                        value={propertyUrl}
                        onChange={(e) => setPropertyUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isScraping}
                      />
                      <button
                        onClick={handleScrapeProperty}
                        disabled={!propertyUrl.trim() || isScraping}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {isScraping ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                            Scraping...
                          </>
                        ) : (
                          'Scrape'
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Paste a property URL to automatically load property data
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Include in Brochure</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'includePhotos', label: 'Property Photos', icon: Image },
                      { key: 'includeFinancials', label: 'Financial Analysis', icon: TrendingUp },
                      { key: 'includeAreaData', label: 'Area Demographics', icon: MapPin },
                      { key: 'includeComparables', label: 'Sales Comparables', icon: Home },
                    ].map(({ key, label, icon: Icon }) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={brochureSettings[key as keyof typeof brochureSettings] as boolean}
                          onChange={(e) =>
                            setBrochureSettings({ ...brochureSettings, [key]: e.target.checked })
                          }
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={brochureSettings.yourName}
                        onChange={(e) =>
                          setBrochureSettings({ ...brochureSettings, yourName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={brochureSettings.yourCompany}
                        onChange={(e) =>
                          setBrochureSettings({ ...brochureSettings, yourCompany: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={brochureSettings.yourEmail}
                        onChange={(e) =>
                          setBrochureSettings({ ...brochureSettings, yourEmail: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={brochureSettings.yourPhone}
                        onChange={(e) =>
                          setBrochureSettings({ ...brochureSettings, yourPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {loadingStatus}
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Download PDF
                      </>
                    )}
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email to Investor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Brochure Preview</h2>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  Preview
                </span>
              </div>

              {/* Preview Content */}
              <div className="space-y-8">
                {/* Cover Page */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gradient-to-br from-primary-50 to-white">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunity</h1>
                    <p className="text-xl text-gray-600">{selectedProperty.address}</p>
                  </div>
                  <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-lg shadow-md">
                    <div>
                      <p className="text-sm text-gray-600">Asking Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        £{selectedProperty.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    {selectedProperty.yield && selectedProperty.yield > 0 && (
                      <>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Yield</p>
                          <p className="text-2xl font-bold text-green-600">{selectedProperty.yield}%</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Property Overview */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="h-6 w-6 text-primary-600" />
                    Property Overview
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedProperty.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedProperty.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedProperty.propertyType}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{selectedProperty.description}</p>
                  </div>
                </div>

                {/* Photos Section */}
                {brochureSettings.includePhotos && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Image className="h-6 w-6 text-primary-600" />
                      Property Photos
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedProperty.images && selectedProperty.images.length > 0 ? (
                        selectedProperty.images.slice(0, 4).map((imageUrl, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <img
                              src={imageUrl}
                              alt={`Property ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder on error
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>'
                                }
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        [1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center"
                          >
                            <Image className="h-12 w-12 text-gray-400" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Financial Analysis */}
                {brochureSettings.includeFinancials && (selectedProperty.monthlyRent || selectedProperty.roi || selectedProperty.yield) && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                      Financial Analysis
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedProperty.monthlyRent && selectedProperty.monthlyRent > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-600 mb-1">Monthly Rental Income</p>
                          <p className="text-3xl font-bold text-gray-900">
                            £{selectedProperty.monthlyRent?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                      )}
                      {selectedProperty.roi && selectedProperty.roi > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600 mb-1">Return on Investment</p>
                          <p className="text-3xl font-bold text-green-600">{selectedProperty.roi}%</p>
                        </div>
                      )}
                      {selectedProperty.yield && selectedProperty.yield > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-200">
                          <p className="text-sm text-gray-600 mb-1">Gross Yield</p>
                          <p className="text-3xl font-bold text-purple-600">{selectedProperty.yield}%</p>
                        </div>
                      )}
                      {selectedProperty.monthlyRent && selectedProperty.monthlyRent > 0 && (
                        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Annual Income</p>
                          <p className="text-3xl font-bold text-orange-600">
                            £{selectedProperty.monthlyRent ? (selectedProperty.monthlyRent * 12).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Investment Highlights */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Highlights</h3>
                  <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg border border-primary-200">
                    <div className="space-y-3">
                      {[
                        'High rental yield property in prime location',
                        'Strong demand for rental properties in the area',
                        'Excellent transport links and local amenities',
                        'Potential for value appreciation',
                        'Suitable for BTL or BRR strategy',
                      ].map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-primary-600 rounded-full p-1 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-gray-700">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-900 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{brochureSettings.yourName}</p>
                    <p className="text-gray-300">{brochureSettings.yourCompany}</p>
                    <p className="text-gray-300">{brochureSettings.yourEmail}</p>
                    <p className="text-gray-300">{brochureSettings.yourPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

