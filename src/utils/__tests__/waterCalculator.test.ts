import { WaterCalculator } from '../waterCalculator'
import type { QuizAnswer } from '../../types'

describe('WaterCalculator', () => {
  let calculator: WaterCalculator

  beforeEach(() => {
    calculator = new WaterCalculator()
  })

  describe('calculateWaterUsage', () => {
    const mockAnswers: Record<string, QuizAnswer> = {
      daily_shower_duration: {
        questionId: 'daily_shower_duration',
        value: 10, // 10 minutes
        category: 'daily'
      },
      daily_shower_frequency: {
        questionId: 'daily_shower_frequency',
        value: '1',
        category: 'daily'
      },
      shower_water_saving: {
        questionId: 'shower_water_saving',
        value: 'never',
        category: 'daily'
      },
      daily_teeth_brushing: {
        questionId: 'daily_teeth_brushing',
        value: 'always',
        category: 'daily'
      },
      daily_dishwashing: {
        questionId: 'daily_dishwashing',
        value: 'machine',
        category: 'daily'
      }
    }

    it('calculates basic water usage for single person', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      expect(result.currentDailyUsage).toBeGreaterThan(0)
      expect(result.currentYearlyUsage).toBe(result.currentDailyUsage * 365)
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.comparison).toHaveProperty('percentile')
      expect(result.comparison).toHaveProperty('message')
    })

    it('calculates water usage for multiple people', () => {
      const resultSingle = calculator.calculateWaterUsage(mockAnswers, 1)
      const resultMultiple = calculator.calculateWaterUsage(mockAnswers, 4)
      
      expect(resultMultiple.currentDailyUsage).toBeGreaterThan(resultSingle.currentDailyUsage)
    })

    it('includes relevant suggestions based on answers', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      // Should include shower suggestions since we answered shower questions
      const showerSuggestions = result.suggestions.filter(s => s.category === 'shower')
      expect(showerSuggestions.length).toBeGreaterThan(0)
    })

    it('sorts suggestions by priority', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      for (let i = 1; i < result.suggestions.length; i++) {
        expect(result.suggestions[i-1].priority).toBeGreaterThanOrEqual(result.suggestions[i].priority)
      }
    })

    it('calculates potential savings', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      expect(result.potentialDailySavings).toBeGreaterThan(0)
      expect(result.potentialYearlySavings).toBe(result.potentialDailySavings * 365)
    })
  })

  describe('getQuestionsByCategory', () => {
    it('returns questions for specific category', () => {
      const dailyQuestions = calculator.getQuestionsByCategory('daily')
      
      expect(dailyQuestions.length).toBeGreaterThan(0)
      expect(dailyQuestions.every(q => q.category === 'daily')).toBe(true)
    })

    it('returns empty array for non-existent category', () => {
      const questions = calculator.getQuestionsByCategory('non-existent')
      
      expect(questions).toHaveLength(0)
    })
  })

  describe('getQuestionById', () => {
    it('returns question by id', () => {
      const question = calculator.getQuestionById('daily_shower_duration')
      
      expect(question).toBeDefined()
      expect(question?.id).toBe('daily_shower_duration')
    })

    it('returns undefined for non-existent id', () => {
      const question = calculator.getQuestionById('non-existent')
      
      expect(question).toBeUndefined()
    })
  })

  describe('getAllQuestions', () => {
    it('returns all questions', () => {
      const questions = calculator.getAllQuestions()
      
      expect(questions.length).toBeGreaterThan(0)
    })

    it('returns questions with all required properties', () => {
      const questions = calculator.getAllQuestions()
      
      questions.forEach(question => {
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('category')
        expect(question).toHaveProperty('type')
        expect(question).toHaveProperty('title')
      })
    })
  })
})
