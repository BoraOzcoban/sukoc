import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from '../ui/RadioGroup'

describe('RadioGroup Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', description: 'Description for option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  it('renders with default props', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        onChange={handleChange}
      />
    )
    
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
  })

  it('renders with label', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        label="Test Group"
        options={options}
        onChange={handleChange}
      />
    )
    
    expect(screen.getByText('Test Group')).toBeInTheDocument()
  })

  it('handles option selection', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        onChange={handleChange}
      />
    )
    
    const option1 = screen.getByLabelText('Option 1')
    fireEvent.click(option1)
    
    expect(handleChange).toHaveBeenCalledWith('option1')
  })

  it('shows selected value', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        value="option2"
        onChange={handleChange}
      />
    )
    
    const option2 = screen.getByLabelText('Option 2')
    expect(option2).toBeChecked()
  })

  it('renders option descriptions', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        onChange={handleChange}
      />
    )
    
    expect(screen.getByText('Description for option 2')).toBeInTheDocument()
  })

  it('shows error message', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        error="Please select an option"
        onChange={handleChange}
      />
    )
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup
        name="test-group"
        options={options}
        className="custom-class"
        onChange={handleChange}
      />
    )
    
    const radioGroup = screen.getByRole('group')
    expect(radioGroup).toHaveClass('custom-class')
  })
})
