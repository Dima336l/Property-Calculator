'use client'

import { useState, useEffect } from 'react'
import { MapPin, Bed, Bath, Home, Ruler, Calendar, TrendingUp, Star, FileText, Mail, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Property {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  description: string
  imageUrl?: string
  postcode: string
  url: string
  listedDate: string
  flags: string[]
  yield?: number
  priceReduction?: number
  // Enhanced fields
  squareFeet?: number
  tenure?: string
  councilTaxBand?: string
  epcRating?: string
  hasGarden?: boolean
  hasParking?: boolean
  furnishing?: string
  lettingStatus?: string
  floorArea?: number
  receptionRooms?: number
  keyFeatures?: string[]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          setProperty(data.property)
          
          // Fetch detailed information if we have a URL
          if (data.property.url) {
            setLoadingDetails(true)
            try {
              const detailsResponse = await fetch(
                `/api/properties/${params.id}/details?url=${encodeURIComponent(data.property.url)}`
              )
              const detailsData = await detailsResponse.json()
              
              if (detailsData.success && detailsData.details) {
                // Merge detailed information with property
                setProperty(prev => prev ? { ...prev, ...detailsData.details } : null)
              }
            } catch (detailsErr) {
              console.error('Error fetching property details:', detailsErr)
              // Don't show error, just log it - basic property info is still available
            } finally {
              setLoadingDetails(false)
            }
          }
        } else {
          setError(data.error || 'Property not found')
        }
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/search" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Search
          </Link>
          <div className="card text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Home className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-red-600 text-lg mb-4">{error || 'Property not found'}</p>
            <div className="max-w-md mx-auto space-y-3 text-gray-600">
              <p>This could happen because:</p>
              <ul className="text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>The cached data has expired (cache refreshes every 30 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>The property listing has been removed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>You may have bookmarked an old link</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Link href="/search" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Search
              </Link>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-secondary inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/search" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-semibold group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        {/* Property Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors">
                  <Star className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-3">
                {property.postcode}
              </p>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Home className="h-5 w-5" />
                <span className="font-semibold">{property.propertyType}</span>
              </div>

              {property.flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {property.flags.map((flag) => (
                    <span key={flag} className="badge-primary">
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-80 bg-gradient-to-br from-primary-50 via-white to-primary-50/50 p-6 rounded-2xl border-2 border-primary-300 shadow-lg">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Asking Price</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  £{property.price?.toLocaleString()}
                </p>
                {property.priceReduction && property.priceReduction > 0 && (
                  <div className="badge-success mt-2 inline-block">
                    <p className="text-xs mb-0.5">Reduced by</p>
                    <p className="text-sm font-bold">£{property.priceReduction.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {property.yield && property.yield > 0 && (
                <div className="mb-4 pb-4 border-b-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Estimated Yield</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-600">{property.yield.toFixed(1)}</p>
                    <p className="text-xl font-bold text-green-600">%</p>
                  </div>
                  <p className="text-xs text-gray-500">per annum</p>
                </div>
              )}

              <div className="space-y-2">
                <Link 
                  href={`/calculators?propertyId=${property.id}&price=${property.price}&beds=${property.bedrooms}&baths=${property.bathrooms}&address=${encodeURIComponent(property.address)}&city=${encodeURIComponent(property.postcode || '')}&propertyType=${encodeURIComponent(property.propertyType)}&tenure=${encodeURIComponent(property.tenure || '')}&councilTaxBand=${encodeURIComponent(property.councilTaxBand || '')}&epcRating=${encodeURIComponent(property.epcRating || '')}&squareFeet=${property.squareFeet || 0}&hasGarden=${property.hasGarden ? '1' : '0'}&hasParking=${property.hasParking ? '1' : '0'}&furnishing=${encodeURIComponent(property.furnishing || '')}&lettingStatus=${encodeURIComponent(property.lettingStatus || '')}&receptionRooms=${property.receptionRooms || 0}`}
                  className="btn-primary w-full text-center block"
                >
                  {loadingDetails ? 'Loading Details...' : 'Analyse Deal'}
                </Link>
                <Link 
                  href={`/packaging?propertyId=${property.id}`}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Generate Brochure
                </Link>
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Property Images</h2>
            {property.url && (
              <a 
                href={property.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all font-semibold text-sm"
              >
                <span>View on Rightmove</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.address}
                className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                  const placeholder = target.nextElementSibling as HTMLElement
                  if (placeholder) placeholder.style.display = 'flex'
                }}
              />
            ) : null}
            <div className={`w-full aspect-video flex flex-col items-center justify-center gap-3 ${property.imageUrl ? 'hidden' : 'flex'}`}>
              <div className="p-4 bg-white/50 backdrop-blur-sm rounded-full">
                <Home className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No image available</p>
              <p className="text-sm text-gray-500">Check the original listing for photos</p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Description</h2>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{property.description}</p>

          {property.keyFeatures && property.keyFeatures.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {property.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Details</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Listed Date</p>
                <p className="font-semibold text-gray-900">{property.listedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Home className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-semibold text-gray-900">{property.propertyType}</p>
              </div>
            </div>
            {property.tenure && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="font-semibold text-gray-900">{property.tenure}</p>
                </div>
              </div>
            )}
            {property.squareFeet && property.squareFeet > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Ruler className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Floor Area</p>
                  <p className="font-semibold text-gray-900">{property.squareFeet.toLocaleString()} sq ft</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Features */}
          {(property.hasGarden || property.hasParking) && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Additional Features</h3>
              <div className="flex gap-3 flex-wrap">
                {property.hasGarden && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                    🏡 Garden
                  </span>
                )}
                {property.hasParking && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                    🚗 Parking
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


