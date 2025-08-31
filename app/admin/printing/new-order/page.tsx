'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload,
  Palette,
  Type,
  Image as ImageIcon,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  Package
} from 'lucide-react'
import { 
  mockPrintProducts, 
  mockPrintProviders,
  calculateOrderPricing,
  estimateTurnaround,
  type PrintOrder,
  type OrderProduct,
  type PrintProduct,
  type PrintProvider
} from '../../../../lib/printServices'

export default function NewPrintOrder() {
  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      specialRequirements: ''
    },
    delivery: {
      method: 'pickup' as const,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      pickupLocation: '',
      preferredTime: '',
      specialInstructions: ''
    },
    priority: 'standard' as const,
    products: [] as OrderProduct[],
    provider: null as PrintProvider | null
  })

  const [activeStep, setActiveStep] = useState(1)
  const [pricing, setPricing] = useState({
    subtotal: 0,
    rushFee: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    currency: 'USD'
  })

  const addProduct = () => {
    const newProduct: OrderProduct = {
      productId: '',
      quantity: 1,
      size: '',
      material: '',
      customization: {
        text: '',
        images: [],
        colors: {
          primary: '#2C3E50',
          secondary: '#E74C3C',
          accent: '#F39C12'
        },
        font: 'Inter',
        layout: 'standard',
        specialInstructions: ''
      },
      unitPrice: 0,
      totalPrice: 0
    }
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }))
  }

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const updateProduct = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }))
  }

  const updateProductCustomization = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { 
          ...product, 
          customization: { 
            ...(product.customization || {}), 
            [field]: value 
          }
        } : product
      )
    }))
  }

  const calculatePricing = () => {
    if (formData.products.length === 0) return
    
    const newPricing = calculateOrderPricing(
      formData.products,
      formData.priority,
      formData.delivery.method
    )
    setPricing(newPricing)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle order submission
    console.log('Submitting order:', formData)
  }

  const steps = [
    { id: 1, name: 'Customer Info', icon: '👤' },
    { id: 2, name: 'Products', icon: '📦' },
    { id: 3, name: 'Customization', icon: '🎨' },
    { id: 4, name: 'Delivery', icon: '🚚' },
    { id: 5, name: 'Review', icon: '✅' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/printing"
            className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              New Print Order
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Create a new print order for memorial materials
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                activeStep >= step.id
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                <span className="text-sm">{step.icon}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-all duration-200 ${
                  activeStep > step.id ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeStep >= step.id
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Customer Info */}
        {activeStep === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerInfo.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: { ...prev.customerInfo, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerInfo.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: { ...prev.customerInfo, email: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerInfo.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: { ...prev.customerInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerInfo.address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      address: { ...prev.customerInfo.address, street: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerInfo.address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      address: { ...prev.customerInfo.address, city: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerInfo.address.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      address: { ...prev.customerInfo.address, state: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerInfo.address.zipCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    customerInfo: {
                      ...prev.customerInfo,
                      address: { ...prev.customerInfo.address, zipCode: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Special Requirements
              </label>
              <textarea
                value={formData.customerInfo.specialRequirements}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customerInfo: { ...prev.customerInfo, specialRequirements: e.target.value }
                }))}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {activeStep === 2 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Products & Quantities
              </h2>
              <button
                type="button"
                onClick={addProduct}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {formData.products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No products added yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Start by adding the memorial materials you need
                </p>
                <button
                  type="button"
                  onClick={addProduct}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.products.map((product, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        Product {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Product Type *
                        </label>
                        <select
                          required
                          value={product.productId}
                          onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        >
                          <option value="">Select a product</option>
                          {mockPrintProducts.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                        >
                          <option value="standard">Standard (3-7 days)</option>
                          <option value="rush">Rush (1-3 days)</option>
                          <option value="same-day">Same Day (2-8 hours)</option>
                        </select>
                      </div>
                    </div>

                    {product.productId && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Size
                            </label>
                            <select
                              value={product.size}
                              onChange={(e) => updateProduct(index, 'size', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                            >
                              <option value="">Select size</option>
                              {mockPrintProducts.find(p => p.id === product.productId)?.sizes.map((size) => (
                                <option key={size.id} value={size.id}>{size.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Material
                            </label>
                            <select
                              value={product.material}
                              onChange={(e) => updateProduct(index, 'material', e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                            >
                              <option value="">Select material</option>
                              {mockPrintProducts.find(p => p.id === product.productId)?.materials.map((material) => (
                                <option key={material.id} value={material.id}>{material.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customization */}
        {activeStep === 3 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Customization & Design
            </h2>
            {formData.products.map((product, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  {mockPrintProducts.find(p => p.id === product.productId)?.name} - Customization
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Custom Text
                    </label>
                    <textarea
                      value={product.customization.text || ''}
                      onChange={(e) => updateProductCustomization(index, 'text', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Enter custom text for this product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Color Scheme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Primary</label>
                        <input
                          type="color"
                          value={product.customization.colors?.primary || '#2C3E50'}
                          onChange={(e) => updateProductCustomization(index, 'colors', {
                            ...(product.customization.colors || {}),
                            primary: e.target.value
                          })}
                          className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Secondary</label>
                        <input
                          type="color"
                          value={product.customization.colors?.secondary || '#E74C3C'}
                          onChange={(e) => updateProductCustomization(index, 'colors', {
                            ...(product.customization.colors || {}),
                            secondary: e.target.value
                          })}
                          className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Accent</label>
                        <input
                          type="color"
                          value={product.customization.colors?.accent || '#F39C12'}
                          onChange={(e) => updateProductCustomization(index, 'colors', {
                            ...(product.customization.colors || {}),
                            accent: e.target.value
                          })}
                          className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={product.customization.specialInstructions || ''}
                      onChange={(e) => updateProductCustomization(index, 'specialInstructions', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                      placeholder="Any special instructions for this product..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Delivery */}
        {activeStep === 4 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Delivery & Pickup
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Delivery Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'pickup', label: 'Pickup', icon: MapPin, description: 'Pick up from our location' },
                    { value: 'local-delivery', label: 'Local Delivery', icon: Truck, description: 'Same-day local delivery' },
                    { value: 'shipping', label: 'Shipping', icon: Truck, description: 'Standard shipping' }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                        formData.delivery.method === method.value
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.value}
                        checked={formData.delivery.method === method.value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          delivery: { ...prev.delivery, method: e.target.value as any }
                        }))}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <method.icon className={`w-6 h-6 ${
                          formData.delivery.method === method.value
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-400'
                        }`} />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{method.label}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{method.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.delivery.method === 'pickup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Pickup Location
                  </label>
                  <select
                    value={formData.delivery.pickupLocation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      delivery: { ...prev.delivery, pickupLocation: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    <option value="">Select pickup location</option>
                    <option value="Downtown Memorial District">Downtown Memorial District</option>
                    <option value="Northside Business Center">Northside Business Center</option>
                    <option value="AfterLight Main Office">AfterLight Main Office</option>
                  </select>
                </div>
              )}

              {(formData.delivery.method !== 'pickup') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.delivery.address.street}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery,
                          address: { ...prev.delivery.address, street: e.target.value }
                        }
                      }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.delivery.address.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery,
                          address: { ...prev.delivery.address, city: e.target.value }
                        }
                      }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.delivery.address.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery,
                          address: { ...prev.delivery.address, state: e.target.value }
                        }
                      }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.delivery.address.zipCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery,
                          address: { ...prev.delivery.address, zipCode: e.target.value }
                        }
                      }))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Time
                </label>
                <input
                  type="text"
                  value={formData.delivery.preferredTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, preferredTime: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  placeholder="e.g., 2:00 PM - 4:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.delivery.specialInstructions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, specialInstructions: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {activeStep === 5 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Review & Submit
            </h2>
            
            <div className="space-y-6">
              {/* Customer Info Summary */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Name:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">{formData.customerInfo.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">{formData.customerInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">{formData.customerInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Address:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">
                      {formData.customerInfo.address.street}, {formData.customerInfo.address.city}, {formData.customerInfo.address.state} {formData.customerInfo.address.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Summary */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Products</h3>
                <div className="space-y-3">
                  {formData.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {mockPrintProducts.find(p => p.id === product.productId)?.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {product.quantity}x {product.size} {product.material}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          ${product.totalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          ${product.unitPrice.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                    <span className="text-slate-900 dark:text-white">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Rush Fee:</span>
                    <span className="text-slate-900 dark:text-white">${pricing.rushFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Delivery Fee:</span>
                    <span className="text-slate-900 dark:text-white">${pricing.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Tax:</span>
                    <span className="text-slate-900 dark:text-white">${pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-900 dark:text-white">Total:</span>
                      <span className="text-amber-600 dark:text-amber-400">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Summary */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Delivery</h3>
                <div className="text-sm">
                  <div className="mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Method:</span>
                    <span className="ml-2 text-slate-900 dark:text-white capitalize">
                      {formData.delivery.method.replace('-', ' ')}
                    </span>
                  </div>
                  {formData.delivery.method === 'pickup' && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Location:</span>
                      <span className="ml-2 text-slate-900 dark:text-white">{formData.delivery.pickupLocation}</span>
                    </div>
                  )}
                  {(formData.delivery.method !== 'pickup') && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Address:</span>
                      <span className="ml-2 text-slate-900 dark:text-white">
                        {formData.delivery.address.street}, {formData.delivery.address.city}, {formData.delivery.address.state} {formData.delivery.address.zipCode}
                      </span>
                    </div>
                  )}
                  {formData.delivery.preferredTime && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Preferred Time:</span>
                      <span className="ml-2 text-slate-900 dark:text-white">{formData.delivery.preferredTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {activeStep < 5 && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 2) calculatePricing()
                  setActiveStep(activeStep + 1)
                }}
                disabled={activeStep === 2 && formData.products.length === 0}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}

            {activeStep === 5 && (
              <button
                type="submit"
                className="px-8 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Submit Order
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
