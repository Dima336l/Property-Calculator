import Link from 'next/link'
import { Search, TrendingUp, PieChart, FolderOpen, FileText, Mail, Check, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Property Investment Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Search properties, analyze deals, and make informed investment decisions with powerful calculators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Search Properties
              </Link>
              <Link href="/calculators" className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors">
                Use Calculators
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Everything you need
            </h2>
            <p className="text-gray-600">Tools to find and analyze property investments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Search className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Property Search
              </h3>
              <p className="text-gray-600 text-sm">
                Search UK properties from Rightmove and Zoopla with advanced filters for modernisation needs, price reductions, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <PieChart className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deal Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Use calculators for BTL, BRR, HMO, and more. Calculate ROI, cash flow, and yield instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <FileText className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deal Packaging
              </h3>
              <p className="text-gray-600 text-sm">
                Generate professional property brochures and deal packages to present to investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8 text-primary-100">
              Start searching and analyzing properties today.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 Property Calculator. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/search" className="hover:text-white transition-colors">Search</Link>
              <Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link>
              <Link href="/packaging" className="hover:text-white transition-colors">Packaging</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

