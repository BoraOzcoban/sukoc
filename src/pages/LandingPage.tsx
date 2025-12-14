import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleStartQuiz = () => {
    navigate('/onboarding')
  }

  const features = [
    {
      icon: '🎯',
      title: t('landing.features.personalized.title'),
      description: t('landing.features.personalized.description'),
    },
    {
      icon: '💡',
      title: t('landing.features.actionable.title'),
      description: t('landing.features.actionable.description'),
    },
    {
      icon: '📊',
      title: t('landing.features.tracking.title'),
      description: t('landing.features.tracking.description'),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-accent-900 mb-6">
                <span className="text-primary-600">SuKoç</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-accent-800 mb-4">
                {t('landing.hero.title')}
              </h2>
              <p className="text-xl text-accent-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('landing.hero.description')}
              </p>
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className="text-lg px-8 py-4"
              >
                {t('landing.hero.cta')}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          💧
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-20 text-4xl opacity-20"
        >
          🌱
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-20 text-5xl opacity-20"
        >
          💧
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-1/4 text-5xl opacity-20"
        >
          🌊
        </motion.div>
      </section>

      {/* Global Water Crisis Stats */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-red-900 mb-4">
              Dünya Su Krizi Gerçekleri
            </h2>
            <p className="text-xl text-red-700 max-w-3xl mx-auto">
              Su krizi sadece bir gelecek sorunu değil, bugün yaşadığımız gerçek bir kriz
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center bg-white border-red-200">
                <div className="text-4xl mb-3">🌍</div>
                <div className="text-3xl font-bold text-red-600 mb-2">2.2 Milyar</div>
                <p className="text-red-700 text-sm">kişi güvenli suya erişemiyor</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center bg-white border-orange-200">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">70%</div>
                <p className="text-orange-700 text-sm">dünya suyu tarımda kullanılıyor</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center bg-white border-yellow-200">
                <div className="text-4xl mb-3">📈</div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">5.7 Milyar</div>
                <p className="text-yellow-700 text-sm">kişi 2050'de etkilenecek</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 text-center bg-white border-red-200">
                <div className="text-4xl mb-3">💧</div>
                <div className="text-3xl font-bold text-red-600 mb-2">1 Hamburger</div>
                <p className="text-red-700 text-sm">= 2,400 litre su</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-accent-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SuKoç</h3>
            <p className="text-accent-300 mb-4">
              Su tasarrufu için akıllı çözümler
            </p>
            <p className="text-accent-400 text-sm">
              © 2024 SuKoç. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
