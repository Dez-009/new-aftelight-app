'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  ArrowUp, 
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Database
} from 'lucide-react'
import { SubscriptionRulesService, DowngradeImpact } from '@/lib/subscriptionRules'

interface Persona {
  id: string
  name: string
  relationshipToUser: string
  isPublic: boolean
  memoriesCount: number
  photosCount: number
  voiceRecordingsCount: number
  priorityOrder: number
  storageUsed: number
}

interface DowngradeHandlerProps {
  currentTier: 'premium' | 'religious' | 'healthcare'
  newTier: 'free'
  personas: Persona[]
  currentStorageUsage: number
  onConfirmDowngrade: (strategy: 'soft' | 'hard' | 'grace') => void
  onCancel: () => void
}

export function DowngradeHandler({ 
  currentTier, 
  newTier, 
  personas, 
  currentStorageUsage,
  onConfirmDowngrade, 
  onCancel 
}: DowngradeHandlerProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<'soft' | 'hard' | 'grace'>('soft')
  const [showStrategyComparison, setShowStrategyComparison] = useState(false)

  // Calculate downgrade impact using the service
  const downgradeImpact = SubscriptionRulesService.calculateDowngradeImpact(
    currentTier,
    newTier,
    personas.map(p => ({
      id: p.id,
      name: p.name,
      priorityOrder: p.priorityOrder,
      storageUsed: p.storageUsed
    })),
    currentStorageUsage
  )

  // Get strategy information
  const strategyInfo = SubscriptionRulesService.getDowngradeStrategy(selectedStrategy)

  // What happens to each persona based on selected strategy
  const getPersonaStatus = (index: number) => {
    if (index < downgradeImpact.accessiblePersonas) {
      return {
        status: 'accessible' as const,
        label: 'Fully Accessible',
        description: 'Can view, edit, and use in planning',
        icon: CheckCircle,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-800/20'
      }
    } else {
      if (selectedStrategy === 'soft') {
        return {
          status: 'locked' as const,
          label: 'Read-Only (Locked)',
          description: 'Can view but cannot edit or use in planning',
          icon: Lock,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-800/20'
        }
      } else if (selectedStrategy === 'hard') {
        return {
          status: 'deleted' as const,
          label: 'Will Be Deleted',
          description: 'Permanently removed from your account',
          icon: Trash2,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-800/20'
        }
      } else {
        return {
          status: 'grace' as const,
          label: 'Grace Period (30 days)',
          description: 'Temporary access with upgrade prompts',
          icon: Clock,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-100 dark:bg-amber-800/20'
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Subscription Downgrade Warning
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                You're about to downgrade from <span className="font-semibold text-amber-600">{currentTier}</span> to <span className="font-semibold text-slate-600">{newTier}</span>.
                This will affect access to your personas.
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Choose Your Downgrade Strategy
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {(['soft', 'hard', 'grace'] as const).map((strategy) => {
              const info = SubscriptionRulesService.getDowngradeStrategy(strategy)
              const isSelected = selectedStrategy === strategy
              
              return (
                <div
                  key={strategy}
                  onClick={() => setSelectedStrategy(strategy)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {strategy === 'soft' && <Shield className="w-5 h-5 text-amber-600" />}
                    {strategy === 'hard' && <Trash2 className="w-5 h-5 text-red-600" />}
                    {strategy === 'grace' && <Clock className="w-5 h-5 text-amber-600" />}
                    <h4 className="font-medium text-slate-900 dark:text-white">{info.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {info.description}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    <strong>Action:</strong> {info.action}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setShowStrategyComparison(!showStrategyComparison)}
            className="mt-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium"
          >
            {showStrategyComparison ? 'Hide Strategy Comparison' : 'Compare All Strategies'}
          </button>

          {showStrategyComparison && (
            <div className="mt-4 bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">Strategy Comparison</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {(['soft', 'hard', 'grace'] as const).map((strategy) => {
                  const info = SubscriptionRulesService.getDowngradeStrategy(strategy)
                  return (
                    <div key={strategy} className="space-y-2">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300">{info.name}</h5>
                      <div className="text-xs">
                        <div className="text-green-600 dark:text-green-400 mb-1">
                          <strong>Benefits:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {info.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-red-600 dark:text-red-400">
                          <strong>Drawbacks:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {info.drawbacks.map((drawback, i) => (
                              <li key={i}>{drawback}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Impact Summary */}
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
            Impact Summary: {strategyInfo.name}
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {downgradeImpact.totalPersonas}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Personas
              </div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {downgradeImpact.accessiblePersonas}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Fully Accessible
              </div>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                {downgradeImpact.lockedPersonas}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {selectedStrategy === 'soft' ? 'Read-Only' : selectedStrategy === 'hard' ? 'Deleted' : 'Grace Period'}
              </div>
            </div>

            <div className="text-center p-4 bg-white dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {downgradeImpact.storageImpact.currentUsage}MB
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Storage Used
              </div>
            </div>
          </div>

          {downgradeImpact.lockedPersonas > 0 && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-800/30 rounded-lg border border-red-200 dark:border-red-600">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                    Important: {downgradeImpact.lockedPersonas} persona(s) will be affected
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {strategyInfo.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {downgradeImpact.storageImpact.willExceed && (
            <div className="mt-4 p-4 bg-amber-100 dark:bg-amber-800/30 rounded-lg border border-amber-200 dark:border-amber-600">
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Storage Limit Exceeded
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your current storage usage ({downgradeImpact.storageImpact.currentUsage}MB) exceeds the new tier limit ({downgradeImpact.storageImpact.newLimit}MB). 
                    You may need to delete some content or upgrade to continue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Your Personas After Downgrade
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-3 mb-6">
              {personas.map((persona, index) => {
                const status = getPersonaStatus(index)
                const StatusIcon = status.icon
                
                return (
                  <div key={persona.id} className={`p-4 rounded-lg border ${
                    status.status === 'accessible' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600'
                      : status.status === 'grace'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-600'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <StatusIcon className={`w-5 h-5 mt-0.5 ${status.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {persona.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-600 rounded-full text-slate-600 dark:text-slate-400">
                            Priority: {persona.priorityOrder}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {persona.relationshipToUser} • {persona.memoriesCount} memories • {persona.photosCount} photos • {persona.storageUsed}MB
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {status.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Feature Loss */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-slate-900 dark:text-white mb-3">
              Features You'll Lose
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>AI-powered memory analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Family collaboration tools</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Advanced customization options</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Recommendations
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Consider keeping your current tier if you need full access to all personas</li>
                  <li>• Export important data before downgrading</li>
                  <li>• You can always upgrade again later</li>
                  {selectedStrategy === 'soft' && (
                    <li>• Soft limit preserves all your data and memories</li>
                  )}
                  {selectedStrategy === 'hard' && (
                    <li>• ⚠️ Hard limit will permanently delete excess personas</li>
                  )}
                  {selectedStrategy === 'grace' && (
                    <li>• Grace period gives you 30 days to decide</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200"
            >
              Cancel Downgrade
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onConfirmDowngrade(selectedStrategy)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Confirm Downgrade ({strategyInfo.name})
              </button>
              
              <button
                onClick={() => {/* Navigate to upgrade page */}}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <ArrowUp className="w-4 h-4 mr-2 inline" />
                Keep Current Tier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
