// Print Service Types and Interfaces

export interface PrintProduct {
  id: string
  name: string
  category: 'memorial' | 'invitation' | 'program' | 'photo' | 'card'
  description: string
  basePrice: number
  rushPrice: number
  sameDayPrice: number
  turnaround: {
    standard: number // days
    rush: number // days
    sameDay: number // hours
  }
  sizes: PrintSize[]
  materials: PrintMaterial[]
  customization: CustomizationOptions
  images: string[] // product images
}

export interface PrintSize {
  id: string
  name: string
  width: number
  height: number
  unit: 'inch' | 'cm'
  priceMultiplier: number
}

export interface PrintMaterial {
  id: string
  name: string
  description: string
  quality: 'standard' | 'premium' | 'luxury'
  priceMultiplier: number
  available: boolean
}

export interface CustomizationOptions {
  text: boolean
  images: boolean
  colors: boolean
  fonts: boolean
  layouts: boolean
  maxImages: number
  maxTextLength: number
}

export interface PrintOrder {
  id: string
  userId: string
  sessionId?: string
  status: OrderStatus
  priority: 'standard' | 'rush' | 'same-day'
  products: OrderProduct[]
  customerInfo: CustomerInfo
  delivery: DeliveryInfo
  pricing: PricingBreakdown
  timeline: OrderTimeline
  provider: PrintProvider
  createdAt: Date
  updatedAt: Date
}

export interface OrderProduct {
  productId: string
  quantity: number
  size: string
  material: string
  customization: ProductCustomization
  unitPrice: number
  totalPrice: number
}

