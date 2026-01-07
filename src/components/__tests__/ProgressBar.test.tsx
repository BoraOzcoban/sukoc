import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ui/ProgressBar'

describe('ProgressBar Component', () => {
  it('renders with default props', () => {
    render(<ProgressBar progress={50} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<ProgressBar progress={75} label="Test Progress" />)
    
    expect(screen.getByText('Test Progress')).toBeInTheDocument()
  })

  it('shows percentage when requested', () => {
    render(<ProgressBar progress={60} showPercentage />)
    
    expect(screen.getByText('%60')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<ProgressBar progress={50} size="sm" />)
    expect(screen.getByRole('progressbar').parentElement).toHaveClass('h-2')

    rerender(<ProgressBar progress={50} size="lg" />)
    expect(screen.getByRole('progressbar').parentElement).toHaveClass('h-4')
  })

  it('renders with different colors', () => {
    const { rerender } = render(<ProgressBar progress={50} color="secondary" />)
    expect(screen.getByRole('progressbar')).toHaveClass('from-secondary-400', 'to-secondary-600')

    rerender(<ProgressBar progress={50} color="success" />)
    expect(screen.getByRole('progressbar')).toHaveClass('from-green-400', 'to-green-600')
  })

  it('clamps progress value between 0 and 100', () => {
    const { rerender } = render(<ProgressBar progress={-10} showPercentage />)
    expect(screen.getByText('%0')).toBeInTheDocument()

    rerender(<ProgressBar progress={150} showPercentage />)
    expect(screen.getByText('%100')).toBeInTheDocument()
  })

  it('displays both label and percentage', () => {
    render(<ProgressBar progress={80} label="Loading" showPercentage />)
    
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByText('%80')).toBeInTheDocument()
  })
})
