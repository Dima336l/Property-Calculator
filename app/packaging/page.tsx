'use client'

import { useState } from 'react'
import { FileText, Download, Mail, Image, TrendingUp, MapPin, Home, Check } from 'lucide-react'

export default function PackagingPage() {
  const [selectedProperty, setSelectedProperty] = useState({
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

  const [brochureSettings, setBrochureSettings] = useState({
    includePhotos: true,
    includeFinancials: true,
    includeAreaData: true,
    includeComparables: true,
    yourName: 'John Smith',
    yourCompany: 'Property Investments Ltd',
    yourEmail: '[email protected]',
    yourPhone: '+44 7700 900000',
  })

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
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" />
                    Download PDF
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
                        £{selectedProperty.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Yield</p>
                      <p className="text-2xl font-bold text-green-600">{selectedProperty.yield}%</p>
                    </div>
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
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center"
                        >
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial Analysis */}
                {brochureSettings.includeFinancials && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                      Financial Analysis
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Monthly Rental Income</p>
                        <p className="text-3xl font-bold text-gray-900">
                          £{selectedProperty.monthlyRent.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Return on Investment</p>
                        <p className="text-3xl font-bold text-green-600">{selectedProperty.roi}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Gross Yield</p>
                        <p className="text-3xl font-bold text-purple-600">{selectedProperty.yield}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-600 mb-1">Annual Income</p>
                        <p className="text-3xl font-bold text-orange-600">
                          £{(selectedProperty.monthlyRent * 12).toLocaleString()}
                        </p>
                      </div>
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

