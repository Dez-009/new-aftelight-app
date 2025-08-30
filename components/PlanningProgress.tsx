import React from 'react'
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react'

export interface PlanningStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'ai_guided'
  aiInsight?: string
  revenueOpportunity?: string
  estimatedTime?: string
}

interface PlanningProgressProps {
  currentStep: number
  steps: PlanningStep[]
  onStepClick?: (stepId: number) => void
  showAIInsights?: boolean
  showRevenueOpportunities?: boolean
}

export function PlanningProgress({
  currentStep,
  steps,
  onStepClick,
  showAIInsights = true,
  showRevenueOpportunities = true
}: PlanningProgressProps) {
  const getStepIcon = (step: PlanningStep) => {
    if (step.status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (step.status === 'ai_guided') {
      return <Sparkles className="w-5 h-5 text-blue-500" />
    } else if (step.status === 'in_progress') {
      return <Clock className="w-5 h-5 text-orange-500" />
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepStatusColor = (step: PlanningStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-green-50'
      case 'ai_guided':
        return 'border-blue-500 bg-blue-50'
      case 'in_progress':
        return 'border-orange-500 bg-orange-50'
      default:
        return 'border-gray-300 bg-white'
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length
    return (completedSteps / steps.length) * 100
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 font-playfair">
            Memorial Planning Progress
          </h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(getProgressPercentage())}%
            </div>
            <div className="text-sm text-slate-600">
              {steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              step.id === currentStep ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            } ${getStepStatusColor(step)}`}
            onClick={() => onStepClick?.(step.id)}
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStepIcon(step)}
                <span className="text-sm font-medium text-gray-500">
                  Step {step.id}
                </span>
              </div>
              {step.estimatedTime && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  ~{step.estimatedTime}
                </span>
              )}
            </div>

            {/* Step Content */}
            <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 mb-3">{step.description}</p>

            {/* AI Insights */}
            {showAIInsights && step.aiInsight && step.status === 'ai_guided' && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">AI Insight</span>
                </div>
                <p className="text-xs text-blue-700">{step.aiInsight}</p>
              </div>
            )}

            {/* Revenue Opportunities */}
            {showRevenueOpportunities && step.revenueOpportunity && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-medium text-green-800">Revenue Opportunity</span>
                </div>
                <p className="text-xs text-green-700">{step.revenueOpportunity}</p>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                step.status === 'completed' ? 'bg-green-100 text-green-800' :
                step.status === 'ai_guided' ? 'bg-blue-100 text-blue-800' :
                step.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {step.status === 'completed' ? 'Completed' :
                 step.status === 'ai_guided' ? 'AI Guided' :
                 step.status === 'in_progress' ? 'In Progress' :
                 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Integration Notice */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">AI-Powered Guidance</h3>
            <p className="text-sm text-blue-700">
              Our AI assistant uses ChatGPT to provide personalized recommendations and automate 
              your planning workflow through n8n integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
