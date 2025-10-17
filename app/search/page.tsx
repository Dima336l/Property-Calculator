'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Bed, Bath, Home, TrendingDown, RefreshCw, AlertCircle, Calendar, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Import the Property type
interface Property {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  status?: string
  yield?: number
  imageUrl?: string
  listedDate: string
  priceReduction?: number
  flags: string[]
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('Manchester')
  const [showFilters, setShowFilters] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cached, setCached] = useState(false)
  const [source, setSource] = useState<'rightmove' | 'zoopla'>('rightmove')
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    needsModernisation: false,
    backOnMarket: false,
    reducedPrice: false,
    repossessed: false,
    negativeEquity: false,
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        location: searchQuery,
        source: source,
      })

      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
      if (filters.propertyType && filters.propertyType !== '') {
        params.set('propertyType', filters.propertyType)
      }

      const response = await fetch(`/api/properties/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        let filteredProps = data.properties

        // Apply frontend filters
        if (filters.needsModernisation) {
          filteredProps = filteredProps.filter((p: Property) =>
            p.flags.includes('Needs Modernisation')
          )
        }
        if (filters.reducedPrice) {
          filteredProps = filteredProps.filter((p: Property) =>
            p.flags.includes('Reduced in Price')
          )
        }

        setProperties(filteredProps)
        setCached(data.cached || false)
      } else {
        setError(data.error || 'Failed to fetch properties')
        setProperties([])
      }
    } catch (err: any) {
      setError('Failed to search properties. Please try again.')
      console.error(err)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-search on mount
  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gradient mb-4 tracking-tight">
            Property Search
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            🔍 Live property data from UK property portals
          </p>
          {cached && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <span className="text-blue-600 text-sm font-semibold">📦 Cached results - refreshes every 30 minutes</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter location (e.g., Manchester, London)"
                  className="input-field pl-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as 'rightmove' | 'zoopla')}
              className="input-field min-w-[140px] cursor-pointer"
            >
              <option value="rightmove">🏠 Rightmove</option>
              <option value="zoopla">🔍 Zoopla</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 min-w-[120px] justify-center ${showFilters ? 'bg-primary-50 border-primary-700' : ''}`}
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="£0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="£500,000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="house">House</option>
                    <option value="flat">Flat</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Sourcing Filters</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'needsModernisation', label: 'Needs Modernisation', icon: RefreshCw },
                    { key: 'reducedPrice', label: 'Reduced in Price', icon: TrendingDown },
                  ].map(({ key, label, icon: Icon }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters[key as keyof typeof filters] as boolean}
                        onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? (
              'Searching...'
            ) : (
              <>
                Found <span className="font-semibold text-gray-900">{properties.length}</span> properties
              </>
            )}
          </p>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Scraping properties from {source}...</p>
            <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No properties found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="card card-hover cursor-pointer group overflow-hidden"
              >
                <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                  {property.imageUrl ? (
                    <img 
                      src={property.imageUrl} 
                      alt={property.address}
                      className="aspect-video w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`aspect-video flex flex-col items-center justify-center gap-2 ${property.imageUrl ? 'hidden' : 'flex'}`}>
                    <Home className="h-16 w-16 text-gray-400" />
                    <span className="text-sm text-gray-500">No image available</span>
                  </div>
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {property.flags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {property.flags.map((flag) => (
                        <span
                          key={flag}
                          className="badge-primary backdrop-blur-sm shadow-lg"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button 
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to favorites logic here
                    }}
                  >
                    <Star className="h-4 w-4 text-gray-700 hover:text-yellow-500 transition-colors" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                    {property.address}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Asking Price</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        £{property.price.toLocaleString()}
                      </p>
                    </div>
                    {property.priceReduction && (
                      <div className="badge-success px-3 py-2">
                        <p className="text-xs">Reduced</p>
                        <p className="font-bold">£{property.priceReduction.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-5 text-gray-600">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-50 rounded-lg">
                          <Bed className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-semibold">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-50 rounded-lg">
                          <Bath className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-semibold">{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                        <Home className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="font-semibold truncate">{property.propertyType}</span>
                    </div>
                  </div>

                  {property.yield && (
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Est. Yield</p>
                        <p className="text-2xl font-bold text-green-600">{property.yield.toFixed(1)}%</p>
                      </div>
                      <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-3 transition-all">
                        <span>View Details</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
