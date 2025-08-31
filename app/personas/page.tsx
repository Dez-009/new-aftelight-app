'use client'

import { useState } from 'react'
import { Plus, Users, Heart, Star, Settings } from 'lucide-react'
import { PersonasWizard } from '@/components/personas/PersonasWizard'
import { PersonasList } from '@/components/personas/PersonasList'

export default function PersonasPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [activeTab, setActiveTab] = useState<'personas' | 'wizard'>('personas')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/10 to-orange-300/10 dark:from-amber-600/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/10 to-pink-300/10 dark:from-rose-600/5 dark:to-pink-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent font-playfair mb-4">
              Personas Knowledge Base
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Preserve memories, build rich profiles, and create meaningful memorials
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-8">
              <button
                onClick={() => setActiveTab('personas')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'personas'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>My Personas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('wizard')}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'wizard'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Create New Persona</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-8">
            {activeTab === 'personas' ? (
              <PersonasList onCreateNew={() => setActiveTab('wizard')} />
            ) : (
              <PersonasWizard onComplete={() => setActiveTab('personas')} />
            )}
          </div>

          {/* Subscription Info */}
          <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                💎 Premium Features Available
              </h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Upgrade to unlock unlimited personas, AI-powered insights, and family collaboration
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-amber-600 dark:text-amber-400">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>AI Memory Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Family Collaboration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Advanced Customization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
