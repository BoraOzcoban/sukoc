import { Router } from 'express'
import { Suggestion, ApiResponse } from '../types'

const router = Router()

// Mock suggestions data - in production, this would come from a database
const suggestions: { [category: string]: Suggestion[] } = {
  daily_hygiene: [
    {
      id: 'teeth_brushing_water_off',
      title: 'Diş Fırçalarken Musluğu Kapatın',
      description: 'Diş fırçalarken musluğu kapatarak günde 12 litre su tasarrufu sağlayabilirsiniz. Basit ama etkili bir alışkanlık.',
      impact: 12,
      difficulty: 'easy',
      feasibility: 0.95,
      category: 'daily_hygiene',
      priority: 11.4,
    },
    {
      id: 'shower_timer',
      title: 'Duş Süresini Kısaltın',
      description: 'Duş sürenizi 2 dakika kısaltarak günde 20 litre su tasarrufu sağlayabilirsiniz. Telefonunuzda bir zamanlayıcı kullanabilirsiniz.',
      impact: 20,
      difficulty: 'easy',
      feasibility: 0.9,
      category: 'daily_hygiene',
      priority: 18.0,
    },
    {
      id: 'shower_water_off',
      title: 'Duş Sırasında Suyu Kapatın',
      description: 'Şampuanlama sırasında musluğu kapatarak günde 15 litre su tasarrufu sağlayabilirsiniz.',
      impact: 15,
      difficulty: 'easy',
      feasibility: 0.8,
      category: 'daily_hygiene',
      priority: 12.0,
    },
  ],
  kitchen: [
    {
      id: 'hand_dishwashing_efficient',
      title: 'Elde Bulaşık Yıkama Tekniği',
      description: 'Bulaşıkları önce deterjanlı suda yıkayıp sonra durulayarak %50 daha az su kullanabilirsiniz.',
      impact: 15,
      difficulty: 'easy',
      feasibility: 0.9,
      category: 'kitchen',
      priority: 13.5,
    },
    {
      id: 'dishwasher_full_loads',
      title: 'Bulaşık Makinesini Dolu Çalıştırın',
      description: 'Bulaşık makinesini sadece dolu olduğunda çalıştırarak haftada 40 litre su tasarrufu sağlayabilirsiniz.',
      impact: 6,
      difficulty: 'easy',
      feasibility: 0.85,
      category: 'kitchen',
      priority: 5.1,
    },
  ],
  laundry: [
    {
      id: 'laundry_full_loads',
      title: 'Çamaşır Makinesini Dolu Çalıştırın',
      description: 'Çamaşır makinesini sadece dolu olduğunda çalıştırarak haftada 30 litre su tasarrufu sağlayabilirsiniz.',
      impact: 4,
      difficulty: 'easy',
      feasibility: 0.9,
      category: 'laundry',
      priority: 3.6,
    },
  ],
  lifestyle: [
    {
      id: 'reduce_meat_consumption',
      title: 'Et Tüketimini Azaltın',
      description: 'Haftada 1-2 gün et yerine sebze/bakliyat tercih ederek yüzlerce litre sanal su tasarrufu sağlayabilirsiniz.',
      impact: 40,
      difficulty: 'medium',
      feasibility: 0.6,
      category: 'lifestyle',
      priority: 24.0,
    },
    {
      id: 'tap_water_instead_bottled',
      title: 'Musluk Suyu Kullanın',
      description: 'Şişelenmiş su yerine filtrelenmiş musluk suyu kullanarak üretim ve taşıma kaynaklı su tüketimini azaltabilirsiniz.',
      impact: 20,
      difficulty: 'easy',
      feasibility: 0.8,
      category: 'lifestyle',
      priority: 16.0,
    },
  ],
  challenges: [
    {
      id: 'challenge_shower_reduction',
      title: 'Duş Süresi Meydan Okuması',
      description: 'Bu hafta duş sürenizi 2 dakika kısaltın ve farkı görün!',
      impact: 20,
      difficulty: 'easy',
      feasibility: 0.9,
      category: 'challenges',
      priority: 18.0,
      isChallenge: true,
      challengeText: 'Bu hafta duş sürenizi 2 dakika kısaltın ve farkı görün!',
    },
    {
      id: 'challenge_teeth_brushing',
      title: 'Diş Fırçalama Alışkanlığı',
      description: 'Bu hafta diş fırçalarken musluğu kapatma alışkanlığı edinin!',
      impact: 12,
      difficulty: 'easy',
      feasibility: 0.95,
      category: 'challenges',
      priority: 11.4,
      isChallenge: true,
      challengeText: 'Bu hafta diş fırçalarken musluğu kapatma alışkanlığı edinin!',
    },
  ],
  general: [
    {
      id: 'water_meter_monitoring',
      title: 'Su Sayacı Takibi',
      description: 'Aylık su sayacı okumalarınızı takip ederek anormal kullanımı erken tespit edin.',
      impact: 8,
      difficulty: 'easy',
      feasibility: 0.6,
      category: 'general',
      priority: 4.8,
    },
  ],
}

// GET /api/suggestions - Get all suggestions
router.get('/', (req, res) => {
  try {
    const response: ApiResponse<{ [category: string]: Suggestion[] }> = {
      success: true,
      data: suggestions,
      message: 'Suggestions retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving suggestions:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve suggestions'
    })
  }
})

// GET /api/suggestions/:category - Get suggestions by category
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params

    if (!suggestions[category]) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: `Category '${category}' not found`
      })
    }

    const response: ApiResponse<Suggestion[]> = {
      success: true,
      data: suggestions[category],
      message: `Suggestions for category '${category}' retrieved successfully`
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving suggestions by category:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve suggestions'
    })
  }
})

// GET /api/suggestions/user/:userId - Get personalized suggestions for user
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params

    // In a real application, this would analyze user's quiz answers
    // and return personalized suggestions based on their usage patterns
    const personalizedSuggestions: Suggestion[] = []

    // Add suggestions from different categories based on mock user data
    Object.values(suggestions).forEach(categorySuggestions => {
      personalizedSuggestions.push(...categorySuggestions.slice(0, 2)) // Top 2 from each category
    })

    // Sort by priority
    personalizedSuggestions.sort((a, b) => b.priority - a.priority)

    const response: ApiResponse<Suggestion[]> = {
      success: true,
      data: personalizedSuggestions,
      message: 'Personalized suggestions retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving personalized suggestions:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve personalized suggestions'
    })
  }
})

export { router as suggestionsRouter }
