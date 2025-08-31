'use client'

import { useState, useMemo } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Star,
  Calendar,
  User,
  Camera,
  Mic,
  Settings
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { avatarService } from '@/lib/avatarService'

interface Persona {
  id: string
  name: string
  relationshipToUser: string
  birthDate: string
  deathDate?: string
  biography: string
  memoriesCount: number
  photosCount: number
  voiceRecordingsCount: number
  culturalBackground: string
  createdAt: string
  isPublic: boolean
  avatarUrl?: string | null
}

interface PersonasListProps {
  onCreateNew: () => void
  personas?: Persona[]
  userSubscription?: {
    tier: 'free' | 'premium' | 'religious' | 'healthcare'
    maxPersonas: number
    currentPersonas: number
    canCreateNew: boolean
  }
}

// Mock data for development
const mockPersonas: Persona[] = [
  {
    id: '1',
    name: 'Margaret Johnson',
    relationshipToUser: 'Grandmother',
    birthDate: '1935-03-15',
    deathDate: '2023-11-22',
    biography: 'A loving grandmother who taught me the value of family and tradition. She was the heart of our family gatherings.',
    memoriesCount: 12,
    photosCount: 8,
    voiceRecordingsCount: 3,
    culturalBackground: 'Christian',
    createdAt: '2024-01-15',
    isPublic: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Robert Chen',
    relationshipToUser: 'Father',
    birthDate: '1960-07-08',
    biography: 'My father, a hardworking man who always put family first. He taught me resilience and determination.',
    memoriesCount: 8,
    photosCount: 15,
    voiceRecordingsCount: 2,
    culturalBackground: 'Buddhist',
    createdAt: '2024-02-20',
    isPublic: false,
    avatarUrl: null
  }
]

