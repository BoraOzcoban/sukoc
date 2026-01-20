import { Question, QuizAnswer, WaterUsageAnalysis, Suggestion } from '../types'
import questionsData from '../data/questions.json'
import suggestionsData from '../data/suggestions.json'

// Realistic water usage calculations based on actual behaviors
// Values are weekly totals (liters per week) unless stated otherwise.
const WATER_CALCULATIONS = {
  // Q1: shower minutes → 14 L per minute (weekly total)
  shower_liters_per_minute_weekly: 14,

  // Q2: faucet closure habit → weekly add-ons
  faucet_closure_weekly: {
    hic_kapatmam: 300,
    arada_kapatirim: 150,
    kapatirim: 0,
  },

  // Q3: dishwashing → weekly add-ons
  dishwashing_method_detailed: {
    dishwasher_eco: 50,
    dishwasher_standard: 100,
    hand_tap_controlled: 300,
    hand_tap_open: 700,
  },

  // Q4: fruit/vegetable washing → weekly add-ons
  fruit_vegetable_washing_method: {
    bowl_water: 28,
    tap_low_flow: 90,
    tap_long_open: 200,
  },

  // Q5: laundry frequency → weekly add-ons
  weekly_laundry_frequency: {
    '1-2': 50,
    '3-4': 100,
    '5+': 150,
  },

  // Q7: garden watering minutes → 17 L per minute (weekly total)
  garden_liters_per_minute_weekly: 17,

  // Toilet flush frequency (weekly liters)
  weekly_toilet_flushes: {
    per_day_1_3: 84,   // ~2/day * 6L * 7
    per_day_4_6: 210,  // ~5/day * 6L * 7
    per_day_7_9: 336,  // ~8/day * 6L * 7
    per_day_10_plus: 462, // ~11/day * 6L * 7
  },

  // Red meat consumption (weekly liters)
  weekly_red_meat_kg: {
    none: 0,
    lt1: 10000,
    '1_2': 25000,
    gt2: 40000,
  },

  // Dairy consumption (weekly liters)
  weekly_dairy_consumption: {
    very_often: 10000,
    average: 2500,
    low: 500,
    none: 0,
  },

  // Clothing purchases (weekly liters)
  clothing_purchase_frequency: {
    week_1_2: 20000,
    month_1_2: 5000,
    year_1_2: 400,
  },

  // Car wash frequency (weekly liters)
  car_wash_frequency: {
    never: 0,
    week_3_plus: 400,
    week_1: 120,
    month_1: 30,
  },

  // White meat consumption (weekly liters)
  weekly_white_meat_kg: {
    none: 0,
    lt1: 4000,
    '1_2': 8000,
    gt2: 12000,
  },

  // Garden style (weekly liters)
  garden_style: {
    none: 0,
    drought: 80,
    mixed: 250,
    lawn_heavy: 500,
    balcony_pots: 120,
  },

  // Pool / hot tub top-ups (weekly liters)
  pool_hot_tub: {
    none: 0,
    small_inflatable: 200,
    above_ground: 400,
    inground: 700,
  },

  // Irrigation practices (weekly liters)
  irrigation_practice: {
    none: 0,
    drip_or_timer: 80,
    hose_controlled: 200,
    sprinkler_midday: 400,
    flood_irrigation: 700,
  },

  // Electronics shopping (weekly liters)
  weekly_electronics_shopping: {
    year_0_1: 250, // ~13000L / 52
    year_1_2: 375, // 1.5 purchases/year
    year_3_4: 875, // 3.5 purchases/year
    month_1_plus: 3000, // ~12 purchases/year
  },

  // Flow intensity factors (multipliers)
  shower_flow_intensity: {
    low: 0.5,
    medium: 0.75,
    high: 1.0,
  },
  faucet_flow_intensity: {
    low: 0.5,
    medium: 0.75,
    high: 1.0,
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
    let categoryBreakdown: Record<string, number> = {}
    let lifestyleBreakdown: Record<string, number> = {}
    let potentialSavings = 0
    const relevantSuggestions: Suggestion[] = []

    // Calculate actual water usage based on user answers
    const { totalDailyUsage: dailyUsage, categoryUsage, lifestyleUsage } = this.calculateActualUsage(answers)
    totalDailyUsage = dailyUsage
    categoryBreakdown = categoryUsage
    lifestyleBreakdown = lifestyleUsage

    // Generate suggestions based on answers and actual usage
    const suggestionCategories = this.getRelevantSuggestionCategories(answers, categoryBreakdown)
    
    suggestionCategories.forEach(category => {
      const categorySuggestions = this.suggestions[category] || []
      relevantSuggestions.push(...categorySuggestions)
    })

    const bestOptionSuggestions = this.getBestOptionSuggestions(answers)
    relevantSuggestions.push(...bestOptionSuggestions)

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
      categoryBreakdown,
      lifestyleBreakdown,
    }
  }

  private getRelevantSuggestionCategories(answers: Record<string, QuizAnswer>, categoryUsage: Record<string, number> = {}): string[] {
    const categories: string[] = []

    // Always include general suggestions
    categories.push('general')

    // Check specific answer patterns
    Object.keys(answers).forEach((questionId) => {
      switch (questionId) {
        // Daily hygiene
        case 'weekly_shower_total_minutes':
        case 'general_faucet_closure':
          if ((categoryUsage['daily_hygiene'] || 0) > 0 && !categories.includes('daily_hygiene')) categories.push('daily_hygiene')
          break
        
        // Kitchen
        case 'dishwashing_method_detailed':
        case 'fruit_vegetable_washing_method':
          if ((categoryUsage['kitchen'] || 0) > 0 && !categories.includes('kitchen')) categories.push('kitchen')
          break
        
        // Laundry
        case 'weekly_laundry_frequency':
          if ((categoryUsage['laundry'] || 0) > 0 && !categories.includes('laundry')) categories.push('laundry')
          break
        
        // Garden
        case 'weekly_garden_watering_minutes':
        case 'garden_style':
        case 'pool_hot_tub':
        case 'irrigation_practice':
          if ((categoryUsage['garden'] || 0) > 0 && !categories.includes('garden')) categories.push('garden')
          break

        // Bathroom
        case 'weekly_toilet_flushes':
          if ((categoryUsage['bathroom'] || 0) > 0 && !categories.includes('bathroom')) categories.push('bathroom')
          break

        // Lifestyle/consumption
        case 'weekly_red_meat_kg':
        case 'weekly_dairy_consumption':
        case 'clothing_purchase_frequency':
        case 'car_wash_frequency':
        case 'weekly_white_meat_kg':
        case 'weekly_electronics_shopping':
          if ((categoryUsage['lifestyle'] || 0) > 0 && !categories.includes('lifestyle')) categories.push('lifestyle')
          break
        
        // Appliances and fixtures
      }
    })

    return categories
  }

  private getBestOptionSuggestions(answers: Record<string, QuizAnswer>): Suggestion[] {
    const suggestions: Suggestion[] = []

    this.questions.forEach((question) => {
      if (question.type !== 'single' || !question.options?.length) return
      const answer = answers[question.id]
      if (!answer) return

      const calculations: Record<string, number> | undefined = (WATER_CALCULATIONS as any)[question.id]
      if (!calculations) return

      const optionsWithUsage = question.options
        .map((option) => ({
          value: String(option.value),
          label: option.label,
          usage: calculations[String(option.value)],
        }))
        .filter((option) => typeof option.usage === 'number')
        .sort((a, b) => (b.usage || 0) - (a.usage || 0))

      if (!optionsWithUsage.length) return

      const currentValue = String(answer.value)
      const currentIndex = optionsWithUsage.findIndex((option) => option.value === currentValue)
      if (currentIndex === -1) return

      const currentOption = optionsWithUsage[currentIndex]
      const nextOption = optionsWithUsage[currentIndex + 1]
      if (!nextOption) return

      if (question.id === 'faucet_flow_intensity') return

      let currentWeekly = currentOption.usage
      let nextWeekly = nextOption.usage

      if (question.id === 'shower_flow_intensity') {
        const weeklyShowerMinutes = this.getNumericAnswer(answers, 'weekly_shower_total_minutes') || 0
        const baseWeekly = weeklyShowerMinutes * WATER_CALCULATIONS.shower_liters_per_minute_weekly
        currentWeekly = baseWeekly * currentOption.usage
        nextWeekly = baseWeekly * nextOption.usage
      }

      const weeklySavings = currentWeekly - nextWeekly
      if (weeklySavings <= 0) return

      const currentDaily = currentWeekly / 7
      const nextDaily = nextWeekly / 7
      const dailySavings = weeklySavings / 7
      const category = this.getSuggestionCategoryForQuestion(question.id)

      suggestions.push({
        id: `best_option_${question.id}`,
        title: question.title,
        description: `Bu soru için mevcut seçiminiz: "${currentOption.label}" (~${currentDaily.toFixed(1)} L/gün). Bir alt seçenek: "${nextOption.label}" (~${nextDaily.toFixed(1)} L/gün). Günlük yaklaşık ${dailySavings.toFixed(1)} L tasarruf edebilirsiniz.`,
        impact: dailySavings,
        difficulty: 'easy',
        feasibility: 0.85,
        category,
        priority: 0,
      })
    })

    return suggestions
  }

  private getSuggestionCategoryForQuestion(questionId: string): string {
    switch (questionId) {
      case 'weekly_shower_total_minutes':
      case 'general_faucet_closure':
      case 'shower_flow_intensity':
      case 'faucet_flow_intensity':
        return 'daily_hygiene'
      case 'dishwashing_method_detailed':
      case 'fruit_vegetable_washing_method':
        return 'kitchen'
      case 'weekly_laundry_frequency':
        return 'laundry'
      case 'weekly_garden_watering_minutes':
      case 'garden_style':
      case 'pool_hot_tub':
      case 'irrigation_practice':
        return 'garden'
      case 'weekly_toilet_flushes':
        return 'bathroom'
      case 'weekly_red_meat_kg':
      case 'weekly_dairy_consumption':
      case 'clothing_purchase_frequency':
      case 'car_wash_frequency':
      case 'weekly_white_meat_kg':
      case 'weekly_electronics_shopping':
        return 'lifestyle'
      default:
        return 'general'
    }
  }

  private calculateComparison(currentUsage: number, householdSize: number): {
    percentile: number
    message: string
  } {
    // Mock comparison data - in real app, this would come from database
    const percentile = currentUsage > householdSize * 4500 ? 60 : 40
    const message = 'Türkiye\'de ortalama kişi başı su kullanımı günlük yaklaşık 4500 litre, dünya ortalaması ise yaklaşık 3800 litredir.'

    return { percentile, message }
  }

  private calculateActualUsage(answers: Record<string, QuizAnswer>): { totalDailyUsage: number, categoryUsage: Record<string, number>, lifestyleUsage: Record<string, number> } {
    let weeklyUsage = 0
    const categoryUsage: Record<string, number> = {}
    const lifestyleUsage: Record<string, number> = {}

    // Q1: shower minutes (weekly)
    const weeklyShowerMinutes = this.getNumericAnswer(answers, 'weekly_shower_total_minutes') || 0
    const showerFlow = this.getAnswerValue(answers, 'shower_flow_intensity') || 'high'
    const showerMultiplier = this.getWaterValue(WATER_CALCULATIONS.shower_flow_intensity, showerFlow, 1)
    const showerWeekly = weeklyShowerMinutes * WATER_CALCULATIONS.shower_liters_per_minute_weekly * showerMultiplier
    weeklyUsage += showerWeekly
    categoryUsage['daily_hygiene'] = (categoryUsage['daily_hygiene'] || 0) + showerWeekly

    // Q2: faucet closure habit (weekly add-on)
    const faucetClosure = this.getAnswerValue(answers, 'general_faucet_closure')
    if (faucetClosure) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.faucet_closure_weekly, faucetClosure, 0)
      categoryUsage['daily_hygiene'] = (categoryUsage['daily_hygiene'] || 0) + this.getWaterValue(WATER_CALCULATIONS.faucet_closure_weekly, faucetClosure, 0)
    }
    const faucetFlow = this.getAnswerValue(answers, 'faucet_flow_intensity') || 'high'
    const faucetMultiplier = this.getWaterValue(WATER_CALCULATIONS.faucet_flow_intensity, faucetFlow, 1)
    categoryUsage['daily_hygiene'] = (categoryUsage['daily_hygiene'] || 0) * faucetMultiplier

    // Q3: dishwashing method (weekly add-on)
    const dishwashing = this.getAnswerValue(answers, 'dishwashing_method_detailed')
    if (dishwashing) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.dishwashing_method_detailed, dishwashing, 0)
      categoryUsage['kitchen'] = (categoryUsage['kitchen'] || 0) + this.getWaterValue(WATER_CALCULATIONS.dishwashing_method_detailed, dishwashing, 0)
    }

    // Q4: fruit/vegetable washing (weekly add-on)
    const fruitVeg = this.getAnswerValue(answers, 'fruit_vegetable_washing_method')
    if (fruitVeg) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.fruit_vegetable_washing_method, fruitVeg, 0)
      categoryUsage['kitchen'] = (categoryUsage['kitchen'] || 0) + this.getWaterValue(WATER_CALCULATIONS.fruit_vegetable_washing_method, fruitVeg, 0)
    }

    // Q5: laundry frequency (weekly add-on)
    const laundryFreq = this.getAnswerValue(answers, 'weekly_laundry_frequency')
    if (laundryFreq) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.weekly_laundry_frequency, laundryFreq, 0)
      categoryUsage['laundry'] = (categoryUsage['laundry'] || 0) + this.getWaterValue(WATER_CALCULATIONS.weekly_laundry_frequency, laundryFreq, 0)
    }

    // Toilet flush frequency (weekly add-on)
    const toiletFlush = this.getAnswerValue(answers, 'weekly_toilet_flushes')
    if (toiletFlush) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.weekly_toilet_flushes, toiletFlush, 0)
      categoryUsage['bathroom'] = (categoryUsage['bathroom'] || 0) + this.getWaterValue(WATER_CALCULATIONS.weekly_toilet_flushes, toiletFlush, 0)
    }

    // Q7: garden watering minutes (weekly)
    const weeklyGardenMinutes = this.getNumericAnswer(answers, 'weekly_garden_watering_minutes') || 0
    const gardenWaterWeekly = weeklyGardenMinutes * WATER_CALCULATIONS.garden_liters_per_minute_weekly
    weeklyUsage += gardenWaterWeekly
    if (gardenWaterWeekly > 0) {
      categoryUsage['garden'] = (categoryUsage['garden'] || 0) + gardenWaterWeekly
    }

    // Lifestyle add-ons (weekly)
    const redMeat = this.getAnswerValue(answers, 'weekly_red_meat_kg')
    if (redMeat) {
      const redMeatUsage = this.getWaterValue(WATER_CALCULATIONS.weekly_red_meat_kg, redMeat, 0)
      weeklyUsage += redMeatUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + redMeatUsage
      lifestyleUsage['red_meat'] = (lifestyleUsage['red_meat'] || 0) + redMeatUsage
    }

    const dairy = this.getAnswerValue(answers, 'weekly_dairy_consumption')
    if (dairy) {
      const dairyUsage = this.getWaterValue(WATER_CALCULATIONS.weekly_dairy_consumption, dairy, 0)
      weeklyUsage += dairyUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + dairyUsage
      lifestyleUsage['dairy'] = (lifestyleUsage['dairy'] || 0) + dairyUsage
    }

    const clothing = this.getAnswerValue(answers, 'clothing_purchase_frequency')
    if (clothing) {
      const clothingUsage = this.getWaterValue(WATER_CALCULATIONS.clothing_purchase_frequency, clothing, 0)
      weeklyUsage += clothingUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + clothingUsage
      lifestyleUsage['clothing'] = (lifestyleUsage['clothing'] || 0) + clothingUsage
    }

    const whiteMeat = this.getAnswerValue(answers, 'weekly_white_meat_kg')
    if (whiteMeat) {
      const whiteMeatUsage = this.getWaterValue(WATER_CALCULATIONS.weekly_white_meat_kg, whiteMeat, 0)
      weeklyUsage += whiteMeatUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + whiteMeatUsage
      lifestyleUsage['white_meat'] = (lifestyleUsage['white_meat'] || 0) + whiteMeatUsage
    }

    const carWash = this.getAnswerValue(answers, 'car_wash_frequency')
    if (carWash) {
      const carWashUsage = this.getWaterValue(WATER_CALCULATIONS.car_wash_frequency, carWash, 0)
      weeklyUsage += carWashUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + carWashUsage
      lifestyleUsage['car_wash'] = (lifestyleUsage['car_wash'] || 0) + carWashUsage
    }

    const electronics = this.getAnswerValue(answers, 'weekly_electronics_shopping')
    if (electronics) {
      const electronicsUsage = this.getWaterValue(WATER_CALCULATIONS.weekly_electronics_shopping, electronics, 0)
      weeklyUsage += electronicsUsage
      categoryUsage['lifestyle'] = (categoryUsage['lifestyle'] || 0) + electronicsUsage
      lifestyleUsage['electronics'] = (lifestyleUsage['electronics'] || 0) + electronicsUsage
    }

    // Garden style
    const gardenStyle = this.getAnswerValue(answers, 'garden_style')
    if (gardenStyle) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.garden_style, gardenStyle, 0)
      categoryUsage['garden'] = (categoryUsage['garden'] || 0) + this.getWaterValue(WATER_CALCULATIONS.garden_style, gardenStyle, 0)
    }

    // Irrigation practice
    const irrigation = this.getAnswerValue(answers, 'irrigation_practice')
    if (irrigation) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.irrigation_practice, irrigation, 0)
      categoryUsage['garden'] = (categoryUsage['garden'] || 0) + this.getWaterValue(WATER_CALCULATIONS.irrigation_practice, irrigation, 0)
    }

    // Pool / hot tub
    const poolHotTub = this.getAnswerValue(answers, 'pool_hot_tub')
    if (poolHotTub) {
      weeklyUsage += this.getWaterValue(WATER_CALCULATIONS.pool_hot_tub, poolHotTub, 0)
      categoryUsage['garden'] = (categoryUsage['garden'] || 0) + this.getWaterValue(WATER_CALCULATIONS.pool_hot_tub, poolHotTub, 0)
    }

    // Convert to daily; inputs already represent household totals
    const dailyUsage = weeklyUsage / 7
    const categoryUsageDaily = Object.fromEntries(
      Object.entries(categoryUsage).map(([key, value]) => [key, value / 7])
    )
    const lifestyleUsageDaily = Object.fromEntries(
      Object.entries(lifestyleUsage).map(([key, value]) => [key, value / 7])
    )

    return {
      totalDailyUsage: Math.max(0, dailyUsage),
      categoryUsage: categoryUsageDaily,
      lifestyleUsage: lifestyleUsageDaily,
    }
  }

  private getAnswerValue(answers: Record<string, QuizAnswer>, questionId: string): string | null {
    const answer = answers[questionId]
    return answer ? String(answer.value) : null
  }

  private getNumericAnswer(answers: Record<string, QuizAnswer>, questionId: string): number | null {
    const answer = answers[questionId]
    if (!answer) return null
    const value = answer.value
    if (typeof value === 'number') return value
    const parsed = parseFloat(String(value))
    return isNaN(parsed) ? null : parsed
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
