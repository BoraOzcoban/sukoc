import { WaterCalculator } from '../waterCalculator'
import type { QuizAnswer } from '../../types'

describe('WaterCalculator', () => {
  let calculator: WaterCalculator

  beforeEach(() => {
    calculator = new WaterCalculator()
  })

  describe('calculateWaterUsage', () => {
    const mockAnswers: Record<string, QuizAnswer> = {
      weekly_shower_total_minutes: {
        questionId: 'weekly_shower_total_minutes',
        value: 70, // minutes per week
        category: 'weekly'
      },
      general_faucet_closure: {
        questionId: 'general_faucet_closure',
        value: 'arada_kapatirim',
        category: 'daily'
      },
      dishwashing_method_detailed: {
        questionId: 'dishwashing_method_detailed',
        value: 'dishwasher_eco',
        category: 'daily'
      },
      weekly_laundry_frequency: {
        questionId: 'weekly_laundry_frequency',
        value: '3-4',
        category: 'weekly'
      },
      weekly_garden_watering_minutes: {
        questionId: 'weekly_garden_watering_minutes',
        value: 60,
        category: 'weekly'
      },
      weekly_red_meat_kg: {
        questionId: 'weekly_red_meat_kg',
        value: '1_2',
        category: 'weekly'
      },
      weekly_dairy_consumption: {
        questionId: 'weekly_dairy_consumption',
        value: 'average',
        category: 'weekly'
      },
      clothing_purchase_frequency: {
        questionId: 'clothing_purchase_frequency',
        value: 'month_1_2',
        category: 'weekly'
      },
      car_wash_frequency: {
        questionId: 'car_wash_frequency',
        value: 'week_1',
        category: 'weekly'
      },
      weekly_electronics_shopping: {
        questionId: 'weekly_electronics_shopping',
        value: 'year_1_2',
        category: 'weekly'
      },
      weekly_white_meat_kg: {
        questionId: 'weekly_white_meat_kg',
        value: 'lt1',
        category: 'weekly'
      },
      irrigation_practice: {
        questionId: 'irrigation_practice',
        value: 'hose_controlled',
        category: 'weekly'
      },
      shower_flow_intensity: {
        questionId: 'shower_flow_intensity',
        value: 'medium',
        category: 'weekly'
      },
      faucet_flow_intensity: {
        questionId: 'faucet_flow_intensity',
        value: 'medium',
        category: 'weekly'
      },
      pool_hot_tub: {
        questionId: 'pool_hot_tub',
        value: 'none',
        category: 'weekly'
      }
    }

    it('calculates basic water usage for single person', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      expect(result.currentDailyUsage).toBeGreaterThan(0)
      expect(result.currentYearlyUsage).toBe(result.currentDailyUsage * 365)
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.comparison).toHaveProperty('message')
    })

    it('calculates water usage for multiple people', () => {
      const resultSingle = calculator.calculateWaterUsage(mockAnswers, 1)
      const resultMultiple = calculator.calculateWaterUsage(mockAnswers, 4)
      
      expect(resultMultiple.currentDailyUsage).toBeGreaterThan(resultSingle.currentDailyUsage)
    })

    it('includes relevant suggestions based on answers', () => {
      const result = calculator.calculateWaterUsage(mockAnswers, 1)
      
      // Should include daily hygiene suggestions since we answered hygiene questions
      const hygieneSuggestions = result.suggestions.filter(s => s.category === 'daily_hygiene')
      expect(hygieneSuggestions.length).toBeGreaterThan(0)
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
      const question = calculator.getQuestionById('weekly_shower_total_minutes')
      
      expect(question).toBeDefined()
      expect(question?.id).toBe('weekly_shower_total_minutes')
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
