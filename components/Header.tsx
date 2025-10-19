'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, BarChart3, PieChart, FileText, Mail } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Property Calculator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Search
            </Link>
            <Link href="/calculators" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Calculators
            </Link>
            <Link href="/packaging" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Packaging
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/search"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/calculators"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculators
            </Link>
            <Link
              href="/packaging"
              className="block text-gray-700 hover:text-primary-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Packaging
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

