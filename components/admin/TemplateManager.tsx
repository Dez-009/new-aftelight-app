'use client'

import { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Download,
  Upload,
  Palette,
  Globe,
  Heart,
  Image as ImageIcon,
  Settings,
  Star,
  TrendingUp
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
  status: 'active' | 'draft' | 'archived'
  usageCount: number
  rating: number
  createdAt: string
  updatedAt: string
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
    price: 2.50,
    status: 'active',
    usageCount: 156,
    rating: 4.8,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
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
    price: 2.50,
    status: 'active',
    usageCount: 89,
    rating: 4.6,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
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
    price: 2.50,
    status: 'active',
    usageCount: 67,
    rating: 4.7,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
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
    price: 2.00,
    status: 'active',
    usageCount: 234,
    rating: 4.9,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22'
  },
  {
    id: 'buddhist-elegant-1',
    name: 'Elegant Buddhist Memorial',
    category: 'funeral',
    culture: 'buddhist',
    style: 'elegant',
    size: '5x7',
    preview: '/images/templates/buddhist-elegant-1.jpg',
    colors: ['#7C3AED', '#F59E0B', '#10B981'],
    fonts: ['Noto Sans Thai', 'Arial', 'Helvetica'],
    photoPositions: 2,
    price: 2.50,
    status: 'draft',
    usageCount: 0,
    rating: 0,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
]

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedCulture, setSelectedCulture] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = ['ALL', 'funeral', 'celebration', 'memorial', 'anniversary']
  const cultures = ['ALL', 'christian', 'jewish', 'islamic', 'buddhist', 'hindu', 'secular']
  const statuses = ['ALL', 'active', 'draft', 'archived']

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory
    const matchesCulture = selectedCulture === 'ALL' || template.culture === selectedCulture
    const matchesStatus = selectedStatus === 'ALL' || template.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesCulture && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'archived': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
    }
  }

  const getCultureIcon = (culture: string) => {
    switch (culture) {
      case 'christian': return '✝'
      case 'jewish': return '✡'
      case 'islamic': return '☪'
      case 'buddhist': return '☸'
      case 'hindu': return '🕉️'
      case 'secular': return '🌹'
      default: return '🌍'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'funeral': return '⚰️'
      case 'celebration': return '🎉'
      case 'memorial': return '🕯️'
      case 'anniversary': return '📅'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Template Management</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage and organize memorial design templates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Templates</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{templates.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Templates</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {templates.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Usage</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {templates.reduce((sum, t) => sum + t.usageCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Rating</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.filter(t => t.rating > 0).length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCulture}
              onChange={(e) => setSelectedCulture(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
            >
              {cultures.map(culture => (
                <option key={culture} value={culture}>
                  {culture === 'ALL' ? 'All Cultures' : culture.charAt(0).toUpperCase() + culture.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
                <div className="bg-current rounded-sm h-1"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              {/* Template Preview */}
              <div className="aspect-[5/7] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 px-2">{template.name}</div>
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(template.status)}`}>
                  {template.status}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {template.name}
                  </h3>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                    ${template.price}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  <span className="text-2xl">{getCultureIcon(template.culture)}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {template.style}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Used {template.usageCount} times</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    <span>{template.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Culture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                          <div className="text-2xl">🎨</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {template.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {template.size} • {template.photoPositions} photos
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(template.category)}</span>
                        <span className="text-sm text-slate-900 dark:text-white capitalize">
                          {template.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCultureIcon(template.culture)}</span>
                        <span className="text-sm text-slate-900 dark:text-white capitalize">
                          {template.culture}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(template.status)}`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                      {template.usageCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-amber-400" />
                        <span className="text-sm text-slate-900 dark:text-white">
                          {template.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600 dark:text-amber-400">
                      ${template.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      )}
    </div>
  )
}
