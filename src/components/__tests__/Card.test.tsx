import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../ui/Card'

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card>Test Content</Card>)
    
    const card = screen.getByText('Test Content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('card')
  })

  it('renders with hover variant', () => {
    render(<Card hover>Hover Card</Card>)
    
    expect(screen.getByText('Hover Card')).toHaveClass('card-hover')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom Card</Card>)
    
    expect(screen.getByText('Custom Card')).toHaveClass('custom-class')
  })

  it('handles click events when onClick is provided', () => {
    const handleClick = jest.fn()
    render(<Card onClick={handleClick}>Clickable Card</Card>)
    
    fireEvent.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
  })
})
