import Link from 'next/link'
import { Search, TrendingUp, PieChart, FolderOpen, FileText, Mail, Check, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Source property.{' '}
              <span className="text-primary-600">Fast.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find and analyse property deals <span className="font-semibold">fast</span>, built for property{' '}
              <span className="font-semibold">investors</span> and deal{' '}
              <span className="font-semibold">sourcers</span>.
            </p>
            <p className="text-lg text-gray-600 mb-10">
              Search across portals for <span className="font-semibold">BTLs</span>,{' '}
              <span className="font-semibold">BRRs</span>, <span className="font-semibold">HMOs</span>,{' '}
              <span className="font-semibold">Negative Equity</span>, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/search" className="btn-primary text-lg px-8 py-4">
                Start Searching Properties
              </Link>
              <Link href="/calculators" className="btn-secondary text-lg px-8 py-4">
                Explore Calculators
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg text-gray-600 mb-8">
            Trusted by 1,000+ deal sourcers and investors
          </h2>
          <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See how PropertyPro helps you find more deals
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Search for deals across UK property portals
              </h3>
              <p className="text-gray-600 mb-4">
                Use our sourcing filters to quickly find & set up instant email alerts for properties that are:
              </p>
              <ul className="space-y-2">
                {[
                  'In need of modernisation',
                  'Back on the market',
                  'Reduced in price',
                  'Repossessed',
                  'In potential negative equity',
                  'And more',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Understand the market with comparables & area data
              </h3>
              <p className="text-gray-600">
                Access detailed market analysis including recent sales comparables, rental yields, and comprehensive
                area demographics to make informed investment decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <PieChart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Analyse the deal and calculate ROI
              </h3>
              <p className="text-gray-600">
                Use our powerful calculators to analyze BTL, BRR, and HMO deals. Calculate ROI, cash flow, yield,
                and more with our intuitive deal analysis tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <FolderOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Keep track of properties in your pipeline
              </h3>
              <p className="text-gray-600">
                Organize and manage your property leads with our pipeline system. Label properties, add notes, and
                track progress from discovery to completion.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                One-click deal packaging and brochures
              </h3>
              <p className="text-gray-600">
                Generate professional deal packages and brochures instantly. Present your deals to investors with
                beautifully designed, data-rich documents.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 rounded-lg p-3 w-fit mb-4">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Send D2V letters to generate off-market leads
              </h3>
              <p className="text-gray-600">
                Send Direct to Vendor letters to property owners to generate exclusive off-market opportunities and
                build your own deal pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="inline h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl font-medium text-gray-900 mb-6">
              "Absolutely brilliant software. It makes an absolute breeze of searching through hundreds of
              properties. The list of features on this site is absurd. I can't recommend PropertyPro highly
              enough!"
            </blockquote>
            <cite className="text-gray-600 font-semibold">
              Andreas Andresen
              <span className="block text-sm text-gray-500 mt-1">Perfect10 Property Group</span>
            </cite>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-8">
              Find out everything you need to know about PropertyPro —
              the UK's best property sourcing tool for investors and deal sourcers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/whats-new" className="hover:text-white transition-colors">What's new</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="hover:text-white transition-colors">Sourcing</Link></li>
                <li><Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
                <li><Link href="/pipeline" className="hover:text-white transition-colors">Pipeline & Labels</Link></li>
                <li><Link href="/packaging" className="hover:text-white transition-colors">Deal Packaging</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li><Link href="/support" className="hover:text-white transition-colors">Support and Guides</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="hover:text-white transition-colors">Property Search</Link></li>
                <li><Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>[email protected] — Copyright © 2025 PropertyPro, All rights reserved</p>
            <div className="mt-4 space-x-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms & conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

