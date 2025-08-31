'use client'

import { useState, useRef } from 'react'
import { 
  Sparkles, 
  Heart, 
  Globe, 
  Image as ImageIcon, 
  Palette, 
  Eye, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Wand2,
  Lightbulb,
  CheckCircle,
  Circle,
  Upload,
  X,
  RotateCw,
  Crop,
  Filter
} from 'lucide-react'

interface Template {
  id: string
  name: string
  category: 'funeral' | 'celebration' | 'memorial' | 'anniversary'
  culture: 'christian' | 'jewish' | 'islamic' | 'buddhist' | 'hindu' | 'secular'
  style: 'traditional' | 'modern' | 'elegant' | 'simple' | 'religious'
  size: '4x6' | '5x7' | '6x8' | 'A4' | 'A5'
  preview: string
  colors: string[]
  fonts: string[]
  photoPositions: number
  price: number
}

interface WizardData {
  occasion: string
  culture: string
  style: string
  template: Template | null
  details: {
    deceasedName: string
    birthDate: string
    deathDate: string
    serviceDate: string
    serviceTime: string
    location: string
    customMessage: string
    contactInfo: string
  }
  photos: File[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  quantity: number
  size: string
}

const mockTemplates: Template[] = [
  {
    id: 'christian-elegant-1',
    name: 'Elegant Christian Memorial',
    category: 'funeral',
    culture: 'christian',
    style: 'elegant',
    size: '5x7',
    preview: '/images/templates/christian-elegant-1.jpg',
    colors: ['#2C3E50', '#E74C3C', '#F39C12'],
    fonts: ['Playfair Display', 'Georgia', 'Times New Roman'],
    photoPositions: 2,
    price: 2.50
  },
  {
    id: 'jewish-traditional-1',
    name: 'Traditional Jewish Memorial',
    category: 'funeral',
    culture: 'jewish',
    style: 'traditional',
    size: '5x7',
    preview: '/images/templates/jewish-traditional-1.jpg',
    colors: ['#1E3A8A', '#F59E0B', '#10B981'],
    fonts: ['Noto Sans Hebrew', 'Arial', 'Helvetica'],
    photoPositions: 1,
    price: 2.50
  },
  {
    id: 'islamic-modern-1',
    name: 'Modern Islamic Memorial',
    category: 'funeral',
    culture: 'islamic',
    style: 'modern',
    size: '5x7',
    preview: '/images/templates/islamic-modern-1.jpg',
    colors: ['#059669', '#DC2626', '#7C3AED'],
    fonts: ['Noto Naskh Arabic', 'Arial', 'Helvetica'],
    photoPositions: 3,
    price: 2.50
  },
  {
    id: 'secular-simple-1',
    name: 'Simple Celebration of Life',
    category: 'celebration',
    culture: 'secular',
    style: 'simple',
    size: '5x7',
    preview: '/images/templates/secular-simple-1.jpg',
    colors: ['#374151', '#6B7280', '#9CA3AF'],
    fonts: ['Inter', 'Arial', 'Helvetica'],
    photoPositions: 2,
    price: 2.00
  }
]

const aiSuggestions = {
  occasions: [
    'Traditional Funeral Service',
    'Celebration of Life',
    'Memorial Service',
    'Graveside Service',
    'Scattering of Ashes',
    'Memorial Anniversary',
    'Remembrance Gathering'
  ],
  messages: [
    'In loving memory of [Name], who touched our lives with warmth and kindness.',
    'Celebrating the beautiful life of [Name], whose spirit will live on in our hearts.',
    'Remembering [Name] with love and gratitude for the joy they brought to our lives.',
    'Honoring the memory of [Name], a beloved friend, family member, and inspiration.',
    'With deepest sympathy as we remember [Name] and the love they shared with us all.'
  ],
  colors: {
    christian: ['#2C3E50', '#E74C3C', '#F39C12', '#8E44AD'],
    jewish: ['#1E3A8A', '#F59E0B', '#10B981', '#DC2626'],
    islamic: ['#059669', '#DC2626', '#7C3AED', '#F59E0B'],
    buddhist: ['#7C3AED', '#F59E0B', '#10B981', '#374151'],
    hindu: ['#DC2626', '#F59E0B', '#10B981', '#7C3AED'],
    secular: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB']
  }
}

export function TemplateWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    occasion: '',
    culture: '',
    style: '',
    template: null,
    details: {
      deceasedName: '',
      birthDate: '',
      deathDate: '',
      serviceDate: '',
      serviceTime: '',
      location: '',
      customMessage: '',
      contactInfo: ''
    },
    photos: [],
    colors: {
      primary: '#2C3E50',
      secondary: '#E74C3C',
      accent: '#F39C12'
    },
    quantity: 100,
    size: '5x7'
  })
  
  const [aiLoading, setAiLoading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, name: 'Occasion & Culture', icon: '🌹' },
    { id: 2, name: 'Template Selection', icon: '🎨' },
    { id: 3, name: 'Details & Message', icon: '✍️' },
    { id: 4, name: 'Photos & Colors', icon: '📸' },
    { id: 5, name: 'Preview & Order', icon: '✅' }
  ]

  const generateAIRecommendations = async () => {
    setAiLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const recommendations = {
      suggestedTemplates: mockTemplates.filter(t => 
        t.culture === wizardData.culture || t.culture === 'secular'
      ).slice(0, 3),
      suggestedMessage: aiSuggestions.messages[Math.floor(Math.random() * aiSuggestions.messages.length)],
      suggestedColors: aiSuggestions.colors[wizardData.culture as keyof typeof aiSuggestions.colors] || aiSuggestions.colors.secular
    }
    
    setAiRecommendations(recommendations)
    setAiLoading(false)
  }

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return
    
    const newPhotos = Array.from(files)
    setWizardData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }))
    
    // Create preview URLs
    newPhotos.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setWizardData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
    setPhotoPreview(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 1 && !aiRecommendations) {
        generateAIRecommendations()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.occasion && wizardData.culture
      case 2:
        return wizardData.template !== null
      case 3:
        return wizardData.details.deceasedName && wizardData.details.serviceDate
      case 4:
        return wizardData.photos.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 font-playfair bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            AI-Enhanced Template Wizard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create beautiful memorial invites with intelligent AI assistance
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
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
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`text-sm font-medium transition-colors duration-300 ${
                  currentStep >= step.id
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.name}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-8">
          {/* Step 1: Occasion & Culture */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Tell us about the occasion
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Our AI will help you choose the perfect template and design elements
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Occasion Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-amber-600" />
                    Type of Service
                  </h3>
                  <div className="space-y-3">
                    {aiSuggestions.occasions.map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => setWizardData(prev => ({ ...prev, occasion }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                          wizardData.occasion === occasion
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-white">{occasion}</span>
                          {wizardData.occasion === occasion && (
                            <CheckCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Culture Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-amber-600" />
                    Cultural Tradition
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['christian', 'jewish', 'islamic', 'buddhist', 'hindu', 'secular'].map((culture) => (
                      <button
                        key={culture}
                        onClick={() => setWizardData(prev => ({ ...prev, culture }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                          wizardData.culture === culture
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {culture === 'christian' && '✝'}
                          {culture === 'jewish' && '✡'}
                          {culture === 'islamic' && '☪'}
                          {culture === 'buddhist' && '☸'}
                          {culture === 'hindu' && '🕉️'}
                          {culture === 'secular' && '🌹'}
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white capitalize">
                          {culture}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                    AI Assistant Ready
                  </h3>
                </div>
                <p className="text-amber-700 dark:text-amber-300 mb-4">
                  Once you select an occasion and culture, our AI will suggest the perfect templates, 
                  color schemes, and design elements that respect your traditions.
                </p>
                <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
                  <Wand2 className="w-4 h-4" />
                  <span>AI will analyze your selections and provide personalized recommendations</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Choose Your Template
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  {aiRecommendations ? 'AI has selected these templates for you' : 'Loading AI recommendations...'}
                </p>
              </div>

              {aiLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">AI is analyzing your preferences...</p>
                </div>
              )}

              {aiRecommendations && (
                <div className="grid md:grid-cols-3 gap-6">
                  {aiRecommendations.suggestedTemplates.map((template: Template) => (
                    <div
                      key={template.id}
                      onClick={() => setWizardData(prev => ({ ...prev, template }))}
                      className={`cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        wizardData.template?.id === template.id
                          ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                      }`}
                    >
                      <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-700 rounded-t-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎨</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{template.name}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{template.name}</h3>
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                          <span className="capitalize">{template.style}</span>
                          <span>{template.size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            ${template.price}
                          </span>
                          {wizardData.template?.id === template.id && (
                            <CheckCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details & Message */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Personalize Your Design
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Add the details and personal message for your memorial
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Service Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Deceased Name *
                    </label>
                    <input
                      type="text"
                      value={wizardData.details.deceasedName}
                      onChange={(e) => setWizardData(prev => ({
                        ...prev,
                        details: { ...prev.details, deceasedName: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={wizardData.details.birthDate}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, birthDate: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Death Date
                      </label>
                      <input
                        type="date"
                        value={wizardData.details.deathDate}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, deathDate: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Service Date *
                      </label>
                      <input
                        type="date"
                        value={wizardData.details.serviceDate}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, serviceDate: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Service Time
                      </label>
                      <input
                        type="time"
                        value={wizardData.details.serviceTime}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, serviceTime: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={wizardData.details.location}
                      onChange={(e) => setWizardData(prev => ({
                        ...prev,
                        details: { ...prev.details, location: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Funeral home, church, or venue"
                    />
                  </div>
                </div>

                {/* Message & AI Suggestions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Personal Message</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Custom Message
                    </label>
                    <textarea
                      value={wizardData.details.customMessage}
                      onChange={(e) => setWizardData(prev => ({
                        ...prev,
                        details: { ...prev.details, customMessage: e.target.value }
                      }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Write a personal message or tribute..."
                    />
                  </div>

                  {/* AI Message Suggestions */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Wand2 className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        AI Message Suggestions
                      </span>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.messages.slice(0, 3).map((message, index) => (
                        <button
                          key={index}
                          onClick={() => setWizardData(prev => ({
                            ...prev,
                            details: { ...prev.details, customMessage: message }
                          }))}
                          className="block w-full text-left text-sm text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-all duration-200"
                        >
                          {message}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      value={wizardData.details.contactInfo}
                      onChange={(e) => setWizardData(prev => ({
                        ...prev,
                        details: { ...prev.details, contactInfo: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Phone number or email for RSVPs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos & Colors */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Add Photos & Choose Colors
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Upload photos and select a beautiful color scheme
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-amber-600" />
                    Photos
                  </h3>
                  
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Photos</span>
                    </button>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Drag & drop or click to upload (JPG, PNG)
                    </p>
                  </div>

                  {/* Photo Previews */}
                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-amber-600" />
                    Color Scheme
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={wizardData.colors.primary}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={wizardData.colors.secondary}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Accent Color
                      </label>
                      <input
                        type="color"
                        value={wizardData.colors.accent}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* AI Color Suggestions */}
                  {aiRecommendations && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Wand2 className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          AI Color Suggestions
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {aiRecommendations.suggestedColors.map((color: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setWizardData(prev => ({
                              ...prev,
                              colors: { ...prev.colors, primary: color }
                            }))}
                            className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-700 shadow-md hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preview & Order */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Preview & Place Order
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Review your design and complete your order
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Design Preview */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Design Preview</h3>
                  <div className="aspect-[5/7] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-slate-300 dark:border-slate-600 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {wizardData.template?.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {wizardData.details.deceasedName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Template:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {wizardData.template?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Size:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {wizardData.size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {wizardData.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Photos:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {wizardData.photos.length} uploaded
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        ${((wizardData.template?.price || 0) * wizardData.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < 5 && (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