export interface ProductCustomization {
  text?: string
  images?: string[] // image URLs
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  font?: string
  layout?: string
  specialInstructions?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: Address
  specialRequirements?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface DeliveryInfo {
  method: 'pickup' | 'local-delivery' | 'shipping'
  address?: Address
  pickupLocation?: string
  preferredTime?: string
  specialInstructions?: string
}

export interface PricingBreakdown {
  subtotal: number
  rushFee: number
  deliveryFee: number
  tax: number
  total: number
  currency: string
}

export interface OrderTimeline {
  orderDate: Date
  productionStart?: Date
  productionComplete?: Date
  readyForPickup?: Date
  delivered?: Date
  estimatedCompletion: Date
  actualCompletion?: Date
}

export interface PrintProvider {
  id: string
  name: string
  type: 'online' | 'local'
  location?: string
  capabilities: string[]
  rating: number
  turnaround: {
    standard: number
    rush: number
    sameDay: number
  }
  available: boolean
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-production'
  | 'quality-check'
  | 'ready'
  | 'delivered'
  | 'cancelled'
  | 'failed'

// Print Service Provider Interface
export interface PrintService {
  createOrder(order: PrintOrder): Promise<OrderResponse>
  getOrderStatus(orderId: string): Promise<OrderStatus>
  cancelOrder(orderId: string): Promise<boolean>
  getPricing(products: OrderProduct[]): Promise<PricingBreakdown>
  getAvailableProviders(location: string, timeline: string): Promise<PrintProvider[]>
  estimateTurnaround(products: OrderProduct[], priority: string): Promise<number>
}

export interface OrderResponse {
  success: boolean
  orderId?: string
  message: string
  estimatedCompletion?: Date
  trackingUrl?: string
}

// Mock Data for Development
export const mockPrintProducts: PrintProduct[] = [
  {
    id: 'memorial-card-1',
    name: 'Memorial Cards',
    category: 'memorial',
    description: 'Beautiful memorial cards with customizable text and images',
    basePrice: 0.75,
    rushPrice: 1.25,
    sameDayPrice: 2.50,
    turnaround: {
      standard: 5,
      rush: 2,
      sameDay: 8
    },
    sizes: [
      { id: '4x6', name: '4" x 6"', width: 4, height: 6, unit: 'inch', priceMultiplier: 1.0 },
      { id: '5x7', name: '5" x 7"', width: 5, height: 7, unit: 'inch', priceMultiplier: 1.3 },
      { id: '6x8', name: '6" x 8"', width: 6, height: 8, unit: 'inch', priceMultiplier: 1.6 }
    ],
    materials: [
      { id: 'standard', name: 'Standard Cardstock', description: 'Quality cardstock paper', quality: 'standard', priceMultiplier: 1.0, available: true },
      { id: 'premium', name: 'Premium Cardstock', description: 'Heavy-duty premium paper', quality: 'premium', priceMultiplier: 1.4, available: true },
      { id: 'luxury', name: 'Luxury Cardstock', description: 'Ultra-premium textured paper', quality: 'luxury', priceMultiplier: 2.0, available: true }
    ],
    customization: {
      text: true,
      images: true,
      colors: true,
      fonts: true,
      layouts: true,
      maxImages: 3,
      maxTextLength: 500
    },
    images: ['/images/products/memorial-card-1.jpg', '/images/products/memorial-card-2.jpg']
  },
  {
    id: 'service-program-1',
    name: 'Service Programs',
    category: 'program',
    description: 'Professional service programs for memorial services',
    basePrice: 2.50,
    rushPrice: 4.00,
    sameDayPrice: 8.00,
    turnaround: {
      standard: 7,
      rush: 3,
      sameDay: 12
    },
    sizes: [
      { id: '8.5x11', name: '8.5" x 11"', width: 8.5, height: 11, unit: 'inch', priceMultiplier: 1.0 },
      { id: '5.5x8.5', name: '5.5" x 8.5"', width: 5.5, height: 8.5, unit: 'inch', priceMultiplier: 0.8 }
    ],
    materials: [
      { id: 'standard', name: 'Standard Paper', description: 'Quality printing paper', quality: 'standard', priceMultiplier: 1.0, available: true },
      { id: 'premium', name: 'Premium Paper', description: 'Heavy-weight premium paper', quality: 'premium', priceMultiplier: 1.3, available: true }
    ],
    customization: {
      text: true,
      images: true,
      colors: true,
      fonts: true,
      layouts: true,
      maxImages: 10,
      maxTextLength: 2000
    },
    images: ['/images/products/service-program-1.jpg', '/images/products/service-program-2.jpg']
  },
  {
    id: 'photo-book-1',
    name: 'Photo Books',
    category: 'photo',
    description: 'Custom photo books to preserve precious memories',
    basePrice: 15.00,
    rushPrice: 25.00,
    sameDayPrice: 50.00,
    turnaround: {
      standard: 10,
      rush: 5,
      sameDay: 24
    },
    sizes: [
      { id: '8x8', name: '8" x 8"', width: 8, height: 8, unit: 'inch', priceMultiplier: 1.0 },
      { id: '10x10', name: '10" x 10"', width: 10, height: 10, unit: 'inch', priceMultiplier: 1.4 },
      { id: '12x12', name: '12" x 12"', width: 12, height: 12, unit: 'inch', priceMultiplier: 1.8 }
    ],
    materials: [
      { id: 'softcover', name: 'Softcover', description: 'Flexible softcover binding', quality: 'standard', priceMultiplier: 1.0, available: true },
      { id: 'hardcover', name: 'Hardcover', description: 'Durable hardcover binding', quality: 'premium', priceMultiplier: 1.5, available: true }
    ],
    customization: {
      text: true,
      images: true,
      colors: true,
      fonts: true,
      layouts: true,
      maxImages: 50,
      maxTextLength: 5000
    },
    images: ['/images/products/photo-book-1.jpg', '/images/products/photo-book-2.jpg']
  }
]

export const mockPrintProviders: PrintProvider[] = [
  {
    id: 'printful-1',
    name: 'Printful',
    type: 'online',
    capabilities: ['memorial', 'invitation', 'program', 'photo', 'card'],
    rating: 4.8,
    turnaround: {
      standard: 5,
      rush: 2,
      sameDay: 0
    },
    available: true
  },
  {
    id: 'printify-1',
    name: 'Printify',
    type: 'online',
    capabilities: ['memorial', 'invitation', 'program', 'photo', 'card'],
    rating: 4.6,
    turnaround: {
      standard: 3,
      rush: 1,
      sameDay: 0
    },
    available: true
  },
  {
    id: 'local-print-1',
    name: 'Memorial Print Shop',
    type: 'local',
    location: 'Downtown Memorial District',
    capabilities: ['memorial', 'card', 'program'],
    rating: 4.9,
    turnaround: {
      standard: 3,
      rush: 1,
      sameDay: 8
    },
    available: true
  },
  {
    id: 'local-print-2',
    name: 'Express Print Services',
    type: 'local',
    location: 'Northside Business Center',
    capabilities: ['memorial', 'invitation', 'program', 'photo', 'card'],
    rating: 4.7,
    turnaround: {
      standard: 2,
      rush: 1,
      sameDay: 6
    },
    available: true
  }
]

// Utility Functions
export function calculateOrderPricing(
  products: OrderProduct[],
  priority: 'standard' | 'rush' | 'same-day',
  deliveryMethod: string
): PricingBreakdown {
  let subtotal = 0
  let rushFee = 0
  
  // Calculate product costs
  products.forEach(product => {
    const baseProduct = mockPrintProducts.find(p => p.id === product.productId)
    if (baseProduct) {
      let unitPrice = baseProduct.basePrice
      
      // Apply priority pricing
      switch (priority) {
        case 'rush':
          unitPrice = baseProduct.rushPrice
          rushFee += (baseProduct.rushPrice - baseProduct.basePrice) * product.quantity
          break
        case 'same-day':
          unitPrice = baseProduct.sameDayPrice
          rushFee += (baseProduct.sameDayPrice - baseProduct.basePrice) * product.quantity
          break
      }
      
      // Apply size and material multipliers
      const size = baseProduct.sizes.find(s => s.id === product.size)
      const material = baseProduct.materials.find(m => m.id === product.material)
      
      if (size) unitPrice *= size.priceMultiplier
      if (material) unitPrice *= material.priceMultiplier
      
      product.unitPrice = unitPrice
      product.totalPrice = unitPrice * product.quantity
      subtotal += product.totalPrice
    }
  })
  
  // Calculate delivery fee
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : 
                     deliveryMethod === 'local-delivery' ? 15 : 25
  
  // Calculate tax (simplified)
  const tax = subtotal * 0.08 // 8% tax rate
  
  const total = subtotal + rushFee + deliveryFee + tax
  
  return {
    subtotal,
    rushFee,
    deliveryFee,
    tax,
    total,
    currency: 'USD'
  }
}

export function estimateTurnaround(
  products: OrderProduct[],
  priority: 'standard' | 'rush' | 'same-day'
): number {
  let maxTurnaround = 0
  
  products.forEach(product => {
    const baseProduct = mockPrintProducts.find(p => p.id === product.productId)
    if (baseProduct) {
      let turnaround = 0
      switch (priority) {
        case 'standard':
          turnaround = baseProduct.turnaround.standard
          break
        case 'rush':
          turnaround = baseProduct.turnaround.rush
          break
        case 'same-day':
          turnaround = baseProduct.turnaround.sameDay / 24 // Convert hours to days
          break
      }
      maxTurnaround = Math.max(maxTurnaround, turnaround)
    }
  })
  
  return maxTurnaround
}
