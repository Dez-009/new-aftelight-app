'use client'

import { useState, useRef } from 'react'
import { 
  Heart, 
  Globe, 
  Palette, 
  Upload, 
  Trash2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCw,
  Crop,
  Filter,
  Check
} from 'lucide-react'

interface Template {
  id: string
  name: string
  category: 'funeral' | 'celebration' | 'memorial' | 'anniversary'
  culture: 'christian' | 'jewish' | 'islamic' | 'buddhist' | 'hindu' | 'secular'
  style: 'traditional' | 'modern' | 'elegant' | 'simple' | 'religious'
  size: '4x6' | '5x7' | '6x8' | 'A4' | 'A5' | '8.5x11'
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
  material: string
  shipping: string
}

// Mock templates with more variety
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
    id: 'christian-traditional-1',
    name: 'Traditional Christian Service',
    category: 'funeral',
    culture: 'christian',
    style: 'traditional',
    size: '5x7',
    preview: '/images/templates/christian-traditional-1.jpg',
    colors: ['#1F2937', '#DC2626', '#F59E0B'],
    fonts: ['Times New Roman', 'Georgia', 'Serif'],
    photoPositions: 1,
    price: 2.00
  },
  {
    id: 'christian-religious-1',
    name: 'Religious Christian Memorial',
    category: 'funeral',
    culture: 'christian',
    style: 'religious',
    size: '6x8',
    preview: '/images/templates/christian-religious-1.jpg',
    colors: ['#7C3AED', '#1E40AF', '#F59E0B'],
    fonts: ['Playfair Display', 'Georgia', 'Times New Roman'],
    photoPositions: 3,
    price: 3.00
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
    id: 'jewish-modern-1',
    name: 'Modern Jewish Memorial',
    category: 'funeral',
    culture: 'jewish',
    style: 'modern',
    size: '6x8',
    preview: '/images/templates/jewish-modern-1.jpg',
    colors: ['#1E40AF', '#F59E0B', '#059669'],
    fonts: ['Inter', 'Noto Sans Hebrew', 'Arial'],
    photoPositions: 2,
    price: 3.00
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
    id: 'islamic-traditional-1',
    name: 'Traditional Islamic Memorial',
    category: 'funeral',
    culture: 'islamic',
    style: 'traditional',
    size: '5x7',
    preview: '/images/templates/islamic-traditional-1.jpg',
    colors: ['#059669', '#1E40AF', '#F59E0B'],
    fonts: ['Noto Naskh Arabic', 'Arial', 'Helvetica'],
    photoPositions: 2,
    price: 2.00
  },
  {
    id: 'buddhist-simple-1',
    name: 'Simple Buddhist Memorial',
    category: 'funeral',
    culture: 'buddhist',
    style: 'simple',
    size: '5x7',
    preview: '/images/templates/buddhist-simple-1.jpg',
    colors: ['#059669', '#6B7280', '#F59E0B'],
    fonts: ['Inter', 'Arial', 'Helvetica'],
    photoPositions: 1,
    price: 2.00
  },
  {
    id: 'hindu-elegant-1',
    name: 'Elegant Hindu Memorial',
    category: 'funeral',
    culture: 'hindu',
    style: 'elegant',
    size: '6x8',
    preview: '/images/templates/hindu-elegant-1.jpg',
    colors: ['#DC2626', '#F59E0B', '#7C3AED'],
    fonts: ['Playfair Display', 'Arial', 'Helvetica'],
    photoPositions: 2,
    price: 3.00
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
  },
  {
    id: 'secular-modern-1',
    name: 'Modern Celebration of Life',
    category: 'celebration',
    culture: 'secular',
    style: 'modern',
    size: '6x8',
    preview: '/images/templates/secular-modern-1.jpg',
    colors: ['#3498DB', '#E74C3C', '#F39C12'],
    fonts: ['Inter', 'Roboto'],
    photoPositions: 2,
    price: 3.00
  },
  {
    id: 'secular-elegant-1',
    name: 'Elegant Celebration of Life',
    category: 'celebration',
    culture: 'secular',
    style: 'elegant',
    size: '6x8',
    preview: '/images/templates/secular-elegant-1.jpg',
    colors: ['#1F2937', '#F59E0B', '#DC2626'],
    fonts: ['Playfair Display', 'Georgia', 'Inter'],
    photoPositions: 3,
    price: 3.50
  },
  {
    id: 'memorial-service-1',
    name: 'Classic Memorial Service',
    category: 'memorial',
    culture: 'secular',
    style: 'traditional',
    size: '5x7',
    preview: '/images/templates/memorial-service-1.jpg',
    colors: ['#374151', '#6B7280', '#9CA3AF'],
    fonts: ['Georgia', 'Times New Roman', 'Serif'],
    photoPositions: 2,
    price: 2.00
  },
  {
    id: 'anniversary-celebration-1',
    name: 'Anniversary Celebration',
    category: 'anniversary',
    culture: 'secular',
    style: 'elegant',
    size: '6x8',
    preview: '/images/templates/anniversary-celebration-1.jpg',
    colors: ['#DC2626', '#F59E0B', '#7C3AED'],
    fonts: ['Playfair Display', 'Georgia', 'Inter'],
    photoPositions: 2,
    price: 3.00
  }
]

