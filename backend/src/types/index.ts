export interface QuizAnswer {
  questionId: string
  value: string | string[] | number
  category: string
}

export interface QuizSession {
  id: string
  userId: string
  answers: QuizAnswer[]
  completedAt?: Date
  createdAt: Date
}

export interface User {
  id: string
  householdSize: number
  region: string
  mainWaterUses: string[]
  createdAt: Date
}

export interface Suggestion {
  id: string
  title: string
  description: string
  impact: number
  difficulty: 'easy' | 'medium' | 'hard'
  feasibility: number
  category: string
  priority: number
  isChallenge?: boolean
  challengeText?: string
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

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
