export interface User {
  id: string
  householdSize: number
  region: string
  mainWaterUses: string[]
  createdAt: Date
}

export interface QuizAnswer {
  questionId: string
  value: string | string[] | number
  category: QuestionCategory
}

export interface QuizSession {
  id: string
  userId: string
  answers: QuizAnswer[]
  completedAt?: Date
  createdAt: Date
}

export type QuestionCategory = 'daily' | 'weekly' | 'monthly' | 'annual'
export type QuestionType = 'single' | 'multiple' | 'numeric' | 'slider'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface QuestionOption {
  id: string
  label: string
  value: string | number
  waterImpact?: number // liters per day saved/used
  suggestionText?: string
}

export interface Question {
  id: string
  category: QuestionCategory
  type: QuestionType
  title: string
  description?: string
  options?: QuestionOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  required?: boolean
  dependsOn?: {
    questionId: string
    values: (string | number)[]
  }
  isChallenge?: boolean
  challengeText?: string
}

export interface Suggestion {
  id: string
  title: string
  description: string
  impact: number // liters per day saved
  difficulty: DifficultyLevel
  feasibility: number // 0-1 score
  category: string
  priority: number // calculated score
  isChallenge?: boolean
  challengeText?: string
  isOtherTip?: boolean
}

export interface WaterUsageAnalysis {
  currentDailyUsage: number
  currentYearlyUsage: number
  potentialDailySavings: number
  potentialYearlySavings: number
  suggestions: Suggestion[]
  comparison: {
    message: string
  }
  categoryBreakdown?: Record<string, number> // daily liters by category
  lifestyleBreakdown?: Record<string, number> // daily liters by lifestyle subcategory
}


export interface AppState {
  user: User | null
  currentQuiz: QuizSession | null
  quizAnswers: Record<string, QuizAnswer>
  results: WaterUsageAnalysis | null
  onboardingCompleted: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface AnalyticsData {
  totalUsers: number
  averageSavings: number
  topSuggestions: Array<{
    id: string
    title: string
    usageCount: number
  }>
  regionalData: Array<{
    region: string
    averageUsage: number
    userCount: number
  }>
}
