import { TemplateWizard } from '../../components/templates/TemplateWizard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AfterLight - AI-Enhanced Template Wizard',
  description: 'Create beautiful memorial invites with intelligent AI assistance',
}

export default function TemplatesPage() {
  return <TemplateWizard />
}
