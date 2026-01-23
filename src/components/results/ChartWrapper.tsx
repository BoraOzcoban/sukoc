import React from 'react'
import { Card } from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface ChartWrapperProps {
  type: 'bar' | 'pie'
  data: any[]
  title: string
  className?: string
}

const COLORS = ['#22c55e', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6']

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  data,
  title,
  className = '',
}) => {
  const pieTotal = type === 'pie' ? data.reduce((sum, item) => sum + (item.value || 0), 0) : 0
  const pieData = type === 'pie'
    ? data.map((item) => ({
        ...item,
        percent: pieTotal ? item.value / pieTotal : 0,
      }))
    : data

  const renderPieLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
    if (!percent || percent < 0.05) return null
    const radius = outerRadius + 14
    const angle = -midAngle * (Math.PI / 180)
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    const textAnchor = x > cx ? 'start' : 'end'
    return (
      <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fill="#1f2937" fontSize={11}>
        {`${name} %${(percent * 100).toFixed(0)}`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = typeof payload[0].value === 'number' ? payload[0].value : Number(payload[0].value)
      const formattedValue = Number.isFinite(value) ? value.toFixed(1) : payload[0].value
      return (
        <div className="bg-white p-3 border border-accent-200 rounded-lg shadow-lg">
          <p className="font-medium text-accent-900">{label}</p>
          <p className="text-primary-600">
            {formattedValue} litre
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-accent-900 mb-4 sm:mb-6">{title}</h3>
      
      <div className="h-64 sm:h-80">
        {type === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={11}
                label={{ value: 'Litre', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine
                label={renderPieLabel}
                outerRadius={90}
                paddingAngle={3}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => {
                const numericValue = typeof value === 'number' ? value : Number(value)
                return [`${Number.isFinite(numericValue) ? numericValue.toFixed(1) : value} litre`, 'Değer']
              }} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value, entry: any) =>
                  `${value} ${entry?.payload?.percent ? `(%${Math.round(entry.payload.percent * 100)})` : ''}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
