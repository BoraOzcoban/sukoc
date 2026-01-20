import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LandingPage } from '../LandingPage'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const LandingPageWithRouter = () => (
  <BrowserRouter>
    <LandingPage />
  </BrowserRouter>
)

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders main heading', () => {
    render(<LandingPageWithRouter />)
    
    expect(screen.getByText('SuKoç')).toBeInTheDocument()
  })

  it('renders hero section', () => {
    render(<LandingPageWithRouter />)
    
    expect(screen.getByText(/Su tasarrufuna başlamak/i)).toBeInTheDocument()
  })

  it('renders features section', () => {
    render(<LandingPageWithRouter />)
    
    expect(screen.getByText('Neden SuKoç?')).toBeInTheDocument()
    expect(screen.getByText('Kişiselleştirilmiş Analiz')).toBeInTheDocument()
    expect(screen.getByText('Uygulanabilir Öneriler')).toBeInTheDocument()
    expect(screen.getByText('İlerleme Takibi')).toBeInTheDocument()
  })

  it('renders testimonial section', () => {
    render(<LandingPageWithRouter />)
    
    expect(screen.getByText(/SuKoç sayesinde/i)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<LandingPageWithRouter />)
    
    const ctaButtons = screen.getAllByText(/quiz/i)
    expect(ctaButtons.length).toBeGreaterThan(0)
  })

  it('renders footer', () => {
    render(<LandingPageWithRouter />)
    
    expect(screen.getByText(/SuKoç/i)).toBeInTheDocument()
  })
})
