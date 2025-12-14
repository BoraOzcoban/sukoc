const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const quizSessions = [];
const suggestions = {
  shower: [
    {
      id: 'shower_timer',
      title: 'Duş Süresini Kısaltın',
      description: 'Duş sürenizi 2 dakika kısaltarak günde 20 litre su tasarrufu sağlayabilirsiniz.',
      impact: 20,
      difficulty: 'easy',
      feasibility: 0.9,
      category: 'shower',
      priority: 18.0,
    },
    {
      id: 'shower_water_off',
      title: 'Duş Sırasında Suyu Kapatın',
      description: 'Şampuanlama sırasında musluğu kapatarak günde 15 litre su tasarrufu sağlayabilirsiniz.',
      impact: 15,
      difficulty: 'easy',
      feasibility: 0.8,
      category: 'shower',
      priority: 12.0,
    },
  ],
  dental: [
    {
      id: 'teeth_brushing_water_off',
      title: 'Diş Fırçalarken Musluğu Kapatın',
      description: 'Diş fırçalarken musluğu kapatarak günde 12 litre su tasarrufu sağlayabilirsiniz.',
      impact: 12,
      difficulty: 'easy',
      feasibility: 0.95,
      category: 'dental',
      priority: 11.4,
    },
  ],
  kitchen: [
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
};

// Routes
// POST /api/answers - Save quiz answers
app.post('/api/answers', (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: 'userId and answers array are required'
      });
    }

    const validAnswers = answers.filter((answer) => 
      answer.questionId && answer.value !== undefined && answer.category
    );

    if (validAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid answers provided',
        message: 'At least one valid answer is required'
      });
    }

    const existingSession = quizSessions.find(session => 
      session.userId === userId && !session.completedAt
    );

    let quizSession;

    if (existingSession) {
      existingSession.answers = validAnswers;
      quizSession = existingSession;
    } else {
      quizSession = {
        id: uuidv4(),
        userId,
        answers: validAnswers,
        createdAt: new Date(),
      };
      quizSessions.push(quizSession);
    }

    res.json({
      success: true,
      data: quizSession,
      message: 'Quiz answers saved successfully'
    });
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to save quiz answers'
    });
  }
});

// GET /api/suggestions - Get all suggestions
app.get('/api/suggestions', (req, res) => {
  try {
    res.json({
      success: true,
      data: suggestions,
      message: 'Suggestions retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve suggestions'
    });
  }
});

// GET /api/analytics - Get analytics data
app.get('/api/analytics', (req, res) => {
  try {
    const analyticsData = {
      totalUsers: 1247,
      averageSavings: 28.5,
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
      ],
    };

    res.json({
      success: true,
      data: analyticsData,
      message: 'Analytics data retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve analytics data'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
