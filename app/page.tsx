import Image from 'next/image'
import Link from 'next/link'
import { AfterLightIcon } from '../components/AfterLightIcon'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <AfterLightIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-800 font-playfair">
                  AfterLight
                </h1>
              </div>
            </div>
                          <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Features
                  </Link>
                  <Link href="/planner/demo" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Demo
                  </Link>
                  <Link href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                    About
                  </Link>
                  <Link href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-playfair leading-tight">
              Honoring Life with
              <span className="block text-blue-600">Grace & Dignity</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A premium digital platform designed to help families plan funerals, memorials, 
              and celebrations of life with elegance and ease. Navigate difficult times with 
              compassion and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/planner/start"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Planning
              </Link>
              <Link
                href="#learn-more"
                className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-slate-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 font-playfair">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform guides you through every step of memorial planning 
              with sensitivity and support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Guided Planning</h3>
              <p className="text-slate-600">
                Step-by-step guidance through 7 comprehensive planning stages, 
                ensuring nothing is overlooked during this important process.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Cultural Sensitivity</h3>
              <p className="text-slate-600">
                Support for diverse religious and cultural traditions, 
                ensuring every family's unique needs are respected and honored.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600">
                Visual progress indicators and step-by-step guidance, 
                helping you stay organized and focused during planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 font-playfair">
                Why Choose AfterLight?
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We understand that planning a memorial service is one of the most 
                challenging experiences a family can face. Our platform was created 
                with compassion, respect, and the understanding that every family 
                deserves support during these difficult times.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                With AfterLight, you'll have access to comprehensive planning tools, 
                cultural guidance, and a supportive community that understands your needs. 
                We're here to help you create a meaningful tribute that honors your 
                loved one's memory.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-slate-600">Families Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-slate-600">Cultural Traditions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-slate-600">Support Available</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Compassionate Care</h3>
                  <p className="text-slate-600">
                    Every feature is designed with your emotional well-being in mind. 
                    We're here to support you through every step of this journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-playfair">
            Ready to Begin?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Start your memorial planning journey today. Our platform is here to guide 
            you with compassion and care every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planner/start"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Planning Now
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <AfterLightIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold font-playfair">AfterLight</h3>
              </div>
              <p className="text-slate-300">
                Honoring life with grace and dignity through compassionate memorial planning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/planner/start" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AfterLight. All rights reserved. Honoring life with grace and dignity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
