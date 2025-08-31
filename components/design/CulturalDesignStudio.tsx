'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  RotateCcw,
  Heart,
  Star,
  Eye,
  EyeOff,
  Layers,
  Settings,
  Wand2,
  Lightbulb,
  Globe,
  BookOpen,
  Plus,
  Trash2,
  Move,
  RotateCw
} from 'lucide-react'
import { mockPrintProducts } from '../../lib/printServices'

interface DesignElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'background'
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  zIndex: number
  styles: {
    fontFamily: string
    fontSize: number
    fontWeight: string
    color: string
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    shadow?: string
  }
}

interface CulturalTheme {
  id: string
  name: string
  description: string
  culture: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: string[]
  patterns: string[]
  symbols: string[]
  preview: string
}

const culturalThemes: CulturalTheme[] = [
  {
    id: 'christian-traditional',
    name: 'Christian Traditional',
    description: 'Classic Christian memorial design with crosses and religious symbols',
    culture: 'Christian',
    colors: {
      primary: '#2C3E50',
      secondary: '#E74C3C',
      accent: '#F39C12',
      background: '#F8F9FA',
      text: '#2C3E50'
    },
    fonts: ['Playfair Display', 'Georgia', 'Times New Roman'],
    patterns: ['cross', 'dove', 'candle', 'roses'],
    symbols: ['✝', '🕊️', '🕯️', '🌹'],
    preview: '/images/themes/christian-traditional.jpg'
  },
  {
    id: 'jewish-traditional',
    name: 'Jewish Traditional',
    description: 'Respectful Jewish memorial design with Star of David and Hebrew text',
    culture: 'Jewish',
    colors: {
      primary: '#1E3A8A',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FEF3C7',
      text: '#1E3A8A'
    },
    fonts: ['Noto Sans Hebrew', 'Arial', 'Helvetica'],
    patterns: ['star-of-david', 'menorah', 'olive-branch', 'dove'],
    symbols: ['✡', '🕎', '🕊️', '🫒'],
    preview: '/images/themes/jewish-traditional.jpg'
  },
  {
    id: 'islamic-traditional',
    name: 'Islamic Traditional',
    description: 'Beautiful Islamic memorial design with geometric patterns and Arabic calligraphy',
    culture: 'Islamic',
    colors: {
      primary: '#059669',
      secondary: '#DC2626',
      accent: '#7C3AED',
      background: '#F0FDF4',
      text: '#059669'
    },
    fonts: ['Noto Naskh Arabic', 'Arial', 'Helvetica'],
    patterns: ['geometric', 'arabesque', 'crescent', 'star'],
    symbols: ['☪', '⭐', '🌙', '🕌'],
    preview: '/images/themes/islamic-traditional.jpg'
  },
  {
    id: 'buddhist-traditional',
    name: 'Buddhist Traditional',
    description: 'Peaceful Buddhist memorial design with lotus flowers and meditation symbols',
    culture: 'Buddhist',
    colors: {
      primary: '#7C3AED',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FEF3C7',
      text: '#7C3AED'
    },
    fonts: ['Noto Sans', 'Arial', 'Helvetica'],
    patterns: ['lotus', 'dharma-wheel', 'buddha', 'peace'],
    symbols: ['🪷', '☸', '🧘', '☮️'],
    preview: '/images/themes/christian-traditional.jpg'
  },
  {
    id: 'hindu-traditional',
    name: 'Hindu Traditional',
    description: 'Vibrant Hindu memorial design with sacred symbols and traditional motifs',
    culture: 'Hindu',
    colors: {
      primary: '#DC2626',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FEF3C7',
      text: '#DC2626'
    },
    fonts: ['Noto Sans Devanagari', 'Arial', 'Helvetica'],
    patterns: ['om-symbol', 'lotus', 'swastika', 'diya'],
    symbols: ['🕉️', '🪷', '🕯️', '🪔'],
    preview: '/images/themes/christian-traditional.jpg'
  }
]

const fonts = [
  'Inter',
  'Playfair Display',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Noto Sans',
  'Noto Serif'
]

