import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number // 0-100
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  size = 'md',
  color = 'primary',
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }
  
  const colors = {
    primary: 'from-primary-400 to-primary-600',
    secondary: 'from-secondary-400 to-secondary-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-yellow-400 to-yellow-600',
  }
  
  const clampedProgress = Math.max(0, Math.min(100, progress))
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-accent-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-accent-600">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`progress-bar ${sizes[size]}`}>
        <motion.div
          className={`progress-fill bg-gradient-to-r ${colors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
