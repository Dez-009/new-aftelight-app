'use client'

import { useState } from 'react'
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
  Mic
} from 'lucide-react'

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
}

interface PersonasListProps {
  onCreateNew: () => void
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
    isPublic: false
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
    isPublic: false
  }
]

export function PersonasList({ onCreateNew }: PersonasListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all')
  const [personas] = useState<Persona[]>(mockPersonas)

  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.relationshipToUser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && persona.isPublic) ||
                         (filterBy === 'private' && !persona.isPublic)
    
    return matchesSearch && matchesFilter
  })

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
            {filteredPersonas.length} of {personas.length} personas
          </p>
        </div>
        
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Persona</span>
        </button>
      </div>

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
          {filteredPersonas.map((persona) => (
            <div key={persona.id} className="bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                      {persona.name}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-400 font-medium">
                      {persona.relationshipToUser}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {persona.isPublic && (
                      <Eye className="w-4 h-4 text-blue-500" title="Public" />
                    )}
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors duration-200">
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
          ))}
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
              onClick={onCreateNew}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
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
              Unlock Unlimited Personas
            </h3>
            <p className="text-amber-700 dark:text-amber-300 mb-4">
              You've created {personas.length} persona. Upgrade to Premium to create unlimited personas and unlock AI-powered features.
            </p>
            <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105">
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
