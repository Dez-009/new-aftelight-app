'use client'

import { useState } from 'react'
import { DowngradeHandler } from '@/components/personas/DowngradeHandler'
import { PersonasList } from '@/components/personas/PersonasList'

// Mock personas for demo
const mockPersonas = [
  {
    id: '1',
    name: 'Margaret Johnson',
    relationshipToUser: 'Grandmother',
    isPublic: false,
    memoriesCount: 12,
    photosCount: 8,
    voiceRecordingsCount: 3,
    priorityOrder: 5,
    storageUsed: 45
  },
  {
    id: '2',
    name: 'Robert Chen',
    relationshipToUser: 'Father',
    isPublic: false,
    memoriesCount: 8,
    photosCount: 15,
    voiceRecordingsCount: 2,
    priorityOrder: 4,
    storageUsed: 67
  },
  {
    id: '3',
    name: 'Sarah Williams',
    relationshipToUser: 'Mother',
    isPublic: false,
    memoriesCount: 15,
    photosCount: 22,
    voiceRecordingsCount: 5,
    priorityOrder: 3,
    storageUsed: 89
  },
  {
    id: '4',
    name: 'Michael Brown',
    relationshipToUser: 'Uncle',
    isPublic: false,
    memoriesCount: 6,
    photosCount: 12,
    voiceRecordingsCount: 1,
    priorityOrder: 2,
    storageUsed: 34
  },
  {
    id: '5',
    name: 'Emily Davis',
    relationshipToUser: 'Sister',
    isPublic: false,
    memoriesCount: 9,
    photosCount: 18,
    voiceRecordingsCount: 4,
    priorityOrder: 1,
    storageUsed: 56
  }
]

export default function DowngradeDemoPage() {
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)
  const [currentTier, setCurrentTier] = useState<'premium' | 'religious' | 'healthcare'>('premium')

  const handleDowngrade = () => {
    // In real app, this would update the user's subscription
    console.log('User downgraded from', currentTier, 'to free')
    setShowDowngradeModal(false)
    // Show success message or redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/10 to-orange-300/10 dark:from-amber-600/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/10 to-pink-300/10 dark:from-rose-600/5 dark:to-rose-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent font-playfair mb-4">
              Downgrade Handling Demo
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See how AfterLight handles subscription changes and protects user data
            </p>
          </div>

          {/* Demo Controls */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Current Subscription: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                    {mockPersonas.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Personas Created
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {currentTier === 'premium' ? 5 : currentTier === 'religious' ? 25 : 50}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Tier Limit
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {Math.max(0, mockPersonas.length - (currentTier === 'premium' ? 5 : currentTier === 'religious' ? 25 : 50))}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Over Limit
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setCurrentTier('premium')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentTier === 'premium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Premium (5 personas)
                  </button>
                  
                  <button
                    onClick={() => setCurrentTier('religious')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentTier === 'religious'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Religious (25 personas)
                  </button>
                  
                  <button
                    onClick={() => setCurrentTier('healthcare')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentTier === 'healthcare'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Healthcare (50 personas)
                  </button>
                </div>

                <button
                  onClick={() => setShowDowngradeModal(true)}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Simulate Downgrade to Free
                </button>
              </div>
            </div>
          </div>

          {/* Personas List */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-8">
            <PersonasList onCreateNew={() => alert('Create new persona functionality')} />
          </div>

          {/* Downgrade Info */}
          <div className="mt-8 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl border border-red-200 dark:border-red-700 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                🔒 Downgrade Protection
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                AfterLight never deletes your data. When you downgrade, excess personas become read-only until you upgrade again.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-red-600 dark:text-red-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Fully Accessible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Read-Only (Locked)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                  <span>Upgrade Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downgrade Modal */}
      {showDowngradeModal && (
        <DowngradeHandler
          currentTier={currentTier}
          newTier="free"
          personas={mockPersonas}
          currentStorageUsage={mockPersonas.reduce((total, p) => total + p.storageUsed, 0)}
          onConfirmDowngrade={handleDowngrade}
          onCancel={() => setShowDowngradeModal(false)}
        />
      )}
    </div>
  )
}
