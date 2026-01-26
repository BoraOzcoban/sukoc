import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Question } from '../../types'
import { Card } from '../ui/Card'
import { RadioGroup } from '../ui/RadioGroup'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

interface QuestionCardProps {
  question: Question
  value?: string | string[] | number
  onChange: (value: string | string[] | number) => void
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  isFirst: boolean
  isLast: boolean
  progress: number
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  onSkip,
  isFirst,
  isLast,
  progress,
}) => {
  const { t } = useTranslation()
  const categoryLabel = t(`quiz.categories.${question.category}`)

  const handleRadioChange = (selectedValue: string) => {
    onChange(selectedValue)
  }

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0
    onChange(numValue)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value)
    onChange(numValue)
  }

  const canProceed = () => {
    if (!question.required) return true
    return value !== undefined && value !== '' && value !== null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
          <span className="text-xs sm:text-sm font-medium text-accent-600">
            {t('quiz.progressLabel', { percent: Math.round(progress) })}
          </span>
          <Badge variant="primary">{categoryLabel}</Badge>
        </div>
        <div className="w-full bg-accent-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Card className="p-5 sm:p-8">
        {/* Question Header */}
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-accent-900 mb-3">
            {question.title}
          </h2>
          {question.description && (
            <p className="text-sm sm:text-base text-accent-600 leading-relaxed">
              {question.description}
            </p>
          )}
          {question.isChallenge && question.challengeText && (
            <div className="mt-4 p-3 sm:p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-800">
                    {t('quiz.challenge.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-700 mt-1">{question.challengeText}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Question Content */}
        <div className="mb-6 sm:mb-8">
          {question.type === 'single' && question.options && (
            <RadioGroup
              name={question.id}
              options={question.options.map(option => ({
                value: option.value.toString(),
                label: option.label,
              }))}
              value={value as string}
              onChange={handleRadioChange}
            />
          )}

          {question.type === 'numeric' && (
            <div className="space-y-4">
              <Input
                type="number"
                value={value as number || ''}
                onChange={handleNumericChange}
                min={question.min}
                max={question.max}
                step={question.step}
                placeholder={t('quiz.numericPlaceholder', { unit: question.unit || '' })}
                className="text-center text-lg sm:text-xl"
              />
              {question.unit && (
                <p className="text-xs sm:text-sm text-accent-500 text-center">
                  {t('quiz.unitLabel', { unit: question.unit })}
                </p>
              )}
            </div>
          )}

          {question.type === 'slider' && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min={question.min || 0}
                  max={question.max || 100}
                  step={question.step || 1}
                  value={value as number || question.min || 0}
                  onChange={handleSliderChange}
                  className="w-full h-3 bg-accent-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs sm:text-sm text-accent-500 mt-2">
                  <span>{question.min || 0}</span>
                  <span className="font-medium text-accent-700">
                    {value as number || question.min || 0} {question.unit || ''}
                  </span>
                  <span>{question.max || 100}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-medium transition-colors ${
              isFirst
                ? 'text-accent-400 cursor-not-allowed'
                : 'text-accent-600 hover:text-accent-800 hover:bg-accent-50'
            }`}
          >
            {t('quiz.previous')}
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!question.required && (
              <button
                onClick={onSkip}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-medium text-accent-600 hover:text-accent-800 hover:bg-accent-50 transition-colors"
              >
                {t('quiz.skip')}
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!canProceed()}
              className={`w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-medium transition-colors ${
                canProceed()
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-accent-200 text-accent-400 cursor-not-allowed'
              }`}
            >
              {isLast ? t('quiz.finish') : t('quiz.next')}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
