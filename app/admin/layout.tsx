import { AfterLightIcon } from '../../components/AfterLightIcon'
import { Metadata } from 'next'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { AdminHeader } from '../../components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'AfterLight - Admin Dashboard',
  description: 'Administrative dashboard for AfterLight memorial planning platform.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-amber-950 dark:to-orange-950 transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/10 to-orange-300/10 dark:from-amber-600/5 dark:to-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-rose-200/10 to-pink-300/10 dark:from-rose-600/5 dark:to-pink-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Admin Interface */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl transition-all duration-300">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