export function PersonasList({ onCreateNew, personas: propPersonas, userSubscription: propUserSubscription }: PersonasListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all')
  
  // Use props if provided, otherwise fall back to mock data
  const personas = propPersonas || mockPersonas
  const userSubscription = propUserSubscription || {
    tier: 'free' as const,
    maxPersonas: 1,
    currentPersonas: personas.length,
    canCreateNew: personas.length < 1
  }

  const getUpgradeMessage = () => {
    if (personas.length >= userSubscription.maxPersonas) {
      return {
        type: 'limit-reached' as const,
        message: `You've reached your limit of ${userSubscription.maxPersonas} persona(s) on the ${userSubscription.tier} tier.`,
        action: 'Upgrade to create more personas'
      }
    }
    return null
  }



  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.relationshipToUser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && persona.isPublic) ||
                         (filterBy === 'private' && !persona.isPublic)
    
    return matchesSearch && matchesFilter
  })

  const handleCreateNew = () => {
    if (!userSubscription.canCreateNew) {
      // Show upgrade modal or redirect to subscription page
      alert(`You've reached your limit of ${userSubscription.maxPersonas} persona(s) on the ${userSubscription.tier} tier. Please upgrade to create more personas.`)
      return
    }
    onCreateNew()
  }

  const handleAvatarChange = async (personaId: string, file: File | null) => {
    try {
      if (file) {
        const result = await avatarService.uploadAvatar(personaId, file)
        if (result.success && result.avatarUrl) {
          // Update the persona's avatar in the local state
          const updatedPersonas = personas.map(p => 
            p.id === personaId ? { ...p, avatarUrl: result.avatarUrl } : p
          )
          // In a real app, you'd update the state through a callback or context
          console.log('Avatar updated successfully:', result.avatarUrl)
        }
      } else {
        // Remove avatar
        const result = await avatarService.removeAvatar(personaId)
        if (result.success) {
          // Update the persona's avatar in the local state
          const updatedPersonas = personas.map(p => 
            p.id === personaId ? { ...p, avatarUrl: null } : p
          )
          // In a real app, you'd update the state through a callback or context
          console.log('Avatar removed successfully')
        }
      }
    } catch (error) {
      console.error('Failed to update avatar:', error)
      alert('Failed to update avatar. Please try again.')
    }
  }

  const upgradeMessage = getUpgradeMessage()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate)
    const end = deathDate ? new Date(deathDate) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    const monthDiff = end.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Personas
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            {personas.length} of {userSubscription.maxPersonas} personas
            <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
              • {userSubscription.tier} tier limit: {userSubscription.maxPersonas}
            </span>
          </p>
        </div>
        
        <button
          onClick={handleCreateNew}
          disabled={!userSubscription.canCreateNew}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
            userSubscription.canCreateNew
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-slate-400 text-slate-200 cursor-not-allowed opacity-50'
          }`}
          title={!userSubscription.canCreateNew ? `Upgrade to create more than ${userSubscription.maxPersonas} persona(s)` : 'Create a new persona'}
        >
          <Plus className="w-4 h-4" />
          <span>{userSubscription.canCreateNew ? 'Create New Persona' : 'Upgrade to Create More'}</span>
        </button>
      </div>

      {/* Downgrade Warning */}
      {upgradeMessage && (
        <div className={`rounded-xl border p-4 ${
          upgradeMessage.type === 'limit-reached'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              upgradeMessage.type === 'limit-reached'
                ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              {upgradeMessage.type === 'limit-reached' ? '!' : 'i'}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                upgradeMessage.type === 'limit-reached'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
              }`}>
                {upgradeMessage.type === 'limit-reached' ? 'Limit Reached' : 'Approaching Limit'}
              </h4>
              <p className={`text-sm mt-1 ${
                upgradeMessage.type === 'limit-reached'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {upgradeMessage.message}
              </p>
              <div className="mt-3">
                <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  upgradeMessage.type === 'limit-reached'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}>
                  {upgradeMessage.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search personas by name or relationship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'public' | 'private')}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
          >
            <option value="all">All Personas</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Personas Grid */}
      {filteredPersonas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => {
            // Find the original index of this persona in the full personas array
            const originalIndex = personas.findIndex(p => p.id === persona.id)
            const exceedsLimit = originalIndex >= userSubscription.maxPersonas
            
            return (
            <div key={persona.id} className={`bg-white dark:bg-slate-700 rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 ${
              exceedsLimit
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                : 'border-slate-200 dark:border-slate-600'
            }`}>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <Avatar
                      src={persona.avatarUrl}
                      alt={persona.name}
                      size="lg"
                      editable={!exceedsLimit}
                      disabled={exceedsLimit}
                      onAvatarChange={(file) => handleAvatarChange(persona.id, file)}
                      className="flex-shrink-0"
                    />
                    
                    {/* Persona Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                        {persona.name}
                      </h3>
                      <p className="text-amber-600 dark:text-amber-400 font-medium">
                        {persona.relationshipToUser}
                      </p>
                      {exceedsLimit && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 text-xs rounded-full">
                          Tier Limit Exceeded
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {persona.isPublic && (
                      <div className="relative group">
                        <Eye className="w-4 h-4 text-blue-500" aria-label="Public persona" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Public
                        </div>
                      </div>
                    )}
                    <button 
                      className={`transition-colors duration-200 ${
                        exceedsLimit
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                      disabled={exceedsLimit}
                      title={exceedsLimit ? 'Cannot edit: Tier limit exceeded' : 'Edit persona'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className={`transition-colors duration-200 ${
                        exceedsLimit
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                      disabled={exceedsLimit}
                      title={exceedsLimit ? 'Cannot delete: Tier limit exceeded' : 'Delete persona'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateAge(persona.birthDate, persona.deathDate)} years</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{persona.culturalBackground}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                  {persona.biography}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold">{persona.memoriesCount}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Memories</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                      <Camera className="w-4 h-4" />
                      <span className="font-semibold">{persona.photosCount}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Photos</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <Mic className="w-4 h-4" />
                      <span className="font-semibold">{persona.voiceRecordingsCount}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Voice</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Created {formatDate(persona.createdAt)}</span>
                  <button className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {searchTerm || filterBy !== 'all' ? 'No personas found' : 'No personas yet'}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first persona to start preserving memories and building meaningful memorials'
            }
          </p>
                      {!searchTerm && filterBy === 'all' && (
              <button
                onClick={handleCreateNew}
                disabled={!userSubscription.canCreateNew}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                  userSubscription.canCreateNew
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-400 text-slate-200 cursor-not-allowed'
                }`}
              >
                Create Your First Persona
              </button>
            )}
        </div>
      )}

      {/* Subscription Upgrade Prompt */}
      {personas.length >= 1 && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700 p-6">
          <div className="text-center">
            <Star className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
              {upgradeMessage?.type === 'limit-reached' 
                ? 'Upgrade Required to Continue'
                : 'Unlock Unlimited Personas'
              }
            </h3>
                          <p className="text-amber-700 dark:text-amber-300 mb-4">
                {upgradeMessage?.type === 'limit-reached'
                  ? `You've reached your ${userSubscription.tier} tier limit. Upgrade to access all your personas and create new ones.`
                  : `You've created ${personas.length} persona(s). Upgrade to Premium to create unlimited personas and unlock AI-powered features.`
                }
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
            <div className="mt-4">
              <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105">
                {upgradeMessage?.type === 'limit-reached' ? 'Upgrade Now' : 'Upgrade to Premium'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
