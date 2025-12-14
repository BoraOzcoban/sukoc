import React from 'react'
import { Card } from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-accent-200 rounded-lg shadow-lg">
          <p className="font-medium text-accent-900">{label}</p>
          <p className="text-primary-600">
            {payload[0].value} litre
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-accent-900 mb-6">{title}</h3>
      
      <div className="h-80">
        {type === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
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
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} litre`, 'Değer']} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
