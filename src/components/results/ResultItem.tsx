import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Suggestion } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface ResultItemProps {
  suggestion: Suggestion
  onAccept?: () => void
  onDecline?: () => void
}

export const ResultItem: React.FC<ResultItemProps> = ({
  suggestion,
  onAccept,
  onDecline,
}) => {
  const { t } = useTranslation()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'error'
      default:
        return 'default'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return t('results.suggestions.easy')
      case 'medium':
        return t('results.suggestions.medium')
      case 'hard':
        return t('results.suggestions.hard')
      default:
        return difficulty
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="relative overflow-hidden">
        {/* Challenge indicator */}
        {suggestion.isChallenge && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0 sm:absolute sm:top-4 sm:left-4">
            <Badge variant="warning" size="sm">
              {t('results.challenge.badge')}
            </Badge>
          </div>
        )}

        <div className="sm:pr-20">
          <h3 className="text-lg sm:text-xl font-semibold text-accent-900 mb-3">
            {suggestion.title}
          </h3>
          
          <p className="text-sm sm:text-base text-accent-600 mb-4 leading-relaxed">
            {suggestion.description}
          </p>

          {/* Impact and difficulty */}
          {!suggestion.isOtherTip && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary-600">
                    {suggestion.impact.toFixed(1)}
                  </div>
                  <div className="text-xs sm:text-sm text-accent-500">
                    {t('results.units.litersPerDay')}
                  </div>
                </div>

                <div className="h-8 w-px bg-accent-200"></div>

                <div>
                  <Badge variant={getDifficultyColor(suggestion.difficulty)}>
                    {getDifficultyText(suggestion.difficulty)}
                  </Badge>
                  <div className="text-xs text-accent-500 mt-1">
                    {t('results.suggestions.difficulty')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Challenge text */}
          {suggestion.isChallenge && suggestion.challengeText && (
            <div className="mb-6 p-3 sm:p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <h4 className="font-medium text-primary-800 mb-2">
                {t('results.challenge.title')}
              </h4>
              <p className="text-sm text-primary-700">{suggestion.challengeText}</p>
            </div>
          )}

          {/* Actions */}
          {(onAccept || onDecline) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {onAccept && (
                <button
                  onClick={onAccept}
                  className="w-full sm:flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  {t('results.challenge.accept')}
                </button>
              )}
              {onDecline && (
                <button
                  onClick={onDecline}
                  className="w-full sm:flex-1 bg-accent-100 hover:bg-accent-200 text-accent-700 font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  {t('results.challenge.later')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Visual indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
      </Card>
    </motion.div>
  )
}
