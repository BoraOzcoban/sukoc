import React from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  label?: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <fieldset className="mb-4">
          <legend className="text-sm font-medium text-accent-700">
            {label}
          </legend>
        </fieldset>
      )}
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${
              value === option.value
                ? 'border-primary-300 bg-primary-50'
                : 'border-accent-200 hover:border-accent-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-accent-300"
            />
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-accent-900">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-accent-500 mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
