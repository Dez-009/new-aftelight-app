'use client'

import { useState, useRef } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  BookOpen, 
  Camera, 
  Mic, 
  Globe, 
  Heart,
  Upload,
  Trash2,
  Play,
  Pause,
  Star
} from 'lucide-react'

interface PersonaData {
  // Step 1: Personal Details
  name: string
  birthDate: string
  deathDate: string
  relationshipToUser: string
  biography: string
  
  // Step 2: Life Story & Memories
  memories: Array<{
    id: string
    title: string
    content: string
    memoryType: string
    emotionalTone: string
  }>
  
  // Step 3: Photos & Voice Recordings
  photos: Array<{
    id: string
    file: File
    description: string
    aiDescription?: string
  }>
  voiceRecordings: Array<{
    id: string
    file: File
    description: string
    transcript?: string
  }>
  
  // Step 4: Cultural Preferences & Relationships
  culturalBackground: string
  religiousPreferences: string
  favoriteQuotes: string[]
  favoriteMusic: string[]
  hobbies: string[]
  achievements: string[]
  personalityTraits: string[]
  relationships: Array<{
    id: string
    personName: string
    relationshipType: string
    details: string
  }>
  
  // Step 5: Final Review
  isPublic: boolean
}

interface PersonasWizardProps {
  onComplete: () => void
}

