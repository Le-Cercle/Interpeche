import { useEffect } from 'react'

const BASE_URL = 'https://interpeche-ci.com'

export function SEO({
  title = 'Interpêche CI — Au service des acteurs de la filière pêche',
  description = "Interprofession de la filière pêche Côte d'Ivoire. 500+ membres, 50+ événements, 20+ partenaires.",
  image = '/og-home.png',
  url,
  type = 'website',
}) {
  const canonicalUrl = url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : `${BASE_URL}${window.location.pathname}`
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`

  useEffect(() => {
    document.title = title

    updateMetaTag('description', description)
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('og:image', absoluteImage)
    updateMetaTag('og:image:width', '1200')
    updateMetaTag('og:image:height', '630')
    updateMetaTag('og:url', canonicalUrl)
    updateMetaTag('og:type', type)
    updateMetaTag('og:locale', 'fr_CI')
    updateMetaTag('og:site_name', 'Interpêche CI')
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:site', '@interpeche_ci')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', absoluteImage)

    updateCanonical(canonicalUrl)

    return () => {
      document.title = 'Interpêche CI'
    }
  }, [title, description, absoluteImage, canonicalUrl, type])

  return null
}

function updateMetaTag(name, content) {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      element.setAttribute('property', name)
    } else {
      element.setAttribute('name', name)
    }
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}
