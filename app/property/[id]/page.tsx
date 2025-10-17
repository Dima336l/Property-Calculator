'use client'

import { useState, useEffect } from 'react'
import { MapPin, Bed, Bath, Home, Ruler, Calendar, TrendingUp, Star, FileText, Mail, ArrowLeft, Loader2 } from 'lucide-react'
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
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          setProperty(data.property)
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
            <p className="text-red-600 text-lg mb-4">{error || 'Property not found'}</p>
            <p className="text-gray-500">This property may no longer be available or was not found in the cache.</p>
            <Link href="/search" className="btn-primary inline-block mt-6">
              Return to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const comparables = [
    { address: '125 High Street', price: 195000, date: '2024-12-15', beds: 3 },
    { address: '119 High Street', price: 188000, date: '2024-11-20', beds: 3 },
    { address: '130 High Street', price: 205000, date: '2024-10-05', beds: 4 },
  ]

  const areaStats = {
    averagePrice: 192000,
    averageYield: 6.8,
    priceChange: 3.2,
    crimeRate: 'Low',
    schools: 'Good',
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors">
                  <Star className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                {property.postcode}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {property.flags.map((flag) => (
                  <span key={flag} className="badge-primary">
                    {flag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bed className="h-5 w-5" />
                    <span className="font-semibold">{property.bedrooms} beds</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bath className="h-5 w-5" />
                    <span className="font-semibold">{property.bathrooms} baths</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Home className="h-5 w-5" />
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
              </div>
            </div>

            <div className="lg:w-80 bg-gradient-to-br from-primary-50 via-white to-primary-50/50 p-8 rounded-2xl border-2 border-primary-300 shadow-lg">
                <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Asking Price</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  £{property.price?.toLocaleString()}
                </p>
                {property.priceReduction && property.priceReduction > 0 && (
                  <div className="badge-success mt-3 inline-block">
                    <p className="text-xs mb-0.5">Reduced by</p>
                    <p className="text-sm font-bold">£{property.priceReduction.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {property.yield && property.yield > 0 && (
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Estimated Yield</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-green-600">{property.yield.toFixed(1)}</p>
                    <p className="text-2xl font-bold text-green-600">%</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">per annum</p>
                </div>
              )}

              <div className="space-y-3">
                <Link 
                  href={`/calculators?propertyId=${property.id}&price=${property.price}&beds=${property.bedrooms}&address=${encodeURIComponent(property.address)}&city=${encodeURIComponent(property.postcode || '')}`}
                  className="btn-primary w-full text-center block"
                >
                  Analyse Deal
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

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="border-b-2 border-gray-100">
            <div className="flex gap-2 px-6">
              {['overview', 'comparables', 'area-data'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-bold capitalize transition-all relative ${
                    activeTab === tab
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  } rounded-t-xl`}
                >
                  {tab.replace('-', ' ')}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Description</h2>
                <p className="text-gray-600 mb-6">{property.description}</p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Listed Date</p>
                      <p className="font-semibold text-gray-900">{property.listedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-semibold text-gray-900">{property.propertyType}</p>
                    </div>
                  </div>
                  {property.listedDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Listed Date</p>
                        <p className="font-semibold text-gray-900">{property.listedDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'comparables' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Sales Comparables</h2>
                <div className="space-y-4">
                  {comparables.map((comp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{comp.address}</h3>
                          <p className="text-sm text-gray-600">{comp.beds} bedrooms</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">£{comp.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{comp.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'area-data' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Area Demographics</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card bg-gradient-to-br from-blue-50 to-white">
                    <p className="text-sm text-gray-600 mb-2">Average Property Price</p>
                    <p className="text-3xl font-bold text-gray-900">£{areaStats.averagePrice.toLocaleString()}</p>
                  </div>
                  <div className="card bg-gradient-to-br from-green-50 to-white">
                    <p className="text-sm text-gray-600 mb-2">Average Yield</p>
                    <p className="text-3xl font-bold text-green-600">{areaStats.averageYield}%</p>
                  </div>
                  <div className="card bg-gradient-to-br from-purple-50 to-white">
                    <p className="text-sm text-gray-600 mb-2">12 Month Price Change</p>
                    <p className="text-3xl font-bold text-purple-600">+{areaStats.priceChange}%</p>
                  </div>
                  <div className="card">
                    <p className="text-sm text-gray-600 mb-2">Crime Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{areaStats.crimeRate}</p>
                  </div>
                  <div className="card">
                    <p className="text-sm text-gray-600 mb-2">School Ratings</p>
                    <p className="text-2xl font-bold text-gray-900">{areaStats.schools}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

