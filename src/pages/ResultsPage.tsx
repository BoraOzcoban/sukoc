import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { ResultItem } from '../components/results/ResultItem'
import { ChartWrapper } from '../components/results/ChartWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { results } = useAppStore()
  const [exported, setExported] = useState(false)

  if (!results) {
    navigate('/')
    return null
  }

  const handleAcceptChallenge = (suggestionId: string) => {
    // Add challenge to user's challenges
    // This would typically make an API call
    console.log('Challenge accepted:', suggestionId)
  }

  const handleDeclineChallenge = (suggestionId: string) => {
    // Handle challenge decline
    console.log('Challenge declined:', suggestionId)
  }

  const handleExportPDF = () => {
    // This would generate and download a PDF
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SuKoç - Su Kullanım Analizi',
        text: `Su kullanım analizi sonuçlarım: Günde ${results.currentDailyUsage.toFixed(0)} litre kullanıyorum ve ${results.potentialDailySavings.toFixed(0)} litre tasarruf edebilirim!`,
        url: window.location.href,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Prepare chart data
  const usageData = [
    { name: 'Mevcut Kullanım', value: results.currentDailyUsage },
    { name: 'Potansiyel Tasarruf', value: results.potentialDailySavings },
  ]

  const categoryLabels: Record<string, string> = {
    daily_hygiene: 'Duş/Banyo',
    kitchen: 'Mutfak',
    laundry: 'Çamaşır',
    garden: 'Bahçe',
    bathroom: 'Banyo',
    lifestyle: 'Yaşam Tarzı',
    other: 'Diğer',
  }

  const categoryData = results.categoryBreakdown
    ? Object.entries(results.categoryBreakdown)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
          name: categoryLabels[key] || key,
          value,
        }))
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-accent-900 mb-4">
            {t('results.title')}
          </h1>
          <p className="text-xl text-accent-600 max-w-2xl mx-auto">
            Su kullanım alışkanlıklarınızın analizi tamamlandı. İşte sonuçlarınız ve önerilerimiz:
          </p>
        </motion.div>

        {/* Global Water Crisis Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-red-900 mb-2">
                Dünya Su Krizi
              </h3>
              <div className="text-4xl font-bold text-red-600 mb-2">
                2.2 Milyar
              </div>
              <p className="text-red-700 font-medium">kişi güvenli suya erişemiyor</p>
              <div className="text-2xl font-semibold text-red-800 mt-4">
                4.2 Milyar
              </div>
              <p className="text-red-700">kişi güvenli sanitasyona erişemiyor</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Su Tüketimi Gerçekleri
              </h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                70%
              </div>
              <p className="text-blue-700 font-medium">dünya suyu tarımda kullanılıyor</p>
              <div className="text-2xl font-semibold text-blue-800 mt-4">
                20%
              </div>
              <p className="text-blue-700">endüstriyel kullanım</p>
            </Card>
          </motion.div>
        </div>

        {/* Additional Global Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-4xl mb-3">🏭</div>
              <h4 className="text-lg font-bold text-yellow-900 mb-2">Endüstriyel Kullanım</h4>
              <div className="text-3xl font-bold text-yellow-600 mb-1">1 Hamburger</div>
              <p className="text-yellow-700 text-sm">= 2,400 litre su</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-4xl mb-3">👕</div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Tekstil Sektörü</h4>
              <div className="text-3xl font-bold text-green-600 mb-1">1 Tişört</div>
              <p className="text-green-700 text-sm">= 2,700 litre su</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-4xl mb-3">📱</div>
              <h4 className="text-lg font-bold text-purple-900 mb-2">Teknoloji</h4>
              <div className="text-3xl font-bold text-purple-600 mb-1">1 Telefon</div>
              <p className="text-purple-700 text-sm">= 13,000 litre su</p>
            </Card>
          </motion.div>
        </div>

        {/* Your Personal Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-accent-900 mb-4">
                Sizin Etkiniz
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {results.currentDailyUsage.toFixed(0)} L
                  </div>
                  <p className="text-accent-600 mb-4">Günlük su kullanımınız</p>
                  <div className="text-2xl font-semibold text-accent-700">
                    {results.potentialDailySavings.toFixed(0)} L
                  </div>
                  <p className="text-accent-600">Günlük tasarruf potansiyeliniz</p>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-accent-900 mb-3">Neden Önemli?</h4>
                  <ul className="space-y-2 text-accent-700">
                    <li>• Her litre tasarruf, gelecek nesillere daha fazla su bırakır</li>
                    <li>• Su krizi 2050'de 5.7 milyar kişiyi etkileyecek</li>
                    <li>• Küçük değişiklikler büyük farklar yaratır</li>
                    <li>• Su tasarrufu iklim değişikliğiyle mücadelede kritik</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-accent-900 mb-4">
              Benzer Profildekilerle Karşılaştırma
            </h3>
            <p className="text-lg text-accent-600 mb-4">
              {results.comparison.message}
            </p>
            <div className="flex justify-center">
              <Badge variant={results.comparison.percentile > 70 ? 'warning' : results.comparison.percentile < 30 ? 'success' : 'primary'}>
                %{results.comparison.percentile} persentil
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChartWrapper
              type="bar"
              data={usageData}
              title="Su Kullanımı ve Tasarruf Potansiyeli"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ChartWrapper
              type="pie"
              data={categoryData}
              title="Kullanım Kategorileri"
            />
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-accent-900 mb-4">
              Kişiselleştirilmiş Öneriler
            </h2>
            <p className="text-xl text-accent-600 max-w-2xl mx-auto">
              Size özel olarak hazırlanmış, uygulanabilir su tasarruf önerileri
            </p>
          </div>

          <div className="space-y-6">
            {results.suggestions.slice(0, 5).map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <ResultItem
                  suggestion={suggestion}
                  onAccept={suggestion.isChallenge ? () => handleAcceptChallenge(suggestion.id) : undefined}
                  onDecline={suggestion.isChallenge ? () => handleDeclineChallenge(suggestion.id) : undefined}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            size="lg"
            onClick={handleExportPDF}
            className="flex items-center space-x-2"
          >
            <span>📄</span>
            <span>{exported ? 'PDF İndiriliyor...' : 'PDF Olarak İndir'}</span>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Paylaş</span>
          </Button>

        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="p-8 text-center bg-primary-50 border-primary-200">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              🚀 Sıradaki Adımlar
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">1. Başlayın</h4>
                <p className="text-primary-700 text-sm">
                  En kolay önerilerden birini seçin ve bugün uygulamaya başlayın
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">2. Takip Edin</h4>
                <p className="text-primary-700 text-sm">
                  Su sayacı okumalarınızı takip ederek ilerlemenizi ölçün
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">3. Paylaşın</h4>
                <p className="text-primary-700 text-sm">
                  Başarılarınızı paylaşın ve başkalarına ilham verin
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
