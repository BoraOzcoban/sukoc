import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { ResultItem } from '../components/results/ResultItem'
import { ChartWrapper } from '../components/results/ChartWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { waterCalculator } from '../utils/waterCalculator'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import clubLogo from '../assets/club-logo.png'

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { results, quizAnswers, user, setResults } = useAppStore()
  const [exported, setExported] = useState(false)

  useEffect(() => {
    if (!results) return
    const effectiveUser = user || {
      id: 'guest',
      householdSize: 1,
      region: '',
      mainWaterUses: [],
    }
    const analysis = waterCalculator.calculateWaterUsage(
      quizAnswers,
      effectiveUser.householdSize || 1
    )
    setResults(analysis)
  }, [i18n.language, quizAnswers, setResults, user])

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
    { name: t('results.usageChart.current'), value: results.currentDailyUsage },
    { name: t('results.usageChart.savings'), value: results.potentialDailySavings },
  ]

  const categoryLabels: Record<string, string> = {
    daily_hygiene: t('results.categories.dailyHygiene'),
    kitchen: t('results.categories.kitchen'),
    laundry: t('results.categories.laundry'),
    garden: t('results.categories.garden'),
    bathroom: t('results.categories.bathroom'),
    lifestyle: t('results.categories.lifestyle'),
    other: t('results.categories.other'),
  }

  const lifestyleLabels: Record<string, string> = {
    red_meat: t('results.lifestyle.redMeat'),
    dairy: t('results.lifestyle.dairy'),
    clothing: t('results.lifestyle.clothing'),
    white_meat: t('results.lifestyle.whiteMeat'),
    car_wash: t('results.lifestyle.carWash'),
    electronics: t('results.lifestyle.electronics'),
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

  const usageGroups = [
    {
      min: 5000,
      label: t('results.usageGroups.veryHigh.label'),
      badge: t('results.usageGroups.veryHigh.badge'),
      variant: 'error' as const,
    },
    {
      min: 4000,
      max: 5000,
      label: t('results.usageGroups.high.label'),
      badge: t('results.usageGroups.high.badge'),
      variant: 'warning' as const,
    },
    {
      min: 3000,
      max: 4000,
      label: t('results.usageGroups.medium.label'),
      badge: t('results.usageGroups.medium.badge'),
      variant: 'secondary' as const,
    },
    {
      min: 2000,
      max: 3000,
      label: t('results.usageGroups.low.label'),
      badge: t('results.usageGroups.low.badge'),
      variant: 'success' as const,
    },
    {
      min: 0,
      max: 2000,
      label: t('results.usageGroups.sustainable.label'),
      badge: t('results.usageGroups.sustainable.badge'),
      variant: 'primary' as const,
    },
  ]

  const usageGroup =
    usageGroups.find((group) =>
      typeof group.max === 'number'
        ? results.currentDailyUsage >= group.min && results.currentDailyUsage < group.max
        : results.currentDailyUsage >= group.min
    ) || usageGroups[usageGroups.length - 1]

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
            <div className="absolute top-1/3 right-10 flex h-40 w-40 items-center justify-center rounded-full bg-slate-100/90"></div>

            <div className="absolute inset-0 px-16 py-20 flex flex-col justify-between">
              <div>
                <div className="text-sm tracking-[0.2em] uppercase text-white/70">
                  {t('results.story.branding')}
                </div>
                <h2 className="mt-6 text-5xl font-bold leading-tight">
                  {t('results.story.headline', {
                    current: results.currentDailyUsage.toFixed(1),
                    target: targetDailyUsage.toFixed(1),
                  })}
                </h2>
                <p className="mt-8 text-xl text-white/80">
                  {t('results.story.tagline')}
                </p>
              </div>

              <div className="space-y-8">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <div className="text-sm tracking-[0.2em] uppercase text-white/70">
                    {t('results.story.groupLabel')}
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">
                    {usageGroup.label}
                  </div>
                  <div className="mt-3 text-base text-white/80">
                    {usageGroup.badge}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 text-white/90">
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">
                      {t('results.story.stats.safeWater.value')}
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {t('results.story.stats.safeWater.label')}
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      {t('results.story.stats.safeWater.source')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">
                      {t('results.story.stats.phone.value')}
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {t('results.story.stats.phone.label')}
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      {t('results.story.stats.phone.source')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">
                      {t('results.story.stats.burger.value')}
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {t('results.story.stats.burger.label')}
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      {t('results.story.stats.burger.source')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="text-4xl font-bold">
                      {t('results.story.stats.tshirt.value')}
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {t('results.story.stats.tshirt.label')}
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      {t('results.story.stats.tshirt.source')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/70">
                  <span className="text-sm">{t('results.story.hashtags')}</span>
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
            alt={t('common.logoAlt')}
            className="mx-auto mb-4 h-16 w-16 sm:h-24 sm:w-24 object-contain"
          />
          <h1 className="text-2xl sm:text-4xl font-bold text-accent-900 mb-3 sm:mb-4">
            {t('results.title')}
          </h1>
          <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
            {t('results.subtitle')}
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
                {t('results.personalImpact.title')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
          <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
            {results.currentDailyUsage.toFixed(1)} L
          </div>
          <p className="text-sm sm:text-base text-accent-600 mb-4">
            {t('results.personalImpact.currentUsageLabel')}
          </p>
          <div className="text-xl sm:text-2xl font-semibold text-accent-700">
            {results.potentialDailySavings.toFixed(1)} L
          </div>
                  <p className="text-accent-600">
                    {t('results.personalImpact.savingsLabel')}
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-accent-900 mb-3">
                    {t('results.personalImpact.whyTitle')}
                  </h4>
                  <ul className="space-y-2 text-sm sm:text-base text-accent-700">
                    <li>• {t('results.personalImpact.whyItem1')}</li>
                    <li>• {t('results.personalImpact.whyItem2')}</li>
                    <li>• {t('results.personalImpact.whyItem3')}</li>
                    <li>• {t('results.personalImpact.whyItem4')}</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 rounded-2xl bg-white/70 p-4 sm:p-6">
                <p className="text-sm sm:text-base text-accent-600">
                  {t('results.usageGroupLabel')}
                </p>
                <div className="text-xl sm:text-2xl font-semibold text-accent-900">
                  {usageGroup.label}
                </div>
                <Badge variant={usageGroup.variant} size="lg">
                  {usageGroup.badge}
                </Badge>
                <p className="text-xs sm:text-sm text-accent-600 text-center">
                  {t('results.usageGroupNote')}
                </p>
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
              {t('results.comparison.title')}
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
              title={t('results.charts.usageSavings')}
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
              title={t('results.charts.categories')}
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
              {t('results.suggestionsSection.title')}
            </h2>
            <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
              {t('results.suggestionsSection.subtitle')}
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
                {t('results.otherTips.title')}
              </h2>
              <p className="text-base sm:text-xl text-accent-600 max-w-2xl mx-auto">
                {t('results.otherTips.subtitle')}
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
            <span>
              {exported ? t('results.challenge.joining') : t('results.challenge.join')}
            </span>
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
              {t('results.nextSteps.title')}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">
                  {t('results.nextSteps.step1.title')}
                </h4>
                <p className="text-primary-700 text-sm">
                  {t('results.nextSteps.step1.description')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">
                  {t('results.nextSteps.step2.title')}
                </h4>
                <p className="text-primary-700 text-sm">
                  {t('results.nextSteps.step2.description')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">
                  {t('results.nextSteps.step3.title')}
                </h4>
                <p className="text-primary-700 text-sm">
                  {t('results.nextSteps.step3.description')}
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
                {t('results.globalStats.crisis.title')}
              </h3>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">
                {t('results.globalStats.crisis.safeWaterValue')}
              </div>
              <p className="text-sm sm:text-base text-red-700 font-medium">
                {t('results.globalStats.crisis.safeWaterLabel')}
              </p>
              <p className="mt-2 text-xs text-red-700/80">
                {t('results.globalStats.crisis.safeWaterSource')}
              </p>
              <div className="text-xl sm:text-2xl font-semibold text-red-800 mt-4">
                {t('results.globalStats.crisis.sanitationValue')}
              </div>
              <p className="text-sm sm:text-base text-red-700">
                {t('results.globalStats.crisis.sanitationLabel')}
              </p>
              <p className="mt-2 text-xs text-red-700/80">
                {t('results.globalStats.crisis.sanitationSource')}
              </p>
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
                {t('results.globalStats.usage.title')}
              </h3>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {t('results.globalStats.usage.agricultureValue')}
              </div>
              <p className="text-sm sm:text-base text-blue-700 font-medium">
                {t('results.globalStats.usage.agricultureLabel')}
              </p>
              <p className="mt-2 text-xs text-blue-700/80">
                {t('results.globalStats.usage.agricultureSource')}
              </p>
              <div className="text-xl sm:text-2xl font-semibold text-blue-800 mt-4">
                {t('results.globalStats.usage.industrialValue')}
              </div>
              <p className="text-sm sm:text-base text-blue-700">
                {t('results.globalStats.usage.industrialLabel')}
              </p>
              <p className="mt-2 text-xs text-blue-700/80">
                {t('results.globalStats.usage.industrialSource')}
              </p>
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
              <h4 className="text-base sm:text-lg font-bold text-yellow-900 mb-2">
                {t('results.additionalStats.industry.title')}
              </h4>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                {t('results.additionalStats.industry.value')}
              </div>
              <p className="text-yellow-700 text-sm sm:text-base">
                {t('results.additionalStats.industry.label')}
              </p>
              <p className="mt-2 text-xs text-yellow-700/80">
                {t('results.additionalStats.industry.source')}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-5 sm:p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-3xl sm:text-4xl mb-3">👕</div>
              <h4 className="text-base sm:text-lg font-bold text-green-900 mb-2">
                {t('results.additionalStats.textile.title')}
              </h4>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {t('results.additionalStats.textile.value')}
              </div>
              <p className="text-green-700 text-sm sm:text-base">
                {t('results.additionalStats.textile.label')}
              </p>
              <p className="mt-2 text-xs text-green-700/80">
                {t('results.additionalStats.textile.source')}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-5 sm:p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="text-3xl sm:text-4xl mb-3">📱</div>
              <h4 className="text-base sm:text-lg font-bold text-purple-900 mb-2">
                {t('results.additionalStats.technology.title')}
              </h4>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                {t('results.additionalStats.technology.value')}
              </div>
              <p className="text-purple-700 text-sm sm:text-base">
                {t('results.additionalStats.technology.label')}
              </p>
              <p className="mt-2 text-xs text-purple-700/80">
                {t('results.additionalStats.technology.source')}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
