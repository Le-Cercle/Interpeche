import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { SEO } from './SEO'

describe('SEO Component', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('should set document title', () => {
    render(
      <SEO
        title="Test Page"
        description="Test description"
      />
    )
    expect(document.title).toBe('Test Page')
  })

  it('should set meta description', () => {
    render(
      <SEO
        title="Test Page"
        description="Test description"
      />
    )
    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription?.getAttribute('content')).toBe('Test description')
  })

  it('should set Open Graph meta tags', () => {
    render(
      <SEO
        title="Test Page"
        description="Test description"
        image="/test-image.png"
        url="https://example.com"
        type="article"
      />
    )

    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Test Page')
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Test description')
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('/test-image.png')
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://example.com')
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article')
  })

  it('should set Twitter meta tags', () => {
    render(
      <SEO
        title="Test Page"
        description="Test description"
        image="/test-image.png"
      />
    )

    expect(document.querySelector('meta[property="twitter:title"]')?.getAttribute('content')).toBe('Test Page')
    expect(document.querySelector('meta[property="twitter:description"]')?.getAttribute('content')).toBe('Test description')
    expect(document.querySelector('meta[property="twitter:image"]')?.getAttribute('content')).toBe('/test-image.png')
    expect(document.querySelector('meta[property="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image')
  })

  it('should use default values when not provided', () => {
    render(<SEO />)
    expect(document.title).toBe('Interpêche CI — Au service des acteurs de la filière pêche')
  })

  it('should update meta tags when props change', () => {
    const { rerender } = render(
      <SEO title="Page 1" description="Description 1" />
    )
    expect(document.title).toBe('Page 1')

    rerender(
      <SEO title="Page 2" description="Description 2" />
    )
    expect(document.title).toBe('Page 2')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Description 2')
  })
})
