import { AfterLightIcon } from '../../components/AfterLightIcon'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AfterLight - Authentication',
  description: 'Sign in to your AfterLight account to begin your memorial planning journey.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-orange-300/20 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/20 to-pink-300/20 dark:from-rose-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200/10 to-amber-300/10 dark:from-yellow-600/5 dark:to-amber-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AfterLightIcon className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent font-playfair">
                AfterLight
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Honoring life with grace and dignity
            </p>
          </div>

          {/* Auth Form Container */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Made with compassion and care
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
