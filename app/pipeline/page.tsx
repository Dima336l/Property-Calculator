'use client'

import { useState } from 'react'
import { Plus, Star, Trash2, Edit2, MapPin, TrendingUp, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

type PropertyStatus = 'watching' | 'contacted' | 'viewing' | 'offer-made' | 'under-offer' | 'completed'

interface PipelineProperty {
  id: number
  address: string
  price: number
  status: PropertyStatus
  yield: number
  notes: string
  labels: string[]
  addedDate: string
}

export default function PipelinePage() {
  const [properties, setProperties] = useState<PipelineProperty[]>([
    {
      id: 1,
      address: '123 High Street, Manchester, M1 1AA',
      price: 185000,
      status: 'viewing',
      yield: 6.5,
      notes: 'Great potential, needs cosmetic work',
      labels: ['BTL', 'Reduced'],
      addedDate: '2025-02-10',
    },
    {
      id: 2,
      address: '456 Oak Avenue, Birmingham, B2 4AA',
      price: 220000,
      status: 'offer-made',
      yield: 7.2,
      notes: 'Offered £200k, waiting for response',
      labels: ['BRR', 'High Yield'],
      addedDate: '2025-02-08',
    },
    {
      id: 3,
      address: '789 Park Road, Leeds, LS1 2AB',
      price: 165000,
      status: 'watching',
      yield: 8.1,
      notes: 'HMO potential, check planning',
      labels: ['HMO', 'Modernisation'],
      addedDate: '2025-02-12',
    },
  ])

  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'all'>('all')

  const statusOptions: { value: PropertyStatus; label: string; color: string }[] = [
    { value: 'watching', label: 'Watching', color: 'bg-gray-100 text-gray-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
    { value: 'viewing', label: 'Viewing Arranged', color: 'bg-purple-100 text-purple-800' },
    { value: 'offer-made', label: 'Offer Made', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'under-offer', label: 'Under Offer', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  ]

  const filteredProperties =
    selectedStatus === 'all'
      ? properties
      : properties.filter((p) => p.status === selectedStatus)

  const getStatusBadge = (status: PropertyStatus) => {
    const statusOption = statusOptions.find((s) => s.value === status)
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusOption?.color}`}>
        {statusOption?.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Pipeline</h1>
            <p className="text-lg text-gray-600">
              Track and manage your property deals from discovery to completion
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-50 to-white">
            <p className="text-sm text-gray-600 mb-2">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-white">
            <p className="text-sm text-gray-600 mb-2">Active Viewings</p>
            <p className="text-3xl font-bold text-blue-600">
              {properties.filter((p) => p.status === 'viewing').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-white">
            <p className="text-sm text-gray-600 mb-2">Offers Made</p>
            <p className="text-3xl font-bold text-yellow-600">
              {properties.filter((p) => p.status === 'offer-made' || p.status === 'under-offer').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-white">
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {properties.filter((p) => p.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({properties.length})
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label} ({properties.filter((p) => p.status === status.value).length})
              </button>
            ))}
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No properties in this status</p>
              <button className="btn-primary">
                <Plus className="inline h-5 w-5 mr-2" />
                Add Your First Property
              </button>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link
                          href={`/property/${property.id}`}
                          className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {property.address}
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Added {property.addedDate}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(property.status)}
                      {property.labels.map((label) => (
                        <span
                          key={label}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {label}
                        </span>
                      ))}
                    </div>

                    {property.notes && (
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold">Notes:</span> {property.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-gray-900">£{property.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Yield</p>
                        <p className="text-2xl font-bold text-green-600">{property.yield}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link
                      href={`/property/${property.id}`}
                      className="btn-secondary flex items-center justify-center gap-2 flex-1 lg:flex-initial"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/calculators"
                      className="btn-secondary flex items-center justify-center gap-2 flex-1 lg:flex-initial"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Analyse
                    </Link>
                    <button className="btn-secondary flex items-center justify-center gap-2 flex-1 lg:flex-initial">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button className="p-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

