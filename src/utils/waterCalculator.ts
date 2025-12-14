import { Question, QuizAnswer, WaterUsageAnalysis, Suggestion } from '../types'
import questionsData from '../data/questions.json'
import suggestionsData from '../data/suggestions.json'

// Realistic water usage calculations based on actual behaviors
// All values in liters per day per person unless specified

const WATER_CALCULATIONS = {
  // SHOWER CALCULATIONS (liters per shower)
  daily_shower_duration_detailed: {
    less_than_5: 30, // 5 min × 6L/min = 30L per shower
    '5_to_10': 52.5, // 7.5 min avg × 7L/min = 52.5L per shower  
    '10_to_20': 105, // 15 min avg × 7L/min = 105L per shower
    more_than_20: 168, // 24 min avg × 7L/min = 168L per shower
  },
  
  daily_shower_count: {
    once: 1, // multiplier for shower frequency
    twice: 2,
    more: 2.5, // assuming 2.5 times per day average
  },

  shower_temperature_adjustment: {
    always: 0.9, // 10% savings from efficient behavior
    sometimes: 0.95, // 5% savings
    rarely: 1.05, // 5% waste
    never: 1.15, // 15% waste from leaving water running
  },

  // TEETH BRUSHING (liters per day)
  teeth_brushing_tap_closure: {
    always: 2, // Efficient: only rinse water
    sometimes: 6, // Mixed behavior
    rarely: 10, // Mostly wasteful
    never: 15, // Tap running entire time
  },

  // HAND WASHING (liters per day, assuming 8-10 times)
  hand_washing_tap_usage: {
    never: 8, // Very efficient: 0.8L per wash
    rarely: 12, // Mostly efficient: 1.2L per wash
    often: 20, // Often wasteful: 2L per wash
    always: 30, // Always wasteful: 3L per wash
  },

  // SHAVING (liters per session, for those who shave)
  shaving_water_usage: {
    closed_when_possible: 2, // Very efficient
    sometimes_close: 4, // Moderately efficient
    mostly_open: 8, // Wasteful
    always_open: 15, // Very wasteful
  },

  // TOILET USAGE (liters per day)
  dual_flush_toilet: {
    yes: 24, // 6 flushes × (3L small + 1×6L large) = 24L
    no_considering: 36, // 6 flushes × 6L = 36L
    no: 36,
    dont_know: 36,
  },

  // KITCHEN WATER USAGE
  dishwashing_method_detailed: {
    dishwasher_eco: 12, // Eco cycle uses ~12L per load
    dishwasher_standard: 15, // Standard cycle ~15L per load  
    hand_tap_open: 45, // Very wasteful hand washing
    hand_tap_controlled: 20, // Efficient hand washing
  },

  fruit_vegetable_washing_method: {
    bowl_water: 3, // Using bowl: ~3L per day
    tap_low_flow: 6, // Low flow tap: ~6L per day
    tap_long_open: 15, // Wasteful running water: ~15L per day
    no_matter: 10, // Average behavior
  },

  cooking_water_usage: {
    never: 8, // Minimal cooking water
    rarely: 12, // Light cooking
    often: 20, // Heavy cooking
    always: 30, // Excessive water use in cooking
  },

  water_reuse: {
    often: 0.8, // 20% reduction from reusing water
    sometimes: 0.9, // 10% reduction
    rarely: 1.0, // No reduction
    never: 1.0, // No reduction
  },

  // LAUNDRY WATER USAGE (liters per week / 7 for daily average)
  washing_machine_full_capacity: {
    always: 50, // ~7L/day (efficient full loads)
    usually: 60, // ~8.5L/day  
    sometimes: 90, // ~13L/day (some half loads)
    rarely: 120, // ~17L/day (many half loads)
  },

  weekly_laundry_frequency: {
    '1-2': 45, // 1.5 × 30L = 45L per week = ~6.5L/day
    '3-4': 105, // 3.5 × 30L = 105L per week = 15L/day
    '5+': 180, // 6 × 30L = 180L per week = ~26L/day
  },

  // GARDEN WATER USAGE (liters per day)
  garden_availability: {
    no: 0, // No garden
    yes_no_watering: 0, // Garden but no watering
    yes_hose: 50, // Manual hose watering
    yes_drip_automatic: 30, // Efficient drip system
  },

  garden_watering_method: {
    hose: 1.5, // 50% more water than drip
    drip_irrigation: 1.0, // Base efficient amount
    sprinkler: 1.3, // 30% more than drip
    no_watering: 0, // No watering
  },

  garden_watering_time: {
    early_morning: 0.9, // 10% less due to reduced evaporation
    evening: 0.95, // 5% less evaporation  
    noon: 1.4, // 40% more due to high evaporation
    irregular: 1.1, // 10% more due to poor timing
  },

  garden_water_source: {
    city_network: 1.0, // Full municipal water use
    well_water: 1.0, // Same usage, different source
    rainwater: 0.5, // 50% reduction in municipal water
    other: 1.0,
  },

  // CAR WASHING (liters per wash, assuming weekly)
  car_washing_method: {
    car_wash_recycled: 6, // 40L per wash / 7 days = ~6L/day
    car_wash_classic: 10, // 70L per wash / 7 days = 10L/day
    self_hose_efficient: 8, // 55L per wash / 7 days = ~8L/day
    hose_open: 20, // 140L per wash / 7 days = 20L/day
  },

  // WATER EFFICIENCY FEATURES (multipliers for overall usage)
  water_saving_showerhead: {
    yes: 0.85, // 15% savings on shower water
    partial: 0.92, // 8% savings
    no_considering: 1.0,
    no: 1.0,
  },

  flow_restrictor_usage: {
    yes: 0.88, // 12% savings on tap water
    no_considering: 1.0,
    no_unnecessary: 1.0,
    no_knowledge: 1.0,
  },

  // LEAK IMPACT (additional daily usage if leaks present)
  leaky_tap_repair: {
    immediately: 0, // No leak waste
    '1_2_days': 2, // Minor leak waste
    '1_week': 8, // Moderate leak waste  
    long_wait: 20, // Major leak waste
  },

}

