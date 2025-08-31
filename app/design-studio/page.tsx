import { CulturalDesignStudio } from '../../components/design/CulturalDesignStudio'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AfterLight - Cultural Design Studio',
  description: 'Create beautiful, culturally appropriate memorial designs with AI assistance',
}

export default function DesignStudioPage() {
  return <CulturalDesignStudio />
}
