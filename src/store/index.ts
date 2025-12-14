import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, User, QuizAnswer, WaterUsageAnalysis } from '../types'

interface AppStore extends AppState {
  // Actions
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  setQuizAnswers: (answers: Record<string, QuizAnswer>) => void
  addQuizAnswer: (questionId: string, answer: QuizAnswer) => void
  setCurrentQuiz: (quiz: AppState['currentQuiz']) => void
  setResults: (results: WaterUsageAnalysis) => void
  setOnboardingCompleted: (completed: boolean) => void
  reset: () => void
}

const initialState: AppState = {
  user: null,
  currentQuiz: null,
  quizAnswers: {},
  results: null,
  onboardingCompleted: false,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setQuizAnswers: (answers) => set({ quizAnswers: answers }),

      addQuizAnswer: (questionId, answer) =>
        set((state) => ({
          quizAnswers: {
            ...state.quizAnswers,
            [questionId]: answer,
          },
        })),

      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

      setResults: (results) => set({ results }),

      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),

      reset: () => set(initialState),
    }),
    {
      name: 'sukoc-storage',
      partialize: (state) => ({
        user: state.user,
        quizAnswers: state.quizAnswers,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
)

// Selectors
export const useUser = () => useAppStore((state) => state.user)
export const useQuizAnswers = () => useAppStore((state) => state.quizAnswers)
export const useCurrentQuiz = () => useAppStore((state) => state.currentQuiz)
export const useResults = () => useAppStore((state) => state.results)
export const useOnboardingCompleted = () => useAppStore((state) => state.onboardingCompleted)