export function PersonasWizard({ onComplete }: PersonasWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [personaData, setPersonaData] = useState<PersonaData>({
    name: '',
    birthDate: '',
    deathDate: '',
    relationshipToUser: '',
    biography: '',
    memories: [],
    photos: [],
    voiceRecordings: [],
    culturalBackground: '',
    religiousPreferences: '',
    favoriteQuotes: [''],
    favoriteMusic: [''],
    hobbies: [''],
    achievements: [''],
    personalityTraits: [''],
    relationships: [],
    isPublic: false
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const voiceInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, name: 'Personal Details', icon: '👤', description: 'Basic information and biography' },
    { id: 2, name: 'Life Story & Memories', icon: '📖', description: 'Share meaningful memories and stories' },
    { id: 3, name: 'Photos & Voice', icon: '📸', description: 'Add visual and audio memories' },
    { id: 4, name: 'Cultural & Relationships', icon: '🌍', description: 'Cultural background and family connections' },
    { id: 5, name: 'Final Review', icon: '✅', description: 'Review and save your persona' }
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return personaData.name && personaData.birthDate
      case 2:
        return personaData.memories.length > 0
      case 3:
        return personaData.photos.length > 0 || personaData.voiceRecordings.length > 0
      case 4:
        return personaData.culturalBackground || personaData.relationships.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    // TODO: Implement save to database
    console.log('Saving persona:', personaData)
    onComplete()
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.id
                ? 'border-amber-500 bg-amber-500 text-white'
                : 'border-slate-300 dark:border-slate-600 text-slate-400'
            }`}>
              {currentStep > step.id ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="text-lg">{step.icon}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-4 transition-all duration-300 ${
                currentStep > step.id ? 'bg-amber-500' : 'bg-slate-300 dark:border-slate-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="text-center flex-1">
            <div className={`text-sm font-medium transition-colors duration-300 ${
              currentStep >= step.id
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {step.name}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {step.description}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Personal Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Let's start with the basic information about this person
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personaData.name}
                  onChange={(e) => setPersonaData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Relationship to You
                </label>
                <input
                  type="text"
                  value={personaData.relationshipToUser}
                  onChange={(e) => setPersonaData(prev => ({ ...prev, relationshipToUser: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  placeholder="e.g., Father, Grandmother, Friend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={personaData.birthDate}
                  onChange={(e) => setPersonaData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Death Date
                </label>
                <input
                  type="date"
                  value={personaData.deathDate}
                  onChange={(e) => setPersonaData(prev => ({ ...prev, deathDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Biography
              </label>
              <textarea
                value={personaData.biography}
                onChange={(e) => setPersonaData(prev => ({ ...prev, biography: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                placeholder="Tell us about this person's life, their story, what made them special..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Life Story & Memories */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Life Story & Memories
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Share the meaningful memories and stories that capture their essence
              </p>
            </div>

            {/* Add Memory Form */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Add a Memory
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    id="memoryTitle"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    placeholder="e.g., First fishing trip"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Memory Type
                  </label>
                  <select
                    id="memoryType"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    <option value="">Select type</option>
                    <option value="childhood">Childhood</option>
                    <option value="family">Family</option>
                    <option value="career">Career</option>
                    <option value="hobby">Hobby</option>
                    <option value="travel">Travel</option>
                    <option value="achievement">Achievement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Emotional Tone
                  </label>
                  <select
                    id="emotionalTone"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    <option value="">Select tone</option>
                    <option value="joyful">Joyful</option>
                    <option value="touching">Touching</option>
                    <option value="humorous">Humorous</option>
                    <option value="inspiring">Inspiring</option>
                    <option value="peaceful">Peaceful</option>
                    <option value="adventurous">Adventurous</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Memory Content
                </label>
                <textarea
                  id="memoryContent"
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  placeholder="Describe this memory in detail..."
                />
              </div>

              <button
                onClick={() => {
                  const title = (document.getElementById('memoryTitle') as HTMLInputElement).value
                  const type = (document.getElementById('memoryType') as HTMLSelectElement).value
                  const tone = (document.getElementById('emotionalTone') as HTMLSelectElement).value
                  const content = (document.getElementById('memoryContent') as HTMLTextAreaElement).value
                  
                  if (title && type && tone && content) {
                    const newMemory = {
                      id: Date.now().toString(),
                      title,
                      content,
                      memoryType: type,
                      emotionalTone: tone
                    }
                    setPersonaData(prev => ({
                      ...prev,
                      memories: [...prev.memories, newMemory]
                    }))
                    
                    // Clear form
                    ;(document.getElementById('memoryTitle') as HTMLInputElement).value = ''
                    ;(document.getElementById('memoryType') as HTMLSelectElement).value = ''
                    ;(document.getElementById('emotionalTone') as HTMLSelectElement).value = ''
                    ;(document.getElementById('memoryContent') as HTMLTextAreaElement).value = ''
                  }
                }}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Add Memory
              </button>
            </div>

            {/* Memories List */}
            {personaData.memories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Memories Added ({personaData.memories.length})
                </h3>
                {personaData.memories.map((memory) => (
                  <div key={memory.id} className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">{memory.title}</h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{memory.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded-full">
                            {memory.memoryType}
                          </span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded-full">
                            {memory.emotionalTone}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setPersonaData(prev => ({
                          ...prev,
                          memories: prev.memories.filter(m => m.id !== memory.id)
                        }))}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Photos & Voice Recordings */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Photos & Voice Recordings
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Add visual and audio memories to make your persona come alive
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-amber-600" />
                  Photo Memories
                </h3>
                
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Click to upload photos or drag and drop
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newPhotos = Array.from(e.target.files).map(file => ({
                          id: Date.now().toString() + Math.random(),
                          file,
                          description: '',
                          aiDescription: undefined
                        }))
                        setPersonaData(prev => ({
                          ...prev,
                          photos: [...prev.photos, ...newPhotos]
                        }))
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Choose Photos
                  </button>
                </div>

                {/* Photo Preview */}
                {personaData.photos.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Photos Added ({personaData.photos.length})
                    </h4>
                    {personaData.photos.map((photo) => (
                      <div key={photo.id} className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-start space-x-4">
                          <img
                            src={URL.createObjectURL(photo.file)}
                            alt="Photo preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Describe this photo..."
                              value={photo.description}
                              onChange={(e) => setPersonaData(prev => ({
                                ...prev,
                                photos: prev.photos.map(p => 
                                  p.id === photo.id ? { ...p, description: e.target.value } : p
                                )
                              }))}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200 text-sm"
                            />
                            {photo.aiDescription && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                AI Description: {photo.aiDescription}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setPersonaData(prev => ({
                              ...prev,
                              photos: prev.photos.filter(p => p.id !== photo.id)
                            }))}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Recordings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-amber-600" />
                  Voice Memories
                </h3>
                
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200">
                  <Mic className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Record or upload voice messages
                  </p>
                  <input
                    ref={voiceInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newVoice = Array.from(e.target.files).map(file => ({
                          id: Date.now().toString() + Math.random(),
                          file,
                          description: '',
                          transcript: undefined
                        }))
                        setPersonaData(prev => ({
                          ...prev,
                          voiceRecordings: [...prev.voiceRecordings, ...newVoice]
                        }))
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => voiceInputRef.current?.click()}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Choose Audio Files
                  </button>
                </div>

                {/* Voice Preview */}
                {personaData.voiceRecordings.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Voice Recordings ({personaData.voiceRecordings.length})
                    </h4>
                    {personaData.voiceRecordings.map((recording) => (
                      <div key={recording.id} className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                            <Play className="w-8 h-8 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Describe this recording..."
                              value={recording.description}
                              onChange={(e) => setPersonaData(prev => ({
                                ...prev,
                                voiceRecordings: prev.voiceRecordings.map(r => 
                                  r.id === recording.id ? { ...r, description: e.target.value } : r
                                )
                              }))}
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200 text-sm"
                            />
                            {recording.transcript && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Transcript: {recording.transcript}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setPersonaData(prev => ({
                              ...prev,
                              voiceRecordings: prev.voiceRecordings.filter(r => r.id !== recording.id)
                            }))}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Cultural Preferences & Relationships */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Cultural & Relationships
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Share cultural background, preferences, and family connections
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Cultural Background */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-amber-600" />
                  Cultural Background
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cultural Tradition
                  </label>
                  <select
                    value={personaData.culturalBackground}
                    onChange={(e) => setPersonaData(prev => ({ ...prev, culturalBackground: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    <option value="">Select cultural tradition</option>
                    <option value="christian">Christian</option>
                    <option value="jewish">Jewish</option>
                    <option value="islamic">Islamic</option>
                    <option value="buddhist">Buddhist</option>
                    <option value="hindu">Hindu</option>
                    <option value="secular">Secular</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Religious Preferences
                  </label>
                  <input
                    type="text"
                    value={personaData.religiousPreferences}
                    onChange={(e) => setPersonaData(prev => ({ ...prev, religiousPreferences: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    placeholder="e.g., Traditional, Modern, Spiritual"
                  />
                </div>

                {/* Dynamic Arrays */}
                {['favoriteQuotes', 'favoriteMusic', 'hobbies', 'achievements', 'personalityTraits'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    {(personaData[field as keyof PersonaData] as string[]).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => setPersonaData(prev => ({
                            ...prev,
                            [field]: (prev[field as keyof PersonaData] as string[]).map((val, i) => 
                              i === index ? e.target.value : val
                            )
                          }))}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                          placeholder={`Add ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                        <button
                          onClick={() => setPersonaData(prev => ({
                            ...prev,
                            [field]: (prev[field as keyof PersonaData] as string[]).filter((_, i) => i !== index)
                          }))}
                          className="px-2 py-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setPersonaData(prev => ({
                        ...prev,
                        [field]: [...(prev[field as keyof PersonaData] as string[]), '']
                      }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200"
                    >
                      + Add {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  </div>
                ))}
              </div>

              {/* Relationships */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-amber-600" />
                  Family & Relationships
                </h3>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">Add Relationship</h4>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      id="relationshipName"
                      placeholder="Person's name"
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200 text-sm"
                    />
                    <select
                      id="relationshipType"
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="grandchild">Grandchild</option>
                      <option value="friend">Friend</option>
                      <option value="colleague">Colleague</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <input
                    type="text"
                    id="relationshipDetails"
                    placeholder="Relationship details"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200 text-sm mb-3"
                  />
                  
                  <button
                    onClick={() => {
                      const name = (document.getElementById('relationshipName') as HTMLInputElement).value
                      const type = (document.getElementById('relationshipType') as HTMLSelectElement).value
                      const details = (document.getElementById('relationshipDetails') as HTMLInputElement).value
                      
                      if (name && type && details) {
                        const newRelationship = {
                          id: Date.now().toString(),
                          personName: name,
                          relationshipType: type,
                          details
                        }
                        setPersonaData(prev => ({
                          ...prev,
                          relationships: [...prev.relationships, newRelationship]
                        }))
                        
                        // Clear form
                        ;(document.getElementById('relationshipName') as HTMLInputElement).value = ''
                        ;(document.getElementById('relationshipType') as HTMLSelectElement).value = ''
                        ;(document.getElementById('relationshipDetails') as HTMLInputElement).value = ''
                      }
                    }}
                    className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm"
                  >
                    Add Relationship
                  </button>
                </div>

                {/* Relationships List */}
                {personaData.relationships.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Relationships ({personaData.relationships.length})
                    </h4>
                    {personaData.relationships.map((relationship) => (
                      <div key={relationship.id} className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {relationship.personName}
                              </span>
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded-full text-xs text-slate-600 dark:text-slate-400">
                                {relationship.relationshipType}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {relationship.details}
                            </p>
                          </div>
                          <button
                            onClick={() => setPersonaData(prev => ({
                              ...prev,
                              relationships: prev.relationships.filter(r => r.id !== relationship.id)
                            }))}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Final Review */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Final Review
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Review your persona before saving
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Persona Summary
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-white">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Name:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Relationship:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.relationshipToUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Birth Date:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.birthDate}</span>
                    </div>
                    {personaData.deathDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Death Date:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{personaData.deathDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Cultural Background:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.culturalBackground || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Content Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-white">Content Added</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Memories:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.memories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Photos:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.photos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voice Recordings:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.voiceRecordings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Relationships:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{personaData.relationships.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography Preview */}
              {personaData.biography && (
                <div className="mt-6">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Biography</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                    {personaData.biography}
                  </p>
                </div>
              )}

              {/* Privacy Setting */}
              <div className="mt-6 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={personaData.isPublic}
                  onChange={(e) => setPersonaData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500 dark:focus:ring-amber-400 dark:ring-offset-slate-800"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-700 dark:text-slate-300">
                  Make this persona public (shareable with family members)
                </label>
              </div>
            </div>

            {/* Save Options */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700 p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Ready to Save Your Persona?
                </h3>
                <p className="text-amber-700 dark:text-amber-300 mb-4">
                  This will create a rich, AI-ready profile that can be used for memorial planning and AI content generation.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-amber-600 dark:text-amber-400">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Preserve Memories</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Cultural Respect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Save Persona</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
