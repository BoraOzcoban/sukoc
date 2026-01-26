import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LandingPage } from './pages/LandingPage'
import { QuizPage } from './pages/QuizPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language?.startsWith('en') ? 'en' : 'tr'

  return (
    <div className="App">
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
            currentLanguage === 'en'
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-accent-300 bg-white/80 text-accent-700 hover:border-accent-400'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('tr')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
            currentLanguage === 'tr'
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-accent-300 bg-white/80 text-accent-700 hover:border-accent-400'
          }`}
        >
          TR
        </button>
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
