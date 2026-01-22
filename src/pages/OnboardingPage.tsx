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
    { value: '1', label: '1 kişi' },
    { value: '2', label: '2 kişi' },
    { value: '3', label: '3 kişi' },
    { value: '4', label: '4 kişi' },
    { value: '5', label: '5 kişi' },
    { value: '6+', label: '6 veya daha fazla' },
  ]

  const regionOptions = [
    { value: 'marmara', label: 'Marmara' },
    { value: 'ege', label: 'Ege' },
    { value: 'akdeniz', label: 'Akdeniz' },
    { value: 'ic-anadolu', label: 'İç Anadolu' },
    { value: 'karadeniz', label: 'Karadeniz' },
    { value: 'dogu-anadolu', label: 'Doğu Anadolu' },
    { value: 'guneydogu-anadolu', label: 'Güneydoğu Anadolu' },
  ]

  const waterUseOptions = [
    {
      value: 'shower',
      label: t('onboarding.mainWaterUses.options.shower'),
      description: 'Günlük duş ve banyo kullanımı',
    },
    {
      value: 'kitchen',
      label: t('onboarding.mainWaterUses.options.kitchen'),
      description: 'Mutfak ve bulaşık yıkama',
    },
    {
      value: 'laundry',
      label: t('onboarding.mainWaterUses.options.laundry'),
      description: 'Çamaşır yıkama ve temizlik',
    },
    {
      value: 'garden',
      label: t('onboarding.mainWaterUses.options.garden'),
      description: 'Bahçe ve bitki sulama',
    },
    {
      value: 'car',
      label: t('onboarding.mainWaterUses.options.car'),
      description: 'Araç yıkama ve temizlik',
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.householdSize) {
      newErrors.householdSize = 'Lütfen aile büyüklüğünüzü seçin'
    }

    if (!formData.region) {
      newErrors.region = 'Lütfen yaşadığınız bölgeyi seçin'
    }

    if (formData.mainWaterUses.length === 0) {
      newErrors.mainWaterUses = 'Lütfen en az bir su kullanım alanı seçin'
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
              alt="SuKoç logo"
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
            <p className="text-sm text-accent-500 mt-2">1 / 3</p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