export function CulturalDesignStudio() {
  const [selectedTheme, setSelectedTheme] = useState<CulturalTheme | null>(null)
  const [designElements, setDesignElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [showAI, setShowAI] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'design' | 'preview'>('design')
  const [showLayers, setShowLayers] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize with default theme
  useEffect(() => {
    if (culturalThemes.length > 0 && !selectedTheme) {
      setSelectedTheme(culturalThemes[0])
      initializeDesign(culturalThemes[0])
    }
  }, [selectedTheme])

  const initializeDesign = (theme: CulturalTheme) => {
    const defaultElements: DesignElement[] = [
      {
        id: 'title-1',
        type: 'text',
        content: 'In Loving Memory',
        x: 400,
        y: 100,
        width: 300,
        height: 60,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        styles: {
          fontFamily: theme.fonts[0],
          fontSize: 32,
          fontWeight: 'bold',
          color: theme.colors.primary,
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'subtitle-1',
        type: 'text',
        content: 'Celebrating a Life Well Lived',
        x: 400,
        y: 180,
        width: 300,
        height: 40,
        rotation: 0,
        opacity: 0.8,
        zIndex: 2,
        styles: {
          fontFamily: theme.fonts[0],
          fontSize: 18,
          fontWeight: 'normal',
          color: theme.colors.secondary,
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'symbol-1',
        type: 'text',
        content: theme.symbols[0] || '❤️',
        x: 400,
        y: 300,
        width: 80,
        height: 80,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        styles: {
          fontFamily: 'Arial',
          fontSize: 48,
          fontWeight: 'normal',
          color: theme.colors.accent,
          backgroundColor: 'transparent'
        }
      }
    ]
    setDesignElements(defaultElements)
  }

  const addElement = (type: 'text' | 'image' | 'shape' | 'background') => {
    const newElement: DesignElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : type === 'image' ? '🖼️' : '●',
      x: Math.random() * (canvasSize.width - 100),
      y: Math.random() * (canvasSize.height - 100),
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      rotation: 0,
      opacity: 1,
      zIndex: designElements.length + 1,
      styles: {
        fontFamily: selectedTheme?.fonts[0] || 'Inter',
        fontSize: type === 'text' ? 16 : 24,
        fontWeight: 'normal',
        color: selectedTheme?.colors.primary || '#000000',
        backgroundColor: type === 'shape' ? selectedTheme?.colors.accent || '#cccccc' : 'transparent'
      }
    }
    setDesignElements([...designElements, newElement])
    setSelectedElement(newElement)
  }

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setDesignElements(elements =>
      elements.map(el => el.id === id ? { ...el, ...updates } : el)
    )
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates })
    }
  }

  const deleteElement = (id: string) => {
    setDesignElements(elements => elements.filter(el => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  const generateAIDesign = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiElements: DesignElement[] = [
      {
        id: 'ai-title',
        type: 'text',
        content: 'Forever in Our Hearts',
        x: 400,
        y: 120,
        width: 350,
        height: 70,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
        styles: {
          fontFamily: selectedTheme?.fonts[1] || 'Playfair Display',
          fontSize: 36,
          fontWeight: 'bold',
          color: selectedTheme?.colors.primary || '#2C3E50',
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'ai-pattern',
        type: 'shape',
        content: '✦',
        x: 200,
        y: 250,
        width: 60,
        height: 60,
        rotation: 45,
        opacity: 0.7,
        zIndex: 1,
        styles: {
          fontFamily: 'Arial',
          fontSize: 36,
          fontWeight: 'normal',
          color: selectedTheme?.colors.accent || '#F39C12',
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'ai-pattern-2',
        type: 'shape',
        content: '✦',
        x: 600,
        y: 250,
        width: 60,
        height: 60,
        rotation: -45,
        opacity: 0.7,
        zIndex: 1,
        styles: {
          fontFamily: 'Arial',
          fontSize: 36,
          fontWeight: 'normal',
          color: selectedTheme?.colors.accent || '#F39C12',
          backgroundColor: 'transparent'
        }
      }
    ]
    
    setDesignElements([...designElements, ...aiElements])
    setAiSuggestion('AI has added elegant typography and balanced decorative elements to enhance your design.')
    setIsGenerating(false)
  }

  const exportDesign = () => {
    // Create a canvas element to export the design
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height
    
    // Set background
    ctx.fillStyle = selectedTheme?.colors.background || '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Render design elements
    designElements.forEach(element => {
      ctx.save()
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
      ctx.rotate(element.rotation * Math.PI / 180)
      ctx.globalAlpha = element.opacity
      
      if (element.type === 'text') {
        ctx.font = `${element.styles.fontWeight} ${element.styles.fontSize}px ${element.styles.fontFamily}`
        ctx.fillStyle = element.styles.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(element.content, 0, 0)
      } else if (element.type === 'shape') {
        ctx.font = `${element.styles.fontSize}px Arial`
        ctx.fillStyle = element.styles.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(element.content, 0, 0)
      }
      
      ctx.restore()
    })
    
    // Download the image
    const link = document.createElement('a')
    link.download = 'memorial-design.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const resetDesign = () => {
    if (selectedTheme) {
      initializeDesign(selectedTheme)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 font-playfair bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Cultural Design Studio
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create beautiful, culturally appropriate memorial designs with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Tools & Themes */}
          <div className="xl:col-span-1 space-y-6">
            {/* Cultural Theme Selection */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-amber-600" />
                Cultural Themes
              </h3>
              <div className="space-y-3">
                {culturalThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme)
                      initializeDesign(theme)
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      selectedTheme?.id === theme.id
                        ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                           style={{ backgroundColor: theme.colors.primary }}>
                        {theme.culture[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{theme.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{theme.culture}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Design Tools */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-amber-600" />
                Design Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addElement('text')}
                  className="group p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 hover:from-amber-200 dark:hover:from-amber-800/50 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Type className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Text</span>
                </button>
                <button
                  onClick={() => addElement('shape')}
                  className="group p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 hover:from-amber-200 dark:hover:from-amber-800/50 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Layers className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Shape</span>
                </button>
                <button
                  onClick={() => addElement('image')}
                  className="group p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 hover:from-amber-200 dark:hover:from-amber-800/50 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <ImageIcon className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Image</span>
                </button>
                <button
                  onClick={() => addElement('background')}
                  className="group p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 hover:from-amber-200 dark:hover:from-amber-800/50 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Palette className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Background</span>
                </button>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-600" />
                AI Assistant
              </h3>
              <button
                onClick={generateAIDesign}
                disabled={isGenerating}
                className="w-full p-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:via-orange-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate AI Design
                  </div>
                )}
              </button>
              {aiSuggestion && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{aiSuggestion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-amber-600" />
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={exportDesign}
                  className="w-full p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Design
                </button>
                <button
                  onClick={resetDesign}
                  className="w-full p-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Design
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-8">
              {/* Canvas Toolbar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setViewMode('design')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === 'design'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    Design Mode
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === 'preview'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <EyeOff className="w-4 h-4 mr-2 inline" />
                    Preview Mode
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLayers(!showLayers)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      showLayers
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative">
                <div
                  ref={canvasRef}
                  className="mx-auto border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-2xl relative overflow-hidden shadow-2xl"
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    backgroundColor: selectedTheme?.colors.background || '#ffffff'
                  }}
                >
                  {designElements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={`absolute cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedElement?.id === element.id
                          ? 'ring-4 ring-amber-500 ring-offset-2'
                          : ''
                      }`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg)`,
                        opacity: element.opacity,
                        zIndex: element.zIndex,
                        fontFamily: element.styles.fontFamily,
                        fontSize: element.styles.fontSize,
                        fontWeight: element.styles.fontWeight,
                        color: element.styles.color,
                        backgroundColor: element.styles.backgroundColor,
                        border: element.styles.borderWidth ? `${element.styles.borderWidth}px solid ${element.styles.borderColor}` : 'none',
                        borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius}px` : '0',
                        boxShadow: element.styles.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {element.type === 'text' ? (
                        <div className="w-full h-full flex items-center justify-center text-center p-2">
                          {element.content}
                        </div>
                      ) : element.type === 'shape' ? (
                        <div className="w-full h-full flex items-center justify-center text-center p-2">
                          {element.content}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-center p-2">
                          {element.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties & Layers */}
          <div className="xl:col-span-1 space-y-6">
            {/* Element Properties */}
            {selectedElement && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-amber-600" />
                  Element Properties
                </h3>
                <div className="space-y-4">
                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content
                    </label>
                    <input
                      type="text"
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    />
                  </div>

                  {/* Position */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        X Position
                      </label>
                      <input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Y Position
                      </label>
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Size */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Text Properties */}
                  {selectedElement.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Font Family
                        </label>
                        <select
                          value={selectedElement.styles.fontFamily}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, fontFamily: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Font Size
                        </label>
                        <input
                          type="number"
                          value={selectedElement.styles.fontSize}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, fontSize: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={selectedElement.styles.color}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, color: e.target.value }
                          })}
                          className="w-full h-12 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteElement(selectedElement.id)}
                    className="w-full p-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Element
                  </button>
                </div>
              </div>
            )}

            {/* Layers Panel */}
            {showLayers && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-amber-600" />
                  Layers
                </h3>
                <div className="space-y-2">
                  {designElements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedElement?.id === element.id
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-300 dark:border-amber-600'
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full shadow-sm"
                               style={{ backgroundColor: element.styles.color }}></div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {element.type} - {element.content.substring(0, 20)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Z-{element.zIndex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
