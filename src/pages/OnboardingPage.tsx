import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import clubLogo from '../assets/club-logo.png'

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setUser, setOnboardingCompleted } = useAppStore()

  const [formData, setFormData] = useState({
    householdSize: '',
    region: '',
    mainWaterUses: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const householdSizeOptions = [
    { value: '1', label: t('onboarding.householdSize.options.one') },
    { value: '2', label: t('onboarding.householdSize.options.two') },
    { value: '3', label: t('onboarding.householdSize.options.three') },
    { value: '4', label: t('onboarding.householdSize.options.four') },
    { value: '5', label: t('onboarding.householdSize.options.five') },
    { value: '6+', label: t('onboarding.householdSize.options.sixPlus') },
  ]

  const regionOptions = [
    { value: 'marmara', label: t('onboarding.region.options.marmara') },
    { value: 'ege', label: t('onboarding.region.options.ege') },
    { value: 'akdeniz', label: t('onboarding.region.options.akdeniz') },
    { value: 'ic-anadolu', label: t('onboarding.region.options.icAnadolu') },
    { value: 'karadeniz', label: t('onboarding.region.options.karadeniz') },
    { value: 'dogu-anadolu', label: t('onboarding.region.options.doguAnadolu') },
    { value: 'guneydogu-anadolu', label: t('onboarding.region.options.guneydoguAnadolu') },
  ]

  const waterUseOptions = [
    {
      value: 'shower',
      label: t('onboarding.mainWaterUses.options.shower'),
      description: t('onboarding.mainWaterUses.descriptions.shower'),
    },
    {
      value: 'kitchen',
      label: t('onboarding.mainWaterUses.options.kitchen'),
      description: t('onboarding.mainWaterUses.descriptions.kitchen'),
    },
    {
      value: 'laundry',
      label: t('onboarding.mainWaterUses.options.laundry'),
      description: t('onboarding.mainWaterUses.descriptions.laundry'),
    },
    {
      value: 'garden',
      label: t('onboarding.mainWaterUses.options.garden'),
      description: t('onboarding.mainWaterUses.descriptions.garden'),
    },
    {
      value: 'car',
      label: t('onboarding.mainWaterUses.options.car'),
      description: t('onboarding.mainWaterUses.descriptions.car'),
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.householdSize) {
      newErrors.householdSize = t('onboarding.errors.householdSize')
    }

    if (!formData.region) {
      newErrors.region = t('onboarding.errors.region')
    }

    if (formData.mainWaterUses.length === 0) {
      newErrors.mainWaterUses = t('onboarding.errors.mainWaterUses')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const user = {
      id: `user-${Date.now()}`,
      householdSize: parseInt(formData.householdSize),
      region: formData.region,
      mainWaterUses: formData.mainWaterUses,
      createdAt: new Date(),
    }

    setUser(user)
    setOnboardingCompleted(true)
    navigate('/quiz')
  }

  const handleWaterUseChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      mainWaterUses: prev.mainWaterUses.includes(value)
        ? prev.mainWaterUses.filter(use => use !== value)
        : [...prev.mainWaterUses, value]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={clubLogo}
              alt={t('common.logoAlt')}
              className="mx-auto mb-4 h-28 w-28 object-contain"
            />
            <h1 className="text-3xl font-bold text-accent-900 mb-2">
              {t('onboarding.title')}
            </h1>
            <p className="text-accent-600 leading-relaxed">
              {t('onboarding.subtitle')}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Household Size */}
            <Select
              label={t('onboarding.householdSize.label')}
              options={householdSizeOptions}
              value={formData.householdSize}
              onChange={(e) => setFormData(prev => ({ ...prev, householdSize: e.target.value }))}
              error={errors.householdSize}
              required
            />

            {/* Region */}
            <Select
              label={t('onboarding.region.label')}
              options={regionOptions}
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              error={errors.region}
              required
            />

            {/* Main Water Uses */}
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-3">
                {t('onboarding.mainWaterUses.label')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="space-y-3">
                {waterUseOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
                      formData.mainWaterUses.includes(option.value)
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-accent-200 hover:border-accent-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.mainWaterUses.includes(option.value)}
                      onChange={() => handleWaterUseChange(option.value)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-accent-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-accent-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-accent-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              {errors.mainWaterUses && (
                <p className="mt-2 text-sm text-red-600">{errors.mainWaterUses}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
              >
                {t('onboarding.continue')}
              </Button>
            </div>
          </form>

          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step === 1 ? 'bg-primary-500' : 'bg-accent-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-accent-500 mt-2">
              {t('onboarding.stepCount', { current: 1, total: 3 })}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