export class WaterCalculator {
  private questions: Question[]
  private suggestions: { [key: string]: any[] }

  constructor() {
    this.questions = questionsData as Question[]
    this.suggestions = suggestionsData
  }

  calculateWaterUsage(answers: Record<string, QuizAnswer>, householdSize: number): WaterUsageAnalysis {
    let totalDailyUsage = 0
    let potentialSavings = 0
    const relevantSuggestions: Suggestion[] = []

    // Calculate actual water usage based on user answers
    totalDailyUsage = this.calculateActualUsage(answers, householdSize)

    // Generate suggestions based on answers
    const suggestionCategories = this.getRelevantSuggestionCategories(answers)
    
    suggestionCategories.forEach(category => {
      const categorySuggestions = this.suggestions[category] || []
      relevantSuggestions.push(...categorySuggestions)
    })

    // Calculate potential savings from suggestions
    relevantSuggestions.forEach(suggestion => {
      potentialSavings += suggestion.impact
    })

    // Calculate priority scores and sort suggestions
    const prioritizedSuggestions = relevantSuggestions
      .map(suggestion => ({
        ...suggestion,
        priority: Math.round(suggestion.impact * suggestion.feasibility * 100) / 100,
      }))
      .sort((a, b) => b.priority - a.priority)

    // Calculate comparison data (mock data for now)
    const comparison = this.calculateComparison(totalDailyUsage, householdSize)

    return {
      currentDailyUsage: Math.max(0, totalDailyUsage),
      currentYearlyUsage: Math.max(0, totalDailyUsage * 365),
      potentialDailySavings: potentialSavings,
      potentialYearlySavings: potentialSavings * 365,
      suggestions: prioritizedSuggestions,
      comparison,
    }
  }

  private getRelevantSuggestionCategories(answers: Record<string, QuizAnswer>): string[] {
    const categories: string[] = []

    // Always include general suggestions
    categories.push('general')

    // Check specific answer patterns
    Object.entries(answers).forEach(([questionId, answer]) => {
      switch (questionId) {
        // Daily hygiene
        case 'daily_teeth_brushing_water':
        case 'daily_shower_duration':
        case 'daily_shower_water_off':
        case 'daily_hand_washing':
        case 'daily_shower_count':
          if (!categories.includes('daily_hygiene')) categories.push('daily_hygiene')
          break
        
        // Kitchen
        case 'daily_dishwashing_method':
        case 'daily_fruit_vegetable_washing':
        case 'daily_coffee_tea_water':
        case 'weekly_cooking_water':
          if (!categories.includes('kitchen')) categories.push('kitchen')
          break
        
        // Laundry
        case 'weekly_laundry_frequency':
        case 'weekly_laundry_full_load':
          if (!categories.includes('laundry')) categories.push('laundry')
          break
        
        // Bathroom
        case 'annual_toilet_system':
          if (!categories.includes('bathroom')) categories.push('bathroom')
          break
        
        // Garden
        case 'monthly_garden_watering':
          if (answer.value !== 'never' && !categories.includes('garden')) {
            categories.push('garden')
          }
          break
        
        // Lifestyle
        case 'annual_meat_consumption':
        case 'annual_clothing_habits':
        case 'annual_water_source':
          if (!categories.includes('lifestyle')) categories.push('lifestyle')
          break
        
        // Appliances
        case 'monthly_appliance_efficiency':
          if (!categories.includes('appliances')) categories.push('appliances')
          break
        
        // Leaks
        case 'monthly_leak_check':
          if (!categories.includes('leaks')) categories.push('leaks')
          break
        
        // Monitoring
        case 'monthly_bill_tracking':
          if (!categories.includes('monitoring')) categories.push('monitoring')
          break
        
        // Challenges
        case 'challenge_shower_time':
        case 'challenge_teeth_brushing':
        case 'challenge_meat_free_day':
        case 'challenge_bottled_water':
          if (!categories.includes('challenges')) categories.push('challenges')
          break
      }
    })

    return categories
  }

