import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { waterCalculator } from '../utils/waterCalculator'
import { QuestionCard } from '../components/quiz/QuestionCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import type { Question, QuizAnswer } from '../types'

export const QuizPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, quizAnswers, addQuizAnswer, setCurrentQuiz, setResults } = useAppStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load questions based on user's main water uses
    const allQuestions = waterCalculator.getAllQuestions()
    
    // Filter questions based on user's main water uses and dependencies
    const filteredQuestions = allQuestions.filter(question => {
      // If question has dependencies, check if they're met
      if (question.dependsOn) {
        const dependentAnswer = quizAnswers[question.dependsOn.questionId]
        if (!dependentAnswer) return false
        
        const dependentValue = dependentAnswer.value
        return question.dependsOn.values.includes(dependentValue)
      }
      
      // For now, include all questions
      return true
    })

    setQuestions(filteredQuestions)
    setIsLoading(false)
  }, [user, quizAnswers, navigate])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerChange = (value: string | string[] | number) => {
    if (!currentQuestion) return

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      value,
      category: currentQuestion.category,
    }

    addQuizAnswer(currentQuestion.id, answer)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleFinishQuiz = () => {
    const effectiveUser = user || { id: 'guest', householdSize: 1, region: '', mainWaterUses: [] }
    // Calculate results
    const analysis = waterCalculator.calculateWaterUsage(quizAnswers, effectiveUser.householdSize || 1)
    setResults(analysis)

    // Create quiz session
    const quizSession = {
      id: `quiz-${Date.now()}`,
      userId: effectiveUser.id,
      answers: Object.values(quizAnswers),
      completedAt: new Date(),
      createdAt: new Date(),
    }
    setCurrentQuiz(quizSession)

    navigate('/results')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-accent-600">Sorular yükleniyor...</p>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-accent-600">Quiz tamamlandı!</p>
          <Button onClick={handleFinishQuiz} className="mt-4">
            Sonuçları Gör
          </Button>
        </Card>
      </div>
    )
  }

  const currentAnswer = quizAnswers[currentQuestion.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent-900 mb-2">
            Su Kullanım Analizi
          </h1>
          <p className="text-accent-600">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentAnswer?.value}
            onChange={handleAnswerChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === questions.length - 1}
            progress={progress}
          />
        </AnimatePresence>

        {/* Navigation hints */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-4 text-sm text-accent-500">
            <span>← Önceki soru için</span>
            <span>•</span>
            <span>İleri → sonraki soru için</span>
            <span>•</span>
            <span>Enter tuşu ile ilerle</span>
          </div>
        </div>

        {/* Exit option */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="text-sm"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  )
}
