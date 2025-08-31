import { TemplateManager } from '../../../components/admin/TemplateManager'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AfterLight Admin - Template Management',
  description: 'Manage and organize memorial design templates',
}

export default function AdminTemplatesPage() {
  return <TemplateManager />
}