  private calculateComparison(currentUsage: number, householdSize: number): {
    percentile: number
    message: string
  } {
    // Mock comparison data - in real app, this would come from database
    const averageUsagePerPerson = 150 // liters per day
    const userUsagePerPerson = currentUsage / householdSize
    
    let percentile: number
    let message: string

    if (userUsagePerPerson < averageUsagePerPerson * 0.7) {
      percentile = 20
      message = `Benzer profildekilerden %${Math.round((averageUsagePerPerson - userUsagePerPerson) / averageUsagePerPerson * 100)} daha az su kullanıyorsunuz`
    } else if (userUsagePerPerson > averageUsagePerPerson * 1.3) {
      percentile = 80
      message = `Benzer profildekilerden %${Math.round((userUsagePerPerson - averageUsagePerPerson) / averageUsagePerPerson * 100)} daha fazla su kullanıyorsunuz`
    } else {
      percentile = 50
      message = 'Benzer profildekilerle aynı seviyedesiniz'
    }

    return { percentile, message }
  }

  private calculateActualUsage(answers: Record<string, QuizAnswer>, householdSize: number): number {
    let dailyUsage = 0

    // SHOWER CALCULATION
    const showerDuration = this.getAnswerValue(answers, 'daily_shower_duration_detailed')
    const showerCount = this.getAnswerValue(answers, 'daily_shower_count') || 'once'
    const tempAdjustment = this.getAnswerValue(answers, 'shower_temperature_adjustment') || 'sometimes'

    let showerUsage = 0
    if (showerDuration && (WATER_CALCULATIONS.daily_shower_duration_detailed as any)[showerDuration]) {
      showerUsage = (WATER_CALCULATIONS.daily_shower_duration_detailed as any)[showerDuration]
    } else {
      showerUsage = 52.5 // Default average (7.5 min shower)
    }

    const showerFrequency = (WATER_CALCULATIONS.daily_shower_count as any)[showerCount] || 1
    const tempEfficiency = (WATER_CALCULATIONS.shower_temperature_adjustment as any)[tempAdjustment] || 1
    
    dailyUsage += showerUsage * showerFrequency * tempEfficiency * householdSize

    // TEETH BRUSHING
    const teethBrushing = this.getAnswerValue(answers, 'teeth_brushing_tap_closure')
    if (teethBrushing) {
      const teethWater = this.getWaterValue(WATER_CALCULATIONS.teeth_brushing_tap_closure, teethBrushing, 6)
      dailyUsage += teethWater * householdSize
    } else {
      dailyUsage += 6 * householdSize // Default teeth brushing water
    }

    // HAND WASHING
    const handWashing = this.getAnswerValue(answers, 'hand_washing_tap_usage')
    if (handWashing) {
      const handWater = this.getWaterValue(WATER_CALCULATIONS.hand_washing_tap_usage, handWashing, 15)
      dailyUsage += handWater * householdSize
    } else {
      dailyUsage += 15 * householdSize // Default hand washing water
    }

    // SHAVING (assuming 50% of household shaves)
    const shaving = this.getAnswerValue(answers, 'shaving_water_usage')
    if (shaving) {
      const shavingWater = this.getWaterValue(WATER_CALCULATIONS.shaving_water_usage, shaving, 5)
      dailyUsage += shavingWater * householdSize * 0.5 // Only half the household
    }

    // TOILET USAGE
    const toiletType = this.getAnswerValue(answers, 'dual_flush_toilet')
    if (toiletType) {
      const toiletWater = this.getWaterValue(WATER_CALCULATIONS.dual_flush_toilet, toiletType, 36)
      dailyUsage += toiletWater * householdSize
    } else {
      dailyUsage += 36 * householdSize // Default toilet usage
    }

    // KITCHEN USAGE
    const dishwashing = this.getAnswerValue(answers, 'dishwashing_method_detailed')
    if (dishwashing) {
      const dishWater = this.getWaterValue(WATER_CALCULATIONS.dishwashing_method_detailed, dishwashing, 20)
      dailyUsage += dishWater
    } else {
      dailyUsage += 20 // Default dishwashing water
    }

    const fruitVegWashing = this.getAnswerValue(answers, 'fruit_vegetable_washing_method')
    if (fruitVegWashing) {
      const fruitVegWater = this.getWaterValue(WATER_CALCULATIONS.fruit_vegetable_washing_method, fruitVegWashing, 8)
      dailyUsage += fruitVegWater
    } else {
      dailyUsage += 8 // Default fruit/vegetable washing
    }

    const cooking = this.getAnswerValue(answers, 'cooking_water_usage')
    if (cooking) {
      const cookingWater = this.getWaterValue(WATER_CALCULATIONS.cooking_water_usage, cooking, 15)
      dailyUsage += cookingWater
    }

    // Apply water reuse multiplier
    const waterReuse = this.getAnswerValue(answers, 'water_reuse')
    if (waterReuse) {
      const reuseMultiplier = this.getWaterValue(WATER_CALCULATIONS.water_reuse, waterReuse, 1)
      dailyUsage *= reuseMultiplier
    }

    // LAUNDRY USAGE
    const laundryFreq = this.getAnswerValue(answers, 'weekly_laundry_frequency')
    const laundryCapacity = this.getAnswerValue(answers, 'washing_machine_full_capacity')
    
    let laundryWater = 0
    if (laundryFreq) {
      laundryWater = this.getWaterValue(WATER_CALCULATIONS.weekly_laundry_frequency, laundryFreq, 105) / 7 // Convert weekly to daily
    } else if (laundryCapacity) {
      const capacityWater = this.getWaterValue(WATER_CALCULATIONS.washing_machine_full_capacity, laundryCapacity, 60)
      laundryWater = capacityWater / 7 // Convert to daily
    } else {
      laundryWater = 15 // Default laundry water (105L/week ÷ 7)
    }
    dailyUsage += laundryWater

    // GARDEN USAGE
    const garden = this.getAnswerValue(answers, 'garden_availability')
    if (garden) {
      let gardenWater = this.getWaterValue(WATER_CALCULATIONS.garden_availability, garden, 0)
      
      if (gardenWater > 0) {
        // Apply garden modifiers
        const method = this.getAnswerValue(answers, 'garden_watering_method')
        const timing = this.getAnswerValue(answers, 'garden_watering_time')
        const source = this.getAnswerValue(answers, 'garden_water_source')
        
        if (method) {
          gardenWater *= this.getWaterValue(WATER_CALCULATIONS.garden_watering_method, method, 1)
        }
        if (timing) {
          gardenWater *= this.getWaterValue(WATER_CALCULATIONS.garden_watering_time, timing, 1)
        }
        if (source) {
          gardenWater *= this.getWaterValue(WATER_CALCULATIONS.garden_water_source, source, 1)
        }
      }
      
      dailyUsage += gardenWater
    }

    // CAR WASHING
    const carWashing = this.getAnswerValue(answers, 'car_washing_method')
    if (carWashing) {
      const carWater = this.getWaterValue(WATER_CALCULATIONS.car_washing_method, carWashing, 0)
      dailyUsage += carWater
    }

    // LEAK IMPACT
    const leakRepair = this.getAnswerValue(answers, 'leaky_tap_repair')
    if (leakRepair) {
      const leakWater = this.getWaterValue(WATER_CALCULATIONS.leaky_tap_repair, leakRepair, 0)
      dailyUsage += leakWater * householdSize
    }

    // Apply efficiency multipliers
    const showerHead = this.getAnswerValue(answers, 'water_saving_showerhead')
    if (showerHead) {
      const showerMultiplier = this.getWaterValue(WATER_CALCULATIONS.water_saving_showerhead, showerHead, 1)
      dailyUsage *= showerMultiplier
    }

    const flowRestrictor = this.getAnswerValue(answers, 'flow_restrictor_usage')
    if (flowRestrictor) {
      const flowMultiplier = this.getWaterValue(WATER_CALCULATIONS.flow_restrictor_usage, flowRestrictor, 1)
      dailyUsage *= flowMultiplier
    }

    // Add basic drinking and other essential water (5L per person per day)
    dailyUsage += 5 * householdSize

    return Math.max(0, dailyUsage)
  }

  private getAnswerValue(answers: Record<string, QuizAnswer>, questionId: string): string | null {
    const answer = answers[questionId]
    return answer ? String(answer.value) : null
  }

  private getWaterValue(calculations: any, key: string, defaultValue: number = 0): number {
    return calculations[key] || defaultValue
  }

  getQuestionsByCategory(category: string): Question[] {
    return this.questions.filter(q => q.category === category)
  }

  getAllQuestions(): Question[] {
    return this.questions
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id)
  }
}

export const waterCalculator = new WaterCalculator()
