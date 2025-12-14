import { Router } from 'express'
import { AnalyticsData, ApiResponse } from '../types'

const router = Router()

// GET /api/analytics - Get aggregated analytics data
router.get('/', (req, res) => {
  try {
    // Mock analytics data - in production, this would be calculated from real user data
    const analyticsData: AnalyticsData = {
      totalUsers: 1247,
      averageSavings: 28.5, // liters per day
      topSuggestions: [
        {
          id: 'teeth_brushing_water_off',
          title: 'Diş Fırçalarken Musluğu Kapatın',
          usageCount: 892,
        },
        {
          id: 'shower_timer',
          title: 'Duş Süresini Kısaltın',
          usageCount: 756,
        },
        {
          id: 'dishwasher_full_loads',
          title: 'Bulaşık Makinesini Dolu Çalıştırın',
          usageCount: 634,
        },
        {
          id: 'water_meter_monitoring',
          title: 'Su Sayacı Takibi',
          usageCount: 521,
        },
        {
          id: 'shower_water_off',
          title: 'Duş Sırasında Suyu Kapatın',
          usageCount: 487,
        },
      ],
      regionalData: [
        {
          region: 'marmara',
          averageUsage: 145.2,
          userCount: 342,
        },
        {
          region: 'ege',
          averageUsage: 138.7,
          userCount: 298,
        },
        {
          region: 'akdeniz',
          averageUsage: 142.1,
          userCount: 267,
        },
        {
          region: 'ic-anadolu',
          averageUsage: 151.3,
          userCount: 189,
        },
        {
          region: 'karadeniz',
          averageUsage: 139.8,
          userCount: 156,
        },
        {
          region: 'dogu-anadolu',
          averageUsage: 148.9,
          userCount: 98,
        },
        {
          region: 'guneydogu-anadolu',
          averageUsage: 153.2,
          userCount: 97,
        },
      ],
    }

    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: analyticsData,
      message: 'Analytics data retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve analytics data'
    })
  }
})

// GET /api/analytics/usage-trends - Get usage trends over time
router.get('/usage-trends', (req, res) => {
  try {
    const { period = '30d' } = req.query

    // Mock trend data - in production, this would query the database
    const trendData = {
      period,
      data: [
        { date: '2024-01-01', users: 1247, averageSavings: 28.5 },
        { date: '2024-01-02', users: 1253, averageSavings: 28.7 },
        { date: '2024-01-03', users: 1261, averageSavings: 29.1 },
        // ... more data points
      ],
    }

    const response: ApiResponse<typeof trendData> = {
      success: true,
      data: trendData,
      message: 'Usage trends retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving usage trends:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve usage trends'
    })
  }
})

// GET /api/analytics/suggestions/effectiveness - Get suggestion effectiveness data
router.get('/suggestions/effectiveness', (req, res) => {
  try {
    // Mock effectiveness data
    const effectivenessData = {
      suggestions: [
        {
          id: 'teeth_brushing_water_off',
          title: 'Diş Fırçalarken Musluğu Kapatın',
          adoptionRate: 0.72, // 72% of users adopt this suggestion
          averageSavings: 11.8,
          difficulty: 'easy',
        },
        {
          id: 'shower_timer',
          title: 'Duş Süresini Kısaltın',
          adoptionRate: 0.61,
          averageSavings: 18.2,
          difficulty: 'easy',
        },
        {
          id: 'dishwasher_full_loads',
          title: 'Bulaşık Makinesini Dolu Çalıştırın',
          adoptionRate: 0.51,
          averageSavings: 5.4,
          difficulty: 'easy',
        },
      ],
    }

    const response: ApiResponse<typeof effectivenessData> = {
      success: true,
      data: effectivenessData,
      message: 'Suggestion effectiveness data retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving suggestion effectiveness:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve suggestion effectiveness data'
    })
  }
})

export { router as analyticsRouter }
