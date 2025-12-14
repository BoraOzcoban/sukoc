import React from 'react'
import { motion } from 'framer-motion'
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
        return 'Kolay'
      case 'medium':
        return 'Orta'
      case 'hard':
        return 'Zor'
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
        {/* Priority indicator */}
        <div className="absolute top-4 right-4">
          <Badge variant="primary" size="sm">
            #{suggestion.priority}
          </Badge>
        </div>

        {/* Challenge indicator */}
        {suggestion.isChallenge && (
          <div className="absolute top-4 left-4">
            <Badge variant="warning" size="sm">
              🎯 Meydan Okuma
            </Badge>
          </div>
        )}

        <div className="pr-20">
          <h3 className="text-xl font-semibold text-accent-900 mb-3">
            {suggestion.title}
          </h3>
          
          <p className="text-accent-600 mb-4 leading-relaxed">
            {suggestion.description}
          </p>

          {/* Impact and difficulty */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {suggestion.impact}
                </div>
                <div className="text-sm text-accent-500">L/gün</div>
              </div>
              
              <div className="h-8 w-px bg-accent-200"></div>
              
              <div>
                <Badge variant={getDifficultyColor(suggestion.difficulty)}>
                  {getDifficultyText(suggestion.difficulty)}
                </Badge>
                <div className="text-xs text-accent-500 mt-1">
                  Uygulama Zorluğu
                </div>
              </div>
            </div>
          </div>

          {/* Challenge text */}
          {suggestion.isChallenge && suggestion.challengeText && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <h4 className="font-medium text-primary-800 mb-2">Meydan Okuma:</h4>
              <p className="text-sm text-primary-700">{suggestion.challengeText}</p>
            </div>
          )}

          {/* Actions */}
          {(onAccept || onDecline) && (
            <div className="flex space-x-3">
              {onAccept && (
                <button
                  onClick={onAccept}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Kabul Et
                </button>
              )}
              {onDecline && (
                <button
                  onClick={onDecline}
                  className="flex-1 bg-accent-100 hover:bg-accent-200 text-accent-700 font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Daha Sonra
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
