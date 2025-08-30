'use client'

import { useState } from 'react'
import { PlanningProgress, PlanningStep } from '../../../components/PlanningProgress'

const sampleSteps: PlanningStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Collect deceased details and family contact information',
    status: 'completed',
    estimatedTime: '5 min',
    revenueOpportunity: 'Contact database for follow-up services'
  },
  {
    id: 2,
    title: 'Cultural Preferences',
    description: 'Identify religious and cultural traditions',
    status: 'ai_guided',
    estimatedTime: '8 min',
    aiInsight: 'Based on cultural background, recommend traditional invitation designs',
    revenueOpportunity: 'Custom invitation printing with cultural elements'
  },
  {
    id: 3,
    title: 'Service Type',
    description: 'Choose funeral, memorial, or celebration of life',
    status: 'in_progress',
    estimatedTime: '6 min',
    revenueOpportunity: 'Service program printing and keepsakes'
  },
  {
    id: 4,
    title: 'Venue & Timing',
    description: 'Select location, date, and time for the service',
    status: 'pending',
    estimatedTime: '10 min',
    revenueOpportunity: 'Venue coordination and timeline printing'
  },
  {
    id: 5,
    title: 'Service Details',
    description: 'Plan readings, music, eulogies, and special moments',
    status: 'pending',
    estimatedTime: '15 min',
    revenueOpportunity: 'Custom program design and printing'
  },
  {
    id: 6,
    title: 'Logistics',
    description: 'Arrange transportation, flowers, and catering',
    status: 'pending',
    estimatedTime: '12 min',
    revenueOpportunity: 'Vendor partnerships and service coordination'
  },
  {
    id: 7,
    title: 'Review & Confirm',
    description: 'Final checklist and submission',
    status: 'pending',
    estimatedTime: '8 min',
    revenueOpportunity: 'Complete service package and follow-up'
  }
]

export default function PlannerDemo() {
  const [currentStep, setCurrentStep] = useState(3)
  const [steps, setSteps] = useState(sampleSteps)

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
    
    // Update step status to show progression
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, status: 'in_progress' as const }
      } else if (step.id < stepId) {
        return { ...step, status: 'completed' as const }
      }
      return step
    }))
  }

  const resetProgress = () => {
    setSteps(sampleSteps)
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 font-playfair">
            Planning Wizard Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience our AI-powered memorial planning system with intelligent guidance 
            and revenue optimization opportunities.
          </p>
          
          {/* Demo Controls */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetProgress}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Reset Demo
            </button>
            <button
              onClick={() => handleStepClick(Math.min(currentStep + 1, 7))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Progress Bar Component */}
        <PlanningProgress
          currentStep={currentStep}
          steps={steps}
          onStepClick={handleStepClick}
          showAIInsights={true}
          showRevenueOpportunities={true}
        />

        {/* Demo Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-playfair">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  AI-Powered Guidance
                </h3>
                <p className="text-slate-600 mb-4">
                  Our ChatGPT integration analyzes your preferences and provides personalized 
                  recommendations for each planning step.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Cultural tradition suggestions</li>
                  <li>• Venue recommendations</li>
                  <li>• Timeline optimization</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    2
                  </span>
                  Revenue Optimization
                </h3>
                <p className="text-slate-600 mb-4">
                  Each step identifies opportunities to provide premium services and products 
                  that enhance the memorial experience.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Custom printing services</li>
                  <li>• Premium materials</li>
                  <li>• Vendor partnerships</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                n8n Automation
              </h3>
              <p className="text-blue-700">
                Our n8n workflows automatically handle invitations, social media posts, 
                email campaigns, and follow-up communications to maximize engagement and revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
