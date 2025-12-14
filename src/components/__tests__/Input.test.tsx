import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../ui/Input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('input-field')
  })

  it('renders with label', () => {
    render(<Input label="Test Label" />)
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(<Input label="Required Field" required />)
    
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input error="This field is required" />)
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300')
  })

  it('shows helper text', () => {
    render(<Input helperText="This is helpful information" />)
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test input' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test input')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('does not show helper text when error is present', () => {
    render(
      <Input 
        error="This field is required" 
        helperText="This should not show" 
      />
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.queryByText('This should not show')).not.toBeInTheDocument()
  })
})
