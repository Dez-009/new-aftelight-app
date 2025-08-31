'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  Shield, 
  FileText, 
  Settings, 
  BarChart3, 
  Printer,
  Calendar,
  Heart,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react'
import { AfterLightIcon } from '../AfterLightIcon'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  roles: string[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and analytics',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users and roles',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'Planning Sessions',
    href: '/admin/sessions',
    icon: Calendar,
    description: 'Monitor planning activities',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'Cultural Traditions',
    href: '/admin/cultural',
    icon: Heart,
    description: 'Manage cultural presets',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'Print Services',
    href: '/admin/printing',
    icon: Printer,
    description: 'Same-day copy automation',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'Design Studio',
    href: '/design-studio',
    icon: Palette,
    description: 'Create cultural memorial designs',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'Revenue Tracking',
    href: '/admin/revenue',
    icon: BarChart3,
    description: 'Monitor business metrics',
    roles: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Platform configuration',
    roles: ['SUPER_ADMIN']
  }
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  
  // Mock user data - replace with actual auth context
  const currentUser = {
    name: 'Desmond Hughes',
    email: 'deshughes83@gmail.com',
    role: 'SUPER_ADMIN',
    avatar: 'DH'
  }

  return (
    <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-amber-200/50 dark:border-amber-700/50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-200/50 dark:border-amber-700/50">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <AfterLightIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span className="font-bold text-slate-900 dark:text-white">Admin</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-amber-200/50 dark:border-amber-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300'
              }`}
              title={isCollapsed ? item.description : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                isActive ? 'text-white' : 'text-amber-500 dark:text-amber-400'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{item.name}</span>
                  {!isCollapsed && (
                    <p className="text-xs opacity-75 truncate">{item.description}</p>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-amber-200/50 dark:border-amber-700/50">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AfterLight Admin
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              v1.0.0
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
