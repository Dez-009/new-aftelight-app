'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  DollarSign,
  MapPin,
  Star,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle
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
} from '../../../lib/printServices'

// Mock order data
const mockOrders: PrintOrder[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    sessionId: 'session-001',
    status: 'in-production',
    priority: 'rush',
    products: [
      {
        productId: 'memorial-card-1',
        quantity: 100,
        size: '5x7',
        material: 'premium',
        customization: {
          text: 'In Loving Memory of John Smith',
          images: ['/images/memorial/john-smith.jpg'],
          colors: { primary: '#2C3E50', secondary: '#E74C3C', accent: '#F39C12' }
        },
        unitPrice: 1.75,
        totalPrice: 175.00
      }
    ],
    customerInfo: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Memory Lane',
        city: 'Memorial City',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    },
    delivery: {
      method: 'local-delivery',
      address: {
        street: '123 Memory Lane',
        city: 'Memorial City',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      preferredTime: '2:00 PM - 4:00 PM'
    },
    pricing: {
      subtotal: 175.00,
      rushFee: 50.00,
      deliveryFee: 15.00,
      tax: 19.20,
      total: 259.20,
      currency: 'USD'
    },
    timeline: {
      orderDate: new Date('2024-08-28T10:00:00Z'),
      productionStart: new Date('2024-08-28T14:00:00Z'),
      estimatedCompletion: new Date('2024-08-30T17:00:00Z')
    },
    provider: mockPrintProviders[2], // Local print shop
    createdAt: new Date('2024-08-28T10:00:00Z'),
    updatedAt: new Date('2024-08-28T14:00:00Z')
  },
  {
    id: 'order-002',
    userId: 'user-002',
    sessionId: 'session-002',
    status: 'ready',
    priority: 'same-day',
    products: [
      {
        productId: 'service-program-1',
        quantity: 50,
        size: '8.5x11',
        material: 'standard',
        customization: {
          text: 'Celebration of Life for Mary Davis',
          images: ['/images/memorial/mary-davis.jpg'],
          colors: { primary: '#8E44AD', secondary: '#9B59B6', accent: '#E8DAEF' }
        },
        unitPrice: 2.50,
        totalPrice: 125.00
      }
    ],
    customerInfo: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 987-6543',
      address: {
        street: '456 Remembrance Ave',
        city: 'Memorial City',
        state: 'CA',
        zipCode: '90211',
        country: 'USA'
      }
    },
    delivery: {
      method: 'pickup',
      pickupLocation: 'Downtown Memorial District'
    },
    pricing: {
      subtotal: 125.00,
      rushFee: 125.00,
      deliveryFee: 0,
      tax: 20.00,
      total: 270.00,
      currency: 'USD'
    },
    timeline: {
      orderDate: new Date('2024-08-28T08:00:00Z'),
      productionStart: new Date('2024-08-28T09:00:00Z'),
      productionComplete: new Date('2024-08-28T16:00:00Z'),
      readyForPickup: new Date('2024-08-28T16:00:00Z'),
      estimatedCompletion: new Date('2024-08-28T16:00:00Z')
    },
    provider: mockPrintProviders[2], // Local print shop
    createdAt: new Date('2024-08-28T08:00:00Z'),
    updatedAt: new Date('2024-08-28T16:00:00Z')
  }
]

const orderStatuses = ['ALL', 'pending', 'confirmed', 'in-production', 'quality-check', 'ready', 'delivered', 'cancelled', 'failed']
const priorities = ['ALL', 'standard', 'rush', 'same-day']

export default function PrintServicesAdmin() {
  const [orders, setOrders] = useState(mockOrders)
  const [products] = useState(mockPrintProducts)
  const [providers] = useState(mockPrintProviders)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'providers'>('orders')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus
    const matchesPriority = selectedPriority === 'ALL' || order.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'in-production':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'quality-check':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'standard':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'rush':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'same-day':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-production':
        return <Package className="w-4 h-4" />
      case 'quality-check':
        return <AlertCircle className="w-4 h-4" />
      case 'ready':
        return <CheckCircle className="w-4 h-4" />
      case 'delivered':
        return <Truck className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Print Services
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage print orders, products, and service providers
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/printing/new-order"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </Link>
          <Link
            href="/admin/printing/new-product"
            className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg font-medium transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Printer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Production</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {orders.filter(o => o.status === 'in-production').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ready for Pickup</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {orders.filter(o => o.status === 'ready').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${orders.reduce((sum, order) => sum + order.pricing.total, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'orders', label: 'Orders', count: orders.length },
              { id: 'products', label: 'Products', count: products.length },
              { id: 'providers', label: 'Providers', count: providers.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-300 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search orders by customer name or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'ALL' ? 'All Statuses' : status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-48">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-200"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === 'ALL' ? 'All Priorities' : priority.replace('-', ' ').charAt(0).toUpperCase() + priority.replace('-', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Products
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{order.id}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{order.customerInfo.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{order.customerInfo.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {order.products.map((product, index) => (
                                <div key={index} className="text-sm text-slate-900 dark:text-white">
                                  {product.quantity}x {products.find(p => p.id === product.productId)?.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                                {order.status.replace('-', ' ').charAt(0).toUpperCase() + order.status.replace('-', ' ').slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(order.priority)}`}>
                              {order.priority.replace('-', ' ').charAt(0).toUpperCase() + order.priority.replace('-', ' ').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900 dark:text-white">
                              ${order.pricing.total.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Printer className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No orders found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{product.category}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{product.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Base Price:</span>
                      <span className="text-slate-900 dark:text-white">${product.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Rush Price:</span>
                      <span className="text-slate-900 dark:text-white">${product.rushPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Same Day:</span>
                      <span className="text-slate-900 dark:text-white">${product.sameDayPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{provider.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm text-slate-900 dark:text-white">{provider.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      provider.type === 'local' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {provider.type.charAt(0).toUpperCase() + provider.type.slice(1)}
                    </span>
                    {provider.location && (
                      <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Standard:</span>
                      <span className="text-slate-900 dark:text-white">{provider.turnaround.standard} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Rush:</span>
                      <span className="text-slate-900 dark:text-white">{provider.turnaround.rush} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Same Day:</span>
                      <span className="text-slate-900 dark:text-white">{provider.turnaround.sameDay} hours</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
