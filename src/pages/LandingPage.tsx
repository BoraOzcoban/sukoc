import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import clubLogo from '../assets/club-logo.png'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleStartQuiz = () => {
    navigate('/quiz')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent-900 mb-4 sm:mb-6">
                <span className="text-primary-600">SuKoç</span>
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-accent-800 mb-3 sm:mb-4">
                {t('landing.hero.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-accent-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('landing.hero.description')}
              </p>
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                {t('landing.hero.cta')}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:justify-self-end"
            >
              <div className="relative rounded-3xl border border-primary-100 bg-white/70 p-5 sm:p-8 shadow-xl backdrop-blur">
                <div className="flex items-center gap-4">
                  <img
                    src={clubLogo}
                    alt={t('common.logoAlt')}
                    className="h-20 w-20 sm:h-24 sm:w-24 object-contain"
                  />
                </div>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
                <p className="mt-6 text-xs sm:text-sm text-accent-700 leading-relaxed">
                  {t('landing.hero.note')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 hidden text-6xl opacity-20 sm:block"
        >
          💧
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-20 hidden text-4xl opacity-20 sm:block"
        >
          🌱
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-20 hidden text-5xl opacity-20 sm:block"
        >
          💧
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-1/4 hidden text-5xl opacity-20 sm:block"
        >
          🌊
        </motion.div>
      </section>

      {/* Global Water Crisis Stats */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-900 mb-3 sm:mb-4">
              {t('landing.stats.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-red-700 max-w-3xl mx-auto">
              {t('landing.stats.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 sm:p-6 text-center bg-white border-red-200">
                <div className="text-4xl mb-3">🌍</div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                  {t('landing.stats.cards.safeWater.value')}
                </div>
                <p className="text-red-700 text-sm sm:text-base">
                  {t('landing.stats.cards.safeWater.label')}
                </p>
                <p className="mt-2 text-xs text-red-600/80">
                  {t('landing.stats.cards.safeWater.source')}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 sm:p-6 text-center bg-white border-orange-200">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                  {t('landing.stats.cards.agriculture.value')}
                </div>
                <p className="text-orange-700 text-sm sm:text-base">
                  {t('landing.stats.cards.agriculture.label')}
                </p>
                <p className="mt-2 text-xs text-orange-600/80">
                  {t('landing.stats.cards.agriculture.source')}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 sm:p-6 text-center bg-white border-yellow-200">
                <div className="text-4xl mb-3">📈</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                  {t('landing.stats.cards.affected.value')}
                </div>
                <p className="text-yellow-700 text-sm sm:text-base">
                  {t('landing.stats.cards.affected.label')}
                </p>
                <p className="mt-2 text-xs text-yellow-600/80">
                  {t('landing.stats.cards.affected.source')}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 sm:p-6 text-center bg-white border-red-200">
                <div className="text-4xl mb-3">💧</div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                  {t('landing.stats.cards.burger.value')}
                </div>
                <p className="text-red-700 text-sm sm:text-base">
                  {t('landing.stats.cards.burger.label')}
                </p>
                <p className="mt-2 text-xs text-red-600/80">
                  {t('landing.stats.cards.burger.source')}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              SuKoç
            </h3>
            <p className="text-sm sm:text-base text-accent-300 mb-4">
              {t('landing.footer.subtitle')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
