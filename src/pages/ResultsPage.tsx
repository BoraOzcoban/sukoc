import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { ResultItem } from '../components/results/ResultItem'
import { ChartWrapper } from '../components/results/ChartWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import clubLogo from '../assets/club-logo.png'

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
    const storyElement = document.getElementById('sukoc-story-export')
    if (!storyElement) return

    setExported(true)
    html2canvas(storyElement, { scale: 2 })
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [1080, 1920],
        })
        pdf.addImage(imageData, 'PNG', 0, 0, 1080, 1920)
        pdf.save('sukoc-story.pdf')
      })
      .finally(() => {
        setTimeout(() => setExported(false), 1000)
      })
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

  const lifestyleLabels: Record<string, string> = {
    red_meat: 'Kırmızı Et',
    dairy: 'Süt Ürünleri',
    clothing: 'Giyim',
    white_meat: 'Beyaz Et',
    car_wash: 'Araç Yıkama',
    electronics: 'Elektronik',
  }

  const lifestyleData = results.lifestyleBreakdown
    ? Object.entries(results.lifestyleBreakdown)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
          name: lifestyleLabels[key] || key,
          value,
        }))
    : []

  const targetDailyUsage = Math.max(
    0,
    results.currentDailyUsage - results.potentialDailySavings
  )

  const categoryData = results.categoryBreakdown
    ? Object.entries(results.categoryBreakdown)
        .filter(([, value]) => value > 0)
        .flatMap(([key, value]) => {
          if (key === 'lifestyle' && lifestyleData.length > 0) {
            return lifestyleData
          }
          return [{ name: categoryLabels[key] || key, value }]
        })
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div
          id="sukoc-story-export"
          className="fixed left-[-9999px] top-0"
          style={{ width: 1080, height: 1920 }}
        >
          <div className="w-full h-full relative overflow-hidden text-white bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900">
            <div className="absolute -top-24 -right-32 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-10 w-40 h-40 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-16 w-28 h-28 border border-white/10 rounded-full"></div>
            <div className="absolute top-1/3 right-10 flex h-40 w-40 items-center justify-center rounded-full bg-slate-100/90">
              <img
                src={clubLogo}
                alt="SuKoç logo"
                className="h-28 w-28 object-contain"
              />
            </div>

            <div className="absolute inset-0 px-16 py-20 flex flex-col justify-between">
              <div>
                <div className="text-sm tracking-[0.4em] uppercase text-white/70">
                  SuKoç
                </div>
                <h2 className="mt-6 text-5xl font-bold leading-tight">
                  Günlük su ayak izim {results.currentDailyUsage.toFixed(1)} litre civarında,
                  bunu {targetDailyUsage.toFixed(1)} litreye düşürmek için SuKoç'un önerilerini uygulayacağım.
                </h2>
                <p className="mt-8 text-xl text-white/80">
                  Küçük değişiklikler, büyük tasarruf.
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8 text-white/90">
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">2.2 Milyar</div>
                    <p className="mt-2 text-sm text-white/70">kişi güvenli suya erişemiyor</p>
                    <p className="mt-2 text-xs text-white/60">Kaynak: UNICEF</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">13.000 L</div>
                    <p className="mt-2 text-sm text-white/70">1 telefon üretimi için gereken su</p>
                    <p className="mt-2 text-xs text-white/60">Kaynak: MindYourStep</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">2.400 L</div>
                    <p className="mt-2 text-sm text-white/70">1 hamburgerin su ayak izi</p>
                    <p className="mt-2 text-xs text-white/60">Kaynak: The Game Changers belgeseli</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">2.700 L</div>
                    <p className="mt-2 text-sm text-white/70">1 tişört üretimi için su</p>
                    <p className="mt-2 text-xs text-white/60">Kaynak: EEA</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/70">
                  <span className="text-sm">#SuKoç #SuAyakİzi</span>
                  <span className="text-sm">sukoc.app</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <img
            src={clubLogo}
            alt="SuKoç logo"
            className="mx-auto mb-4 h-16 w-16 sm:h-24 sm:w-24 object-contain"
          />
          <h1 className="text-2xl sm:text-4xl font-bold text-accent-900 mb-3 sm:mb-4">
            {t('results.title')}
          </h1>
          <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
            Su kullanım alışkanlıklarınızın analizi tamamlandı. İşte sonuçlarınız ve önerilerimiz:
          </p>
        </motion.div>

        {/* Your Personal Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8 sm:mb-12"
        >
          <Card className="p-5 sm:p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-accent-900 mb-4">
                Sizin Etkiniz
              </h3>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
          <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
            {results.currentDailyUsage.toFixed(1)} L
          </div>
          <p className="text-sm sm:text-base text-accent-600 mb-4">Günlük su kullanımınız</p>
          <div className="text-xl sm:text-2xl font-semibold text-accent-700">
            {results.potentialDailySavings.toFixed(1)} L
          </div>
                  <p className="text-accent-600">Günlük tasarruf potansiyeliniz</p>
                </div>
                <div className="text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-accent-900 mb-3">Neden Önemli?</h4>
                  <ul className="space-y-2 text-sm sm:text-base text-accent-700">
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
          className="mb-8 sm:mb-12"
        >
          <Card className="p-5 sm:p-8 text-center">
            <div className="text-4xl sm:text-5xl mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-semibold text-accent-900 mb-3 sm:mb-4">
              Benzer Profildekilerle Karşılaştırma
            </h3>
            <p className="text-sm sm:text-lg text-accent-600 mb-4">
              {results.comparison.message}
            </p>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
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
          className="mb-8 sm:mb-12"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-accent-900 mb-3 sm:mb-4">
              Kişiselleştirilmiş Öneriler
            </h2>
            <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
              Size özel olarak hazırlanmış, uygulanabilir su tasarruf önerileri
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {results.suggestions
              .filter(suggestion => !suggestion.isOtherTip)
              .map((suggestion, index) => (
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

        {results.suggestions.some(suggestion => suggestion.isOtherTip) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mb-8 sm:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-accent-900 mb-3 sm:mb-4">
                Diğer İpuçları
              </h2>
              <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
                Genel farkındalık ve alışkanlıklar için ek öneriler
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {results.suggestions
                .filter(suggestion => suggestion.isOtherTip)
                .map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.08 }}
                  >
                    <ResultItem suggestion={suggestion} />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-6 sm:mb-8"
        >
          <Button
            size="lg"
            onClick={handleExportPDF}
            className="flex w-full sm:w-auto items-center justify-center space-x-2"
          >
            <span>📄</span>
            <span>{exported ? "Challenge'a Katılıyor..." : "Challenge'a Katıl"}</span>
          </Button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-6"
        >
          <Card className="p-5 sm:p-8 text-center bg-primary-50 border-primary-200">
            <h3 className="text-xl sm:text-2xl font-bold text-primary-900 mb-4">
              🚀 Sıradaki Adımlar
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
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

        {/* Global Water Crisis Stats */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5 sm:p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-2">
                Dünya Su Krizi
              </h3>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                2.2 Milyar
              </div>
              <p className="text-sm sm:text-base text-red-700 font-medium">kişi güvenli suya erişemiyor</p>
              <p className="mt-2 text-xs text-red-700/80">Kaynak: UNICEF</p>
              <div className="text-xl sm:text-2xl font-semibold text-red-800 mt-4">
                4.2 Milyar
              </div>
              <p className="text-sm sm:text-base text-red-700">kişi güvenli sanitasyona erişemiyor</p>
              <p className="mt-2 text-xs text-red-700/80">Kaynak: WHO</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-5 sm:p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
                Su Tüketimi Gerçekleri
              </h3>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                %70
              </div>
              <p className="text-sm sm:text-base text-blue-700 font-medium">dünya suyu tarımda kullanılıyor</p>
              <p className="mt-2 text-xs text-blue-700/80">Kaynak: UN</p>
              <div className="text-xl sm:text-2xl font-semibold text-blue-800 mt-4">
                %20
              </div>
              <p className="text-sm sm:text-base text-blue-700">endüstriyel kullanım</p>
              <p className="mt-2 text-xs text-blue-700/80">Kaynak: UN</p>
            </Card>
          </motion.div>
        </div>

        {/* Additional Global Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-5 sm:p-6 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-3xl sm:text-4xl mb-3">🏭</div>
              <h4 className="text-base sm:text-lg font-bold text-yellow-900 mb-2">Endüstriyel Kullanım</h4>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">1 Hamburger</div>
              <p className="text-yellow-700 text-sm sm:text-base">= 2.400 litre su</p>
              <p className="mt-2 text-xs text-yellow-700/80">Kaynak: The Game Changers belgeseli</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-5 sm:p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-3xl sm:text-4xl mb-3">👕</div>
              <h4 className="text-base sm:text-lg font-bold text-green-900 mb-2">Tekstil Sektörü</h4>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">1 Tişört</div>
              <p className="text-green-700 text-sm sm:text-base">= 2.700 litre su</p>
              <p className="mt-2 text-xs text-green-700/80">Kaynak: EEA</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-5 sm:p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-3xl sm:text-4xl mb-3">📱</div>
              <h4 className="text-base sm:text-lg font-bold text-purple-900 mb-2">Teknoloji</h4>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">1 Telefon</div>
              <p className="text-purple-700 text-sm sm:text-base">= 13.000 litre su</p>
              <p className="mt-2 text-xs text-purple-700/80">Kaynak: MindYourStep</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
