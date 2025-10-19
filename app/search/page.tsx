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
  const [currentLocation, setCurrentLocation] = useState('') // Track what's currently displayed
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
    maxPages: '3', // How many pages to scrape
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location')
      return
    }

    try {
      // Clear everything BEFORE making the request
      setLoading(true)
      setProperties([])
      setCurrentLocation('')
      setError('')
      setCached(false)
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 50))

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
      if (filters.maxPages) params.set('maxPages', filters.maxPages)

      const response = await fetch(`/api/properties/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        let filteredProps = data.properties

        // Check if we actually got results
        if (!filteredProps || filteredProps.length === 0) {
          console.log('⚠️ No properties returned from search')
        }

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
        setCurrentLocation(searchQuery) // Update current location
        setCached(data.cached || false)
        
        // Show message if no results
        if (filteredProps.length === 0) {
          setError(`No properties found for "${searchQuery}". Try a different location or check your filters.`)
        }
      } else {
        setError(data.error || 'Failed to fetch properties')
        setProperties([])
        setCurrentLocation('')
      }
    } catch (err: any) {
      setError('Failed to search properties. Please try again.')
      console.error(err)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  // Get unique postcode areas from current properties
  const getUniquePostcodeAreas = () => {
    const postcodes = new Set<string>()
    properties.forEach(p => {
      const addressParts = p.address.split(',')
      const lastPart = addressParts[addressParts.length - 1]?.trim() || ''
      // Extract postcode area (e.g., "M20" from "M20 5DF" or just the area)
      const postcodeMatch = lastPart.match(/([A-Z]{1,2}\d{1,2}[A-Z]?)\s?\d?[A-Z]{0,2}/)
      if (postcodeMatch) {
        const area = postcodeMatch[1]
        postcodes.add(area)
      } else if (lastPart.length > 0 && lastPart.length < 10) {
        // Sometimes it's just an area name
        postcodes.add(lastPart)
      }
    })
    return Array.from(postcodes).sort().slice(0, 10)
  }

  // Auto-search on mount - disabled to prevent double searches
  // useEffect(() => {
  //   handleSearch()
  // }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Property Search
          </h1>
          <p className="text-gray-600">
            Search UK properties from Rightmove and Zoopla
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search by city (e.g., Manchester, London, Birmingham)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as 'rightmove' | 'zoopla')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer bg-white"
            >
              <option value="rightmove">Rightmove</option>
              <option value="zoopla">Zoopla</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pages to Scrape</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={filters.maxPages}
                    onChange={(e) => setFilters({ ...filters, maxPages: e.target.value })}
                  >
                    <option value="1">1 page (~24 props)</option>
                    <option value="3">3 pages (~72 props)</option>
                    <option value="5">5 pages (~120 props)</option>
                    <option value="10">10 pages (~240 props)</option>
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


        {/* Property Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-900 font-semibold text-lg mb-2">Searching: {searchQuery}</p>
            <p className="text-gray-600 font-medium">Scraping {filters.maxPages} page(s) from {source}...</p>
            <p className="text-sm text-gray-500 mt-2">
              Fetching up to {parseInt(filters.maxPages) * 24} properties
            </p>
            <p className="text-xs text-gray-400 mt-1">This may take {parseInt(filters.maxPages) * 10}-{parseInt(filters.maxPages) * 15} seconds</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">
              No properties found. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Show current location */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{properties.length}</span> properties in <span className="font-semibold text-primary-600">{currentLocation}</span>
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="relative aspect-video bg-gray-100">
                  {property.imageUrl ? (
                    <img 
                      src={property.imageUrl} 
                      alt={property.address}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  
                  {property.flags.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                        {property.flags[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {property.address}
                  </h3>

                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    £{property.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 truncate">
                      <Home className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{property.propertyType}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