// Size and material options with pricing
const sizeOptions = [
  { id: '4x6', name: '4" x 6"', multiplier: 0.8, price: 1.60 },
  { id: '5x7', name: '5" x 7"', multiplier: 1.0, price: 2.00 },
  { id: '6x8', name: '6" x 8"', multiplier: 1.3, price: 2.60 },
  { id: 'A5', name: 'A5 (5.8" x 8.3")', multiplier: 1.2, price: 2.40 },
  { id: 'A4', name: 'A4 (8.3" x 11.7")', multiplier: 1.8, price: 3.60 }
]

const materialOptions = [
  { id: 'standard', name: 'Standard Paper', multiplier: 1.0, price: 0.00 },
  { id: 'premium', name: 'Premium Cardstock', multiplier: 1.5, price: 1.00 },
  { id: 'luxury', name: 'Luxury Paper', multiplier: 2.0, price: 2.00 },
  { id: 'textured', name: 'Textured Paper', multiplier: 1.8, price: 1.60 }
]

const shippingOptions = [
  { id: 'standard', name: 'Standard Shipping (5-7 days)', price: 5.99 },
  { id: 'express', name: 'Express Shipping (2-3 days)', price: 12.99 },
  { id: 'overnight', name: 'Overnight Shipping (1 day)', price: 24.99 },
  { id: 'pickup', name: 'Local Pickup', price: 0.00 }
]

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
    size: '5x7',
    material: 'standard',
    shipping: 'standard'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { id: 1, name: 'Occasion & Culture', icon: '🌹' },
    { id: 2, name: 'Template Selection', icon: '🎨' },
    { id: 3, name: 'Details & Message', icon: '✍️' },
    { id: 4, name: 'Photos & Colors', icon: '📸' },
    { id: 5, name: 'Preview & Order', icon: '✅' }
  ]

  // Filter templates based on user selections
  const getFilteredTemplates = () => {
    let filtered = mockTemplates

    // Filter by occasion/category
    if (wizardData.occasion) {
      const categoryMap: { [key: string]: string } = {
        'Funeral Service': 'funeral',
        'Celebration of Life': 'celebration',
        'Memorial Service': 'memorial',
        'Anniversary': 'anniversary'
      }
      const category = categoryMap[wizardData.occasion]
      if (category) {
        filtered = filtered.filter(t => t.category === category)
      }
    }

    // Filter by culture
    if (wizardData.culture) {
      filtered = filtered.filter(t => t.culture === wizardData.culture)
    }

    // Filter by style if selected
    if (wizardData.style) {
      filtered = filtered.filter(t => t.style === wizardData.style)
    }

    // If no filters applied or no matches, show all templates
    if (filtered.length === 0) {
      filtered = mockTemplates
    }

    return filtered
  }

  const calculateTotalPrice = () => {
    if (!wizardData.template) return 0
    
    const selectedSize = sizeOptions.find(s => s.id === wizardData.size)
    const selectedMaterial = materialOptions.find(m => m.id === wizardData.material)
    const selectedShipping = shippingOptions.find(s => s.id === wizardData.shipping)
    
    if (!selectedSize || !selectedMaterial || !selectedShipping) return 0
    
    // Base price per card (template base + size + material)
    const basePricePerCard = selectedSize.price + selectedMaterial.price
    
    // Apply bulk discount for larger quantities
    let discountMultiplier = 1.0
    if (wizardData.quantity >= 250) {
      discountMultiplier = 0.85 // 15% off for 250+ cards
    } else if (wizardData.quantity >= 200) {
      discountMultiplier = 0.90 // 10% off for 200+ cards
    } else if (wizardData.quantity >= 150) {
      discountMultiplier = 0.95 // 5% off for 150+ cards
    }
    
    // Total for all cards with discount
    const cardsTotal = (basePricePerCard * wizardData.quantity) * discountMultiplier
    
    // Add shipping cost (one-time)
    const shippingCost = selectedShipping.price
    
    return cardsTotal + shippingCost
  }

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return
    
    const newPhotos = Array.from(files)
    setWizardData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }))
  }

  const removePhoto = (index: number) => {
    setWizardData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
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
        return true
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/10 to-orange-300/10 dark:from-amber-600/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/10 to-pink-300/10 dark:from-rose-600/5 dark:to-pink-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent font-playfair mb-4">
              AI-Enhanced Template Wizard
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Create beautiful memorial invites with intelligent assistance
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6 mb-8">
            <div className="flex items-center justify-center">
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
                      currentStep > step.id ? 'bg-amber-500' : 'bg-slate-300 dark:border-slate-600'
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

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Occasion Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-amber-600" />
                      Type of Service
                    </h3>
                    <div className="space-y-3">
                      {['Funeral Service', 'Celebration of Life', 'Memorial Service', 'Anniversary'].map((occasion) => (
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
                            {culture === 'hindu' && 'ॐ'}
                            {culture === 'secular' && '🌍'}
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {culture}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-amber-600" />
                      Design Style
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['traditional', 'modern', 'elegant', 'simple', 'religious'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setWizardData(prev => ({ ...prev, style }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                            wizardData.style === style
                              ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                          }`}
                        >
                          <div className="text-2xl mb-2">
                            {style === 'traditional' && '🏛️'}
                            {style === 'modern' && '✨'}
                            {style === 'elegant' && '💎'}
                            {style === 'simple' && '🌿'}
                            {style === 'religious' && '🙏'}
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {style}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Template Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Choose Your Template
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    {wizardData.occasion && wizardData.culture 
                      ? `AI has selected ${getFilteredTemplates().length} templates for your ${wizardData.occasion.toLowerCase()} (${wizardData.culture} tradition)`
                      : 'Select your preferences above to see personalized templates'
                    }
                  </p>
                  {wizardData.occasion && wizardData.culture && (
                    <div className="mt-2">
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Showing {getFilteredTemplates().length} of {mockTemplates.length} total templates
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Filters:</span>
                        {wizardData.occasion && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                            {wizardData.occasion}
                          </span>
                        )}
                        {wizardData.culture && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                            {wizardData.culture}
                          </span>
                        )}
                        {wizardData.style && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                            {wizardData.style}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredTemplates().map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setWizardData(prev => ({ ...prev, template }))}
                      className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        wizardData.template?.id === template.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                      }`}
                    >
                      {/* Template Preview */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-xl flex items-center justify-center">
                        <Palette className="w-12 h-12 text-slate-400" />
                      </div>
                      
                      {/* Template Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                          {template.name}
                        </h3>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <p>Style: {template.style}</p>
                          <p>Size: {template.size}</p>
                          <p className="font-medium text-amber-600 dark:text-amber-400">
                            Base: ${template.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {wizardData.template?.id === template.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Show message if no templates match filters */}
                {getFilteredTemplates().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No templates match your current selections. Try adjusting your preferences above.
                    </p>
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Popular combinations with more templates:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => setWizardData(prev => ({ ...prev, culture: 'christian', style: 'elegant' }))}
                          className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                          Christian + Elegant (3 templates)
                        </button>
                        <button
                          onClick={() => setWizardData(prev => ({ ...prev, culture: 'secular', style: 'modern' }))}
                          className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                          Secular + Modern (2 templates)
                        </button>
                        <button
                          onClick={() => setWizardData(prev => ({ ...prev, culture: 'christian', style: 'traditional' }))}
                          className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                          Christian + Traditional (2 templates)
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setWizardData(prev => ({ ...prev, occasion: '', culture: '', style: '' }))}
                      className="px-4 py-2 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-200"
                    >
                      View All Templates
                    </button>
                  </div>
                )}

                {/* Show "View All" option if filters are applied */}
                {getFilteredTemplates().length > 0 && getFilteredTemplates().length < mockTemplates.length && (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Want to see more options? Try adjusting your preferences or view all templates.
                    </p>
                    <button
                      onClick={() => setWizardData(prev => ({ ...prev, occasion: '', culture: '', style: '' }))}
                      className="px-4 py-2 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-200"
                    >
                      View All {mockTemplates.length} Templates
                    </button>
                  </div>
                )}

                {/* What's Available Section */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    What's Available
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Cultures</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Christian:</span>
                          <span className="text-amber-600 dark:text-amber-400">3 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Jewish:</span>
                          <span className="text-amber-600 dark:text-amber-400">2 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Islamic:</span>
                          <span className="text-amber-600 dark:text-amber-400">2 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Secular:</span>
                          <span className="text-amber-600 dark:text-amber-400">4 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Buddhist:</span>
                          <span className="text-amber-600 dark:text-amber-400">1 template</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hindu:</span>
                          <span className="text-amber-600 dark:text-amber-400">1 template</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Styles</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Elegant:</span>
                          <span className="text-amber-600 dark:text-amber-400">4 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Traditional:</span>
                          <span className="text-amber-600 dark:text-amber-400">4 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Modern:</span>
                          <span className="text-amber-600 dark:text-amber-400">3 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Simple:</span>
                          <span className="text-amber-600 dark:text-amber-400">3 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Religious:</span>
                          <span className="text-amber-600 dark:text-amber-400">2 templates</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Occasions</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Funeral:</span>
                          <span className="text-amber-600 dark:text-amber-400">8 templates</span>
                          </div>
                        <div className="flex justify-between">
                          <span>Celebration:</span>
                          <span className="text-amber-600 dark:text-amber-400">3 templates</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memorial:</span>
                          <span className="text-amber-600 dark:text-amber-400">1 template</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Anniversary:</span>
                          <span className="text-amber-600 dark:text-amber-400">1 template</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Sizes</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>5x7":</span>
                          <span className="text-amber-600 dark:text-amber-400">Most popular</span>
                        </div>
                        <div className="flex justify-between">
                          <span>6x8":</span>
                          <span className="text-amber-600 dark:text-amber-400">Available</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4x6":</span>
                          <span className="text-amber-600 dark:text-amber-400">Compact</span>
                        </div>
                        <div className="flex justify-between">
                          <span>A4/A5:</span>
                          <span className="text-amber-600 dark:text-amber-400">Programs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size and Material Selection */}
                {wizardData.template && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Customize Your Order
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Quantity Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Quantity
                        </label>
                        <div className="space-y-2">
                          {[50, 100, 150, 200, 250, 300].map((qty) => (
                            <label
                              key={qty}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                wizardData.quantity === qty
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-amber-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="quantity"
                                value={qty}
                                checked={wizardData.quantity === qty}
                                onChange={(e) => setWizardData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {qty}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {qty >= 200 ? 'Bulk discount' : ''}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Size
                        </label>
                        <div className="space-y-2">
                          {sizeOptions.map((size) => (
                            <label
                              key={size.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                wizardData.size === size.id
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-amber-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="size"
                                value={size.id}
                                checked={wizardData.size === size.id}
                                onChange={(e) => setWizardData(prev => ({ ...prev, size: e.target.value }))}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {size.name}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                ${size.price.toFixed(2)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Material Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Material
                        </label>
                        <div className="space-y-2">
                          {materialOptions.map((material) => (
                            <label
                              key={material.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                wizardData.material === material.id
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-amber-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="material"
                                value={material.id}
                                checked={wizardData.material === material.id}
                                onChange={(e) => setWizardData(prev => ({ ...prev, material: e.target.value }))}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {material.name}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {material.price > 0 ? `+$${material.price.toFixed(2)}` : 'Included'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Shipping
                        </label>
                        <div className="space-y-2">
                          {shippingOptions.map((shipping) => (
                            <label
                              key={shipping.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                wizardData.shipping === shipping.id
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-amber-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="shipping"
                                value={shipping.id}
                                checked={wizardData.shipping === shipping.id}
                                onChange={(e) => setWizardData(prev => ({ ...prev, shipping: e.target.value }))}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {shipping.name}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {shipping.price > 0 ? `$${shipping.price.toFixed(2)}` : 'Free'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="mt-6 p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Base price per card:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            ${((sizeOptions.find(s => s.id === wizardData.size)?.price || 0) + (materialOptions.find(m => m.id === wizardData.material)?.price || 0)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {wizardData.quantity} cards
                          </span>
                        </div>
                        {(() => {
                          const qty = wizardData.quantity
                          let discount = 0
                          if (qty >= 250) discount = 15
                          else if (qty >= 200) discount = 10
                          else if (qty >= 150) discount = 5
                          return discount > 0 ? (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                              <span>Bulk discount ({discount}% off):</span>
                              <span className="font-medium">Applied</span>
                            </div>
                          ) : null
                        })()}
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Shipping:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {shippingOptions.find(s => s.id === wizardData.shipping)?.price === 0 ? 'Free' : `$${shippingOptions.find(s => s.id === wizardData.shipping)?.price.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                              ${calculateTotalPrice().toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        Service Location
                      </label>
                      <input
                        type="text"
                        value={wizardData.details.location}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, location: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        placeholder="Enter service location"
                      />
                    </div>
                  </div>

                  {/* Message & Contact */}
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
                        placeholder="Add a personal message or quote..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Contact Information
                      </label>
                      <textarea
                        value={wizardData.details.contactInfo}
                        onChange={(e) => setWizardData(prev => ({
                          ...prev,
                          details: { ...prev.details, contactInfo: e.target.value }
                        }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        placeholder="RSVP contact information..."
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
                    Add Photos & Colors
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    Upload photos and customize the color scheme
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Photo Upload</h3>
                    
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Click to upload photos or drag and drop
                      </p>
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
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                      >
                        Choose Photos
                      </button>
                    </div>

                    {/* Photo Preview */}
                    {wizardData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {wizardData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Color Scheme</h3>
                    
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
                          className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer"
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
                          className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer"
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
                          className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Preview & Order */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Preview & Order
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    Review your design and place your order
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Design Preview */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Design Preview</h3>
                    
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                      <div className="aspect-[5/7] bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-4">🎨</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {wizardData.template?.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {wizardData.details.deceasedName && `In Memory of ${wizardData.details.deceasedName}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Order Summary</h3>
                    
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
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
                          <span className="text-slate-600 dark:text-slate-400">Material:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {wizardData.material}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {wizardData.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Shipping:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {shippingOptions.find(s => s.id === wizardData.shipping)?.name}
                          </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-amber-600 dark:text-amber-400">
                              ${calculateTotalPrice().toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {currentStep < 5 && (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {currentStep === 5 && (
                  <button
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>Place Order</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
