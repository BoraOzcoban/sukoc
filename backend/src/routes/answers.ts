import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { QuizAnswer, QuizSession, ApiResponse } from '../types'

const router = Router()

// Mock database - in production, this would be a real database
const quizSessions: QuizSession[] = []

// POST /api/answers - Save quiz answers
router.post('/', (req, res) => {
  try {
    const { userId, answers } = req.body

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: 'userId and answers array are required'
      })
    }

    // Validate answers
    const validAnswers: QuizAnswer[] = answers.filter((answer: any) => 
      answer.questionId && answer.value !== undefined && answer.category
    )

    if (validAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid answers provided',
        message: 'At least one valid answer is required'
      })
    }

    // Create or update quiz session
    const existingSession = quizSessions.find(session => 
      session.userId === userId && !session.completedAt
    )

    let quizSession: QuizSession

    if (existingSession) {
      // Update existing session
      existingSession.answers = validAnswers
      quizSession = existingSession
    } else {
      // Create new session
      quizSession = {
        id: uuidv4(),
        userId,
        answers: validAnswers,
        createdAt: new Date(),
      }
      quizSessions.push(quizSession)
    }

    const response: ApiResponse<QuizSession> = {
      success: true,
      data: quizSession,
      message: 'Quiz answers saved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error saving quiz answers:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to save quiz answers'
    })
  }
})

// PUT /api/answers/:sessionId/complete - Mark quiz as completed
router.put('/:sessionId/complete', (req, res) => {
  try {
    const { sessionId } = req.params

    const session = quizSessions.find(s => s.id === sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Quiz session not found'
      })
    }

    session.completedAt = new Date()

    const response: ApiResponse<QuizSession> = {
      success: true,
      data: session,
      message: 'Quiz marked as completed'
    }

    res.json(response)
  } catch (error) {
    console.error('Error completing quiz:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to complete quiz'
    })
  }
})

// GET /api/answers/:userId - Get user's quiz history
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params

    const userSessions = quizSessions
      .filter(session => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const response: ApiResponse<QuizSession[]> = {
      success: true,
      data: userSessions,
      message: 'User quiz history retrieved successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error retrieving quiz history:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve quiz history'
    })
  }
})

export { router as answersRouter }
